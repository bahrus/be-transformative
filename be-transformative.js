import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { transform } from 'trans-render/lib/transform.js';
import { CE } from 'trans-render/lib/CE.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
const ce = new CE({
    config: {
        tagName: 'be-transformative',
        propDefaults: {
            upgrade: '*',
            ifWantsToBe: 'transformative',
            noParse: true,
            forceVisible: true,
            virtualProps: ['eventHandlers', '__ctx', 'firstTime', 'qCache']
        }
    },
    complexPropDefaults: {
        actions: [],
        on: {},
        init: (self, decor) => {
            const params = JSON.parse(self.getAttribute('is-' + decor.ifWantsToBe));
            for (const propKey in params) {
                //const pram = params[propKey];
                const fn = (e) => {
                    const pram = params[e.type];
                    let firstTime = false;
                    const aSelf = self;
                    if (aSelf.__ctx === undefined) {
                        firstTime = true;
                        aSelf.qCache = new WeakMap();
                        const host = getHost(self);
                        aSelf.__ctx = {
                            match: pram.initTransform || pram.transform,
                            host,
                            queryCache: aSelf.qCache,
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
                        aSelf.__ctx.ctx = aSelf.__ctx;
                        if (!firstTime) {
                            aSelf.__ctx.match = pram.transform;
                        }
                        const hostLastEvent = host.lastEvent;
                        host.lastEvent = e;
                        const target = pram.transformFromClosest !== undefined ?
                            self.closest(pram.transformFromClosest)
                            : host.shadowRoot || host;
                        if (target === null)
                            throw 'Could not locate target';
                        transform(target, aSelf.__ctx);
                        host.lastEvent = hostLastEvent;
                    }
                };
                self.addEventListener(propKey, fn);
                if (self.eventHandlers === undefined)
                    self.eventHandlers = [];
                self.eventHandlers.push({ propKey, element: self, fn });
                nudge(self);
            }
        },
        finale: (self, target) => {
            const eventHandlers = self.eventHandlers;
            //console.log(eventHandlers);
            for (const eh of eventHandlers) {
                eh.element.removeEventListener(eh.propKey, eh.fn);
            }
        }
    },
    superclass: XtalDecor
});
document.head.appendChild(document.createElement('be-transformative'));
/**
 * Decrement "disabled" counter, remove when reaches 0
 * @param prevSib
 */
function nudge(prevSib) {
    const da = prevSib.getAttribute('disabled');
    if (da !== null) {
        if (da.length === 0 || da === "1") {
            prevSib.removeAttribute('disabled');
            prevSib.disabled = false;
        }
        else {
            prevSib.setAttribute('disabled', (parseInt(da) - 1).toString());
        }
    }
}
//duplicated with be-observant
function getHost(self) {
    let host = self.getRootNode().host;
    if (host === undefined) {
        host = self.parentElement;
        while (host && !host.localName.includes('-')) {
            host = host.parentElement;
        }
    }
    return host;
}
