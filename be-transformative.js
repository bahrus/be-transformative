import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeTransformativeController extends EventTarget {
    #controllers = [];
    #txs = new Map();
    async intro(proxy, target, beDecorProps) {
        let params = undefined;
        const attr = proxy.getAttribute('is-' + beDecorProps.ifWantsToBe);
        try {
            params = JSON.parse(attr);
        }
        catch (e) {
            console.error({
                e,
                attr
            });
            return;
        }
        const { notifyHookup } = await import('trans-render/lib/notifyHookup.js');
        this.#controllers = [];
        for (const propKey in params) {
            const pram = params[propKey];
            const { transform, } = pram;
            const notifyParam = {
                doOnly: async () => {
                    const { getHost } = await import('trans-render/lib/getHost.js');
                    const host = (getHost(proxy, true) || document);
                    if (!this.#txs.has(propKey)) {
                        const { Tx } = await import('trans-render/lib/Tx.js');
                        const tx = new Tx(host, target, transform);
                        this.#txs.set(propKey, tx);
                    }
                    const txs = this.#txs.get(propKey);
                    // const node = transformFromClosest !== undefined ? target.closest(transformFromClosest): host.shadowRoot || host!;
                    // if(node === null) throw 'Could not locate target';
                    await txs.transform();
                },
                nudge: true
            };
            const handler = await notifyHookup(target, propKey, notifyParam);
            this.#controllers.push(handler.controller);
        }
        proxy.resolved = true;
    }
    finale(proxy, target) {
        for (const ac of this.#controllers) {
            ac.abort();
        }
        this.#txs = new Map();
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
