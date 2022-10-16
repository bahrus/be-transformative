import {BeDecoratedProps, define} from 'be-decorated/DE.js';
import {Actions, Proxy, PP} from './types';
import {register} from 'be-hive/register.js';
import {IDIYNotify, MatchRHS, ITx} from 'trans-render/lib/types';

export class BeTransformativeController extends EventTarget implements Actions{
    #controllers: AbortController[] = [];
    #txs = new Map<string, ITx>();

    async onOn(pp: PP){
        const {on, self, proxy} = pp;
        
        
        this.#controllers = [];
        for(const propKey in on){
            const transformConfig = {...on[propKey]};
            if(transformConfig.scope === undefined) transformConfig.scope = 'h';
            const {transform, scope} = transformConfig;
            const notifyParam: IDIYNotify = {
                doOnly: async () => {
                    const {getHost} = await import('trans-render/lib/getHost.js');
                    const host = (getHost(proxy, true) || document) as HTMLElement;
                    if(!this.#txs.has(propKey)){
                        const {Tx} = await import('trans-render/lib/Tx.js');
                        
                        const tx = new Tx(host, self, transform!, scope);
                        this.#txs.set(propKey, tx);
                    }
                    const txs = this.#txs.get(propKey)!;
                    // const node = transformFromClosest !== undefined ? target.closest(transformFromClosest): host.shadowRoot || host!;
                    // if(node === null) throw 'Could not locate target';
                    await txs.transform();
                }, 
                nudge: true
            } as IDIYNotify;
            const {notifyHookup} =  await import('trans-render/lib/notifyHookup.js');
            const handler = await notifyHookup(self, propKey, notifyParam);
            this.#controllers.push(handler.controller);
        }
        proxy.resolved = true;

    }
    disconnect(){
        for(const ac of this.#controllers){
            ac.abort();
        }
        this.#txs = new Map<string, ITx>();
    }
    finale(){
        this.disconnect();
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
            virtualProps: ['on'],
            finale: 'finale',
            primaryProp: 'on',
            primaryPropReq: true,
        },
        actions:{
            onOn: 'on'
        }
    },
    complexPropDefaults:{
        controller: BeTransformativeController
    }
});

register(ifWantsToBe, upgrade, tagName);