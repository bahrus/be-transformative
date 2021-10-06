import { XtalDecor, XtalDecorCore } from 'xtal-decor/xtal-decor.js';
import { XtalDecorProps } from 'xtal-decor/types';
import { transform } from 'trans-render/lib/transform.js';
import { CE } from 'trans-render/lib/CE.js';

const ce = new CE<XtalDecorCore<Element>>({
    config:{
        tagName: 'be-transformative',
        propDefaults:{
            upgrade: '*',
            ifWantsToBe: 'transformative',
            noParse: true,
            forceVisible: true,
            virtualProps: ['eventHandlers']
        }
    },
    complexPropDefaults:{
        actions:[],
        on:{},
        init: (self: Element, decor: XtalDecorProps<Element>) => {
            const params = JSON.parse(self.getAttribute('is-' + decor.ifWantsToBe));
            for(const propKey in params){
                const parm = params[propKey];
                
            }
        }
    },
    superclass: XtalDecor
});