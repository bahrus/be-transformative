import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {Actions, Proxy, PP, VirtualProps, ITransform} from './types';
import {register} from 'be-hive/register.js';
import {IDIYNotify, MatchRHS, ITx} from 'trans-render/lib/types';

export class BeTransformativeController extends EventTarget implements Actions{
    #controllers: AbortController[] = [];
    #txs = new Map<string, ITx>();

    async intro(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps){
        let params: any = undefined;
        const attr = proxy.getAttribute('is-' + beDecorProps.ifWantsToBe!)!;
        try{
            params = JSON.parse(attr);
        }catch(e){
            console.error({
                e,
                attr
            });
            return;
        }
        const {notifyHookup} =  await import('trans-render/lib/notifyHookup.js');
        
        this.#controllers = [];
        for(const propKey in params){
            const pram = params[propKey] as ITransform;
            const {transform, } = pram;
            const notifyParam: IDIYNotify = {
                doOnly: async () => {
                    const {getHost} = await import('trans-render/lib/getHost.js');
                    const host = (getHost(proxy, true) || document) as HTMLElement;
                    if(!this.#txs.has(propKey)){
                        const {Tx} = await import('trans-render/lib/Tx.js');
                        
                        const tx = new Tx(host, target, transform!);
                        this.#txs.set(propKey, tx);
                    }
                    const txs = this.#txs.get(propKey)!;
                    // const node = transformFromClosest !== undefined ? target.closest(transformFromClosest): host.shadowRoot || host!;
                    // if(node === null) throw 'Could not locate target';
                    await txs.transform();
                }, 
                nudge: true
            } as IDIYNotify;
            const handler = await notifyHookup(target, propKey, notifyParam);
            this.#controllers.push(handler.controller);
        }
        proxy.resolved = true;


    }
    finale(proxy: Proxy, target:Element){
        for(const ac of this.#controllers){
            ac.abort();
        }
        this.#txs = new Map<string, ITx>();
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