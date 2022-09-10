import {EventHandler, BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {RenderContext, MatchRHS} from 'trans-render/lib/types';

export interface ITransform{
    transform: {[key: string]: MatchRHS},
    transformPlugins?: any,
    //transformFromClosest?: string,
    flushCache?: boolean;
}

export interface EndUserProps{

}


export interface VirtualProps extends EndUserProps, MinimalProxy{
    //eventHandlers: EventHandler[];
    ctx: RenderContext;
    firstTime: boolean;
    //qCache: WeakMap<Element, {[key: string]: NodeListOf<Element>}>;
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    intro(proxy:Proxy, target: Element, beDecorProps: BeDecoratedProps): void;
    finale(proxy: Proxy, target:Element): void;
}