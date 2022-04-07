import { define } from 'be-decorated/be-decorated.js';
import { getVal } from 'be-decorated/upgrade.js';
import { register } from 'be-hive/register.js';
export class BeTransformativeController {
    async intro(proxy, target, beDecorProps) {
        let params;
        if (beDecorProps.virtualPropsMap.has(target) !== undefined) {
            params = beDecorProps.virtualPropsMap.get(target);
        }
        if (params === undefined) {
            const val = getVal(target, beDecorProps.ifWantsToBe);
            const attr = val[0];
            params = JSON.parse(attr);
            beDecorProps.virtualPropsMap.set(target, params);
        }
        for (const paramKey in params) {
            const fn = async (e) => {
                const pram = params[e.type];
                let firstTime = false;
                const { getHost } = await import('trans-render/lib/getHost.js');
                const host = getHost(proxy, true);
                if (proxy.ctx === undefined) {
                    firstTime = true;
                    proxy.ctx = {
                        match: pram.transform,
                        host,
                        plugins: pram.transformPlugins,
                    };
                    proxy.ctx.ctx = proxy.ctx;
                }
                if (!firstTime) {
                    proxy.ctx.match = pram.transform;
                }
                const hostLastEvent = host.lastEvent;
                host.lastEvent = e;
                const target = pram.transformFromClosest !== undefined ?
                    proxy.closest(pram.transformFromClosest)
                    : host.shadowRoot || host;
                if (target === null)
                    throw 'Could not locate target';
                const { DTR } = await import('trans-render/lib/DTR.js');
                if (target.dataset.useFlip) {
                    const { Flipping } = await import('./flipping/index.js');
                }
                await DTR.transform(target, proxy.ctx);
                host.lastEvent = hostLastEvent;
            };
            if (paramKey === '') {
                const ev = {
                    type: '',
                };
                fn(ev);
            }
            else {
                proxy.addEventListener(paramKey, fn);
                if (proxy.eventHandlers === undefined)
                    proxy.eventHandlers = [];
                const on = paramKey;
                proxy.eventHandlers.push({ on, elementToObserve: proxy, fn });
                const { nudge } = await import('trans-render/lib/nudge.js');
                nudge(proxy);
            }
        }
    }
    finale(proxy, target) {
        const eventHandlers = proxy.eventHandlers;
        for (const eh of eventHandlers) {
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
    }
}
const tagName = 'be-transformative';
const ifWantsToBe = 'transformative';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            noParse: true,
            virtualProps: ['eventHandlers', 'ctx', 'firstTime', 'qCache'],
            intro: 'intro',
            finale: 'finale',
        }
    },
    complexPropDefaults: {
        controller: BeTransformativeController
    }
});
register(ifWantsToBe, upgrade, tagName);
