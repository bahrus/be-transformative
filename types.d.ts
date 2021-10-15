import {EventHandler} from 'be-decorated/types';
import {RenderContext} from 'trans-render/lib/types';

export interface ITransform{
    
}

export interface BeTransformativeVirtualProps{
    eventHandlers: EventHandler[];
    ctx: RenderContext;
    firstTime: boolean;
    qCache: WeakMap<Element, {[key: string]: NodeListOf<Element>}>;
}

export interface BeTransformativeProps extends BeTransformativeVirtualProps{
    proxy: Element & BeTransformativeVirtualProps;
}

export interface BeTransformativeActions{

}