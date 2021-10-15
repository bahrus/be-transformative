import {EventHandler, BeDecoratedProps} from 'be-decorated/types';
import {RenderContext} from 'trans-render/lib/types';

export interface ITransform{
    
}

// type transformRule = {[key: ElementEventMap]: any};

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
    intro(proxy: Element & BeTransformativeVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
    finale(proxy: Element & BeTransformativeVirtualProps, target:Element): void;
}