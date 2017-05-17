import { InjectionToken } from './injection-token';

/**
 * @whatItDoes Configures dependency injection
 * @howToUse
 * ```
 * const module = new Module([Service1, Service2], [ChildModule1, ChildModule2]);
 * ```
 * 
 * @description
 * 
 * Class to define reusable module in EPO frontend infrastructure.
 */
export class Module {
  /**
   * Array of injection tokens. Only source of truth for dependency injection.
   */
  private tokens: EPO.Core.Module.ProvidingToken[] = [];

  /**
   * Parent module. If user tries to get service from this instance we delegate instantiation to parent module
   */
  private parent: Module = null;
  private children: Module[] = [];

  private _bootstraped: boolean = false;
  private set bootstraped(value: boolean) {
    if (this._bootstraped) {
      throw new Error('Module already bootstraped!');
    }

    this._bootstraped = true;
    for(let child of this.children) {
      child.bootstraped = true;
    }
  }
  private get bootstraped(): boolean {
    return this._bootstraped;
  }

  /**
   * 
   */
  constructor (providers: EPO.Core.Module.Provider[], children: Module[] = []) {
    this.children = children;

    for(let provider of providers) {
      if (typeof provider === 'function') {
        // Should accept only Injectable providers
        if (provider['__injectable__'] !== true) {
          throw new Error('Only injecable providers allowed to be registered in Module. Use @Injectable decorator!');
        }

        this.tokens.push({
          provide: provider,
          asClass: provider
        });
      } else {
        this.tokens.push(provider);
      }
    }

    // If we have children we have to take their tokens and use as our own
    for(let child of this.children) {
      child.setParent(this);

      for(let token of child.tokens) {
        // If we do not define token for this provider yet
        // push it into current module tokens
        let isPresent = this.tokens.find(t => t.provide === token.provide);
        if (!isPresent) {
          this.tokens.push(token);
        }
      }
    }
  }

  /**
   * Bootstraps module.
   * 
   * @description
   * 
   * Tokens do not instated by default we have to bootstrap our module manually.
   * In this way we can have several life cycle stages like 'configuration' or 'run'. 
   */
  public bootstrap () {
    if (this.bootstraped) {
      throw new Error('Module already has been bootstraped');
    }

    for(let token of this.tokens) {
      if (token.instance) {
        continue;
      }
      this.instantiate(token);
    }
    this.bootstraped = true;
  }

  /**
   * Find instance of required constructor.
   */
  public get<T>(provide: Function | InjectionToken ): T {
    if (!this.bootstraped) {
      throw new Error('You should bootstrap module before query service');
    }

    if (this.parent) {
      return this.parent.get(provide) as T;
    }

    const token = this.tokens.find(token => token.provide === provide);
    if (!token) {
      if (provide instanceof InjectionToken) {
        throw new Error(provide.token + ' is not registered.');
      }

      throw new Error(provide['name'] + ' is not registered.');
    }

    const instance = token.instance as T;
     
    return instance;
  }

  private setParent (parent: Module): void {
    this.parent = parent;
  }

  /**
   * Instantiate one token.
   * 
   * @description
   * 
   * Function goes recursevly through dependencise and instantiates them
   */
  private instantiate (token: EPO.Core.Module.ProvidingToken): void {
    // If we provide current token as value just use this value as token instance
    // and do not resolve of it dependencies
    if (typeof token.asValue !== 'undefined') {
      token.instance = token.asValue;
      return;
    }

    // Get dependencies of this token
    // When we use dependency like type it goes into 'design:paramtypes' metadata
    // but when we use @Inject('tokenName') decorator it goes into 'parameters' metadata (in 'design:paramtypes' will be Object.prototype at this index)
    // so we have to resolve both of this arrays and merge them
    let deps = [];
    let typeDeps = [];  // Injected by type
    let manualDeps = []; // Injected with @Inject decorator
    try {
      deps = (Reflect as any).getOwnMetadata('design:paramtypes', token.asClass) || [];
      
      typeDeps = (Reflect as any).getOwnMetadata('design:paramtypes', token.asClass) || [];
      manualDeps = (Reflect as any).getOwnMetadata('parameters', token.asClass) || [];

      // Now we have to merge this arrays
      deps = typeDeps.map((dep, index) => {
        if (dep === Object || !dep) {
          return manualDeps[index][0].provide;
        }
        return dep;
      });
    } catch (err) {
      console.error('Cannot get dependencies for \n', token);
    }
    
    // Get all tokens for this class
    const dependenciesTokens = deps.map((provide: Function) => {
      const token = this.tokens.find(t => t.provide === provide);
      if (!token) {
        throw new Error(`${(provide as any)['name']} is not registered!`);
      } 
      return token;
    });

    // After all tokens has been found we have to make sure that all of them instantiated
    for(let dependencyToken of dependenciesTokens) {
      if (dependencyToken.instance) {
        continue;
      }

      // Instantiate this token
      this.instantiate(dependencyToken);
    }

    // If we get to this point we can be sure that our dependencies are instantiated
    const constructorParams = dependenciesTokens.map((t: EPO.Core.Module.ProvidingToken) => t.instance);
    // Typescript cannot check input params of constructor when we making 'new'
    // so we have to convert constructor into 'any'
    token.instance = new (token.asClass as any)(...constructorParams);
  }
}
