import {EventHandler, BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {RenderContext, MatchRHS, Scope} from 'trans-render/lib/types';

export interface ITransformConfig{
    transform: {[key: string]: MatchRHS},
    plugins?: any,
    scope: Scope,
    //transformFromClosest?: string,
    flushCache?: boolean;
}

export interface EndUserProps{
    on?: {[key: string]: ITransformConfig}
}


export interface VirtualProps extends EndUserProps, MinimalProxy{
    //eventHandlers: EventHandler[];
    // ctx: RenderContext;
    // firstTime: boolean;
    //qCache: WeakMap<Element, {[key: string]: NodeListOf<Element>}>;
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    onOn(pp: PP): Promise<void>;
    finale(proxy: Proxy, target:Element): void;
}