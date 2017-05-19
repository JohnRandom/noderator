import { InjectionToken } from './injection-token';

function makeMetadataCtor(props: ([string, any] | { [key: string]: any })[]): any {
  return function ctor(...args: any[]) {
    props.forEach((prop, i) => {
      const argVal = args[i];
      if (Array.isArray(prop)) {
        // plain parameter
        this[prop[0]] = argVal === undefined ? prop[1] : argVal;
      } else {
        for (const propName in prop) {
          this[propName] =
            argVal && argVal.hasOwnProperty(propName) ? argVal[propName] : prop[propName];
        }
      }
    });
  };
}

export function makeParamDecorator(name: string, props: ([string, any] | { [name: string]: any })[], parentClass?: any): any {
  const metaCtor = makeMetadataCtor(props);
  function ParamDecoratorFactory(...args: any[]): any {
    if (this instanceof ParamDecoratorFactory) {
      metaCtor.apply(this, args);
      return this;
    }
    const annotationInstance = new (<any>ParamDecoratorFactory)(...args);
    

    (<any>ParamDecorator).annotation = annotationInstance;
    return ParamDecorator;

    function ParamDecorator(cls: any, unusedKey: any, index: number): any {
      const parameters: (any[] | null)[] = (Reflect as any).getOwnMetadata('parameters', cls) || [];

      if ((annotationInstance[props[0][0]] instanceof InjectionToken) !== true) {
        throw new Error(`${cls['name']} cannot inject '${annotationInstance[props[0][0]]}' only instances of InjectionToken allowed to be injected!`);
      }

      // there might be gaps if some in between parameters do not have annotations.
      // we pad with nulls.
      while (parameters.length <= index) {
        parameters.push(null);
      }

      parameters[index] = parameters[index] || [];
      parameters[index]!.push(annotationInstance);

      (Reflect as any).defineMetadata('parameters', parameters, cls);
      return cls;
    }
  }
  if (parentClass) {
    ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
  }
  ParamDecoratorFactory.prototype.toString = () => `@${name}`;
  (<any>ParamDecoratorFactory).annotationCls = ParamDecoratorFactory;
  return ParamDecoratorFactory;
}

export const Inject: any = makeParamDecorator('Inject', [['provide', undefined]]);
