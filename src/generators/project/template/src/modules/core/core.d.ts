declare module EPO.Core.Module {

  export interface ProvidingToken {
    provide: Function | Object;
    asClass?: Function;
    asValue?: Object;
    asFactory?: Function;
    instance?: Object
  }

  export type Provider = Function | ProvidingToken;
}
