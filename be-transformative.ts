import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {BeTransformativeActions, BeTransformativeProps, BeTransformativeVirtualProps} from './types';
import { getHost } from 'trans-render/lib/getHost.js';
import { transform } from 'trans-render/lib/transform.js';
import { PEA } from 'trans-render/lib/PEA.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { nudge } from 'trans-render/lib/nudge.js';
import {register} from 'be-hive/register.js';

export class BeTransformativeController implements BeTransformativeActions{
    intro(proxy: Element & BeTransformativeVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe)!);
        for(const paramKey in params){
            //const pram = params[paramKey];
            const fn = (e: Event) => {
                const pram = params[e.type];
                let firstTime = false;
                const host = getHost(proxy, true) as HTMLElement;
                if(proxy.ctx === undefined){
                    firstTime = true;
                    proxy.qCache = new WeakMap<Element, {[key: string]: NodeListOf<Element>}>();
                    
                    proxy.ctx = {
                        match: pram.initTransform || pram.transform,
                        host,
                        queryCache: proxy.qCache,
                        postMatch: [
                            {
                                rhsType: Array,
                                rhsHeadType: Object,
                                ctor: PEA
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
                if(!firstTime){
                    proxy.ctx.match = pram.transform;
                }
                const hostLastEvent = (<any>host).lastEvent;
                (<any>host).lastEvent = e;
                const target = pram.transformFromClosest !== undefined ?
                    proxy.closest(pram.transformFromClosest)
                    : host.shadowRoot || host!;
                if(target === null) throw 'Could not locate target';
                transform(target, proxy.ctx);
                (<any>host).lastEvent = hostLastEvent;
            };
            if(paramKey === ''){
                const ev: Partial<Event> = {
                    type: '',
                }
                fn(ev as Event);
            }else{
                proxy.addEventListener(paramKey, fn);
                if(proxy.eventHandlers === undefined) proxy.eventHandlers = [];
                const on = paramKey as any as keyof ElementEventMap;
                proxy.eventHandlers.push({on, elementToObserve: proxy, fn});
                nudge(proxy);
            }

        }
    }
    finale(proxy: Element & BeTransformativeVirtualProps, target:Element){
        const eventHandlers = proxy.eventHandlers;
        for(const eh of eventHandlers){
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
    }
}

export interface BeTransformativeController extends BeTransformativeProps{}

const tagName = 'be-transformative';

const ifWantsToBe = 'transformative';

const upgrade = '*';

define<BeTransformativeProps & BeDecoratedProps<BeTransformativeProps, BeTransformativeActions>, BeTransformativeActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            noParse: true,
            virtualProps: ['eventHandlers', 'ctx', 'firstTime', 'qCache'],
            intro: 'intro',
            finale: 'finale',
        }
    },
    complexPropDefaults:{
        controller: BeTransformativeController
    }
});

register(ifWantsToBe, upgrade, tagName);