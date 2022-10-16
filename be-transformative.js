import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeTransformativeController extends EventTarget {
    #controllers = [];
    #txs = new Map();
    async onOn(pp) {
        const { on, self, proxy } = pp;
        this.#controllers = [];
        for (const propKey in on) {
            const transformConfig = { ...on[propKey] };
            if (transformConfig.scope === undefined)
                transformConfig.scope = 'h';
            const { transform, scope } = transformConfig;
            const notifyParam = {
                doOnly: async () => {
                    const { getHost } = await import('trans-render/lib/getHost.js');
                    const host = (getHost(proxy, true) || document);
                    if (!this.#txs.has(propKey)) {
                        const { Tx } = await import('trans-render/lib/Tx.js');
                        const tx = new Tx(host, self, transform, scope);
                        this.#txs.set(propKey, tx);
                    }
                    const txs = this.#txs.get(propKey);
                    // const node = transformFromClosest !== undefined ? target.closest(transformFromClosest): host.shadowRoot || host!;
                    // if(node === null) throw 'Could not locate target';
                    await txs.transform();
                },
                nudge: true
            };
            const { notifyHookup } = await import('trans-render/lib/notifyHookup.js');
            const handler = await notifyHookup(self, propKey, notifyParam);
            this.#controllers.push(handler.controller);
        }
        proxy.resolved = true;
    }
    disconnect() {
        for (const ac of this.#controllers) {
            ac.abort();
        }
        this.#txs = new Map();
    }
    finale() {
        this.disconnect();
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
            virtualProps: ['on'],
            finale: 'finale',
            primaryProp: 'on',
            primaryPropReq: true,
        },
        actions: {
            onOn: 'on'
        }
    },
    complexPropDefaults: {
        controller: BeTransformativeController
    }
});
register(ifWantsToBe, upgrade, tagName);
