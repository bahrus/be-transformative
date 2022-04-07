import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {getVal} from 'be-decorated/upgrade.js';
import {BeTransformativeActions, BeTransformativeProps, BeTransformativeVirtualProps} from './types';
import {register} from 'be-hive/register.js';

export class BeTransformativeController implements BeTransformativeActions{
    async intro(proxy: Element & BeTransformativeVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        let params: any;
        if(beDecorProps.virtualPropsMap.has(target) !== undefined){
            params = beDecorProps.virtualPropsMap.get(target);
        }
        if(params === undefined){
            const val = getVal(target, beDecorProps.ifWantsToBe);
            const attr = val[0]!;
            params = JSON.parse(attr);
            beDecorProps.virtualPropsMap.set(target, params);
        }
        
        for(const paramKey in params){
            const fn = async (e: Event) => {
                const pram = params[e.type];
                let firstTime = false;
                const {getHost} = await import('trans-render/lib/getHost.js');
                const host = getHost(proxy, true) as HTMLElement;
                if(proxy.ctx === undefined){
                    firstTime = true;
                    proxy.ctx = {
                        match: pram.transform,
                        host,
                        plugins: pram.transformPlugins,
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
                const {DTR} = await import('trans-render/lib/DTR.js');
                // if(target.dataset.useFlip){
                //     const {Flipping} = await import('./flipping/index.js');
                // }
                await DTR.transform(target, proxy.ctx);
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
                const {nudge} = await import('trans-render/lib/nudge.js');
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