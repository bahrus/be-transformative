import { define } from 'be-decorated/be-decorated.js';
import { getHost } from 'trans-render/lib/getHost.js';
import { transform } from 'trans-render/lib/transform.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { nudge } from 'trans-render/lib/nudge.js';
export class BeTransformativeController {
    intro(proxy, target, beDecorProps) {
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe));
        for (const paramKey in params) {
            //const pram = params[paramKey];
            const fn = (e) => {
                const pram = params[e.type];
                let firstTime = false;
                const host = getHost(proxy);
                if (proxy.ctx === undefined) {
                    firstTime = true;
                    proxy.qCache = new WeakMap();
                    proxy.ctx = {
                        match: pram.initTransform || pram.transform,
                        host,
                        queryCache: proxy.qCache,
                        postMatch: [
                            {
                                rhsType: Array,
                                rhsHeadType: Object,
                                ctor: PE
                            },
                            {
                                rhsType: Array,
                                rhsHeadType: String,
                                ctor: SplitText
                            },
                            {
                                rhsType: String,
                                ctor: SplitText,
                            }
                        ]
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
                transform(target, proxy.ctx);
                host.lastEvent = hostLastEvent;
            };
            proxy.addEventListener(paramKey, fn);
            if (proxy.eventHandlers === undefined)
                proxy.eventHandlers = [];
            const on = paramKey;
            proxy.eventHandlers.push({ on, elementToObserve: proxy, fn });
            nudge(proxy);
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
            forceVisible: true,
            virtualProps: ['eventHandlers', 'ctx', 'firstTime', 'qCache'],
            intro: 'intro',
            finale: 'finale',
        }
    },
    complexPropDefaults: {
        controller: BeTransformativeController
    }
});
const beHive = document.querySelector('be-hive');
if (beHive !== null) {
    customElements.whenDefined(beHive.localName).then(() => {
        beHive.register({
            ifWantsToBe,
            upgrade,
            localName: tagName,
        });
    });
}
else {
    document.head.appendChild(document.createElement(tagName));
}
