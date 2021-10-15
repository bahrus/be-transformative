import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {BeTransformativeActions, BeTransformativeProps} from './types';

export class BeTransformativeController implements BeTransformativeActions{

}

export interface BeTransformativeController extends BeTransformativeProps{}

const tagName = 'be-transformative';

define<BeTransformativeProps & BeDecoratedProps<BeTransformativeProps, BeTransformativeActions>, BeTransformativeActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade: '*',
            ifWantsToBe: 'transformative',
            noParse: true,
            forceVisible: true,
            virtualProps: ['eventHandlers', 'ctx']
        }
    }
});