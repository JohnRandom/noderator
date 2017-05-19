/**
 * @whatItDoes Mark class as something what can be injected through dependency injection system
 * @howToUse
 * ```
 * 
 * @Injectable()
 * export class MyInjectableService {
 *  constructor(private dependency: Service1, private dependency2: Service2) {}
 * }
 * 
 * ```
 * 
 * @description
 * 
 * Typescript uses Reflect metadata API from es7.
 * So every time when we use decorator it saves information about requriede params in Reflect.metadata.
 */
export const Injectable = () => {
  return (c: any): any => {
    return Object.defineProperty(c, '__injectable__', { value: true });
  }
};
