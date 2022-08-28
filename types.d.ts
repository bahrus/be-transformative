import {EventHandler, BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {RenderContext} from 'trans-render/lib/types';

export interface ITransform{
    transform: any | any[],
    transformPlugins?: any,
}

// type transformRule = {[key: ElementEventMap]: any};

export interface BeTransformativeVirtualProps extends MinimalProxy{
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