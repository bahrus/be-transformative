import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeTransformativeController extends EventTarget {
    #abortControllers = [];
    async intro(proxy, target, beDecorProps) {
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe));
        for (const paramKey in params) {
            const fn = async (e) => {
                const pram = params[e.type];
                let firstTime = false;
                const { getHost } = await import('trans-render/lib/getHost.js');
                const host = (getHost(proxy, true) || document);
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
                // if(target.dataset.useFlip){
                //     const {Flipping} = await import('./flipping/index.js');
                // }
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
                const ac = new AbortController();
                this.#abortControllers.push(ac);
                proxy.addEventListener(paramKey, fn, {
                    signal: ac.signal,
                });
                const on = paramKey;
                const { nudge } = await import('trans-render/lib/nudge.js');
                nudge(proxy);
            }
        }
        proxy.resolved = true;
    }
    finale(proxy, target) {
        for (const ac of this.#abortControllers) {
            ac.abort();
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
            virtualProps: ['ctx', 'firstTime'],
            intro: 'intro',
            finale: 'finale',
        }
    },
    complexPropDefaults: {
        controller: BeTransformativeController
    }
});
register(ifWantsToBe, upgrade, tagName);
