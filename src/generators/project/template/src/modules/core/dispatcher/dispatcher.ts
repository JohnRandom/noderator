import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Injectable } from '../';
import { Action } from './action';


/**
 * @whatItDoes Implementation of pub/sub pattern with rxjs
 */
@Injectable()
export class Dispatcher {
  private actionsStream: BehaviorSubject<any>;

  constructor () {
    this.actionsStream = new BehaviorSubject<any>(null);
  }

  /**
   * Dispatch new action into this dispatcher
   */
  dispatch(action: Object): void {
    if (action instanceof Action !== true) {
      throw new Error('Only instances of Action or decendent class are allowed to be dispatch');
    }

    this.actionsStream.next(action);
  }

  /**
   * Get stream of action for one particular action type.
   */
  getStream<T>(actionType: Function): Observable<T> {
    return this.actionsStream.filter(action => action instanceof actionType);
  }

  /**
   * @whatItDoes Subscribe you on provided Action and do not unsubscribe in case of unhandled exception
   * 
   * @description
   * 
   * !!! I Do not recommend you to use this method! You should always handle you exceptions! !!!
   * 
   * Acording to documentation of rxjs when you have an unhandled exception in your subscriotion handler
   * it will unsubscribe you autmatically [https://github.com/ReactiveX/rxjs/blob/master/src/Subscriber.ts#L204].
   * 
   */
  safeSubscribeOn<T>(actionType: Function, handler: (value: T) => void, onError?: (err) => void): Subscription {
    const subscriber = this.getStream<T>(actionType).subscribe(handler) as any;
    subscriber.destination.__tryOrUnsub = (fn, value) => {
      try {
        fn.call(subscriber._context, value);
      } catch (err) {
        if (onError) {
          onError(err);
        } else {
          console.error('Unhandled error in safeSubscribeOn!', err);  
        }
      }
    }
    return subscriber;
  }

}
