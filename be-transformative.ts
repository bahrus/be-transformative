import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {Actions, Proxy, PP, VirtualProps} from './types';
import {register} from 'be-hive/register.js';

export class BeTransformativeController extends EventTarget implements Actions{
    #abortControllers: AbortController[] = [];
    async intro(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps){
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe)!);
        
        for(const paramKey in params){
            const fn = async (e: Event) => {
                const pram = params[e.type];
                let firstTime = false;
                const {getHost} = await import('trans-render/lib/getHost.js');
                const host = (getHost(proxy, true) || document) as HTMLElement;
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
                const ac = new AbortController();
                this.#abortControllers.push(ac);
                proxy.addEventListener(paramKey, fn, {
                    signal: ac.signal,
                });
                const on = paramKey as any as keyof ElementEventMap;
                const {nudge} = await import('trans-render/lib/nudge.js');
                nudge(proxy);
            }

        }

        proxy.resolved = true;
    }
    finale(proxy: Proxy, target:Element){
        for(const ac of this.#abortControllers){
            ac.abort();
        }
    }
}


const tagName = 'be-transformative';

const ifWantsToBe = 'transformative';

const upgrade = '*';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            noParse: true,
            virtualProps: ['ctx', 'firstTime'],
            intro: 'intro',
            finale: 'finale',
        }
    },
    complexPropDefaults:{
        controller: BeTransformativeController
    }
});

register(ifWantsToBe, upgrade, tagName);