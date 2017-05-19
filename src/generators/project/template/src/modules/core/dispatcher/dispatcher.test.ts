import { Dispatcher } from './dispatcher';
import { Action } from './action';
import { expect } from 'chai';

describe('core/dispatcher', () => {
  const dispatcher = new Dispatcher();

  it('should dispatch only Action type and it subtypes', () => {
    class NonActionSubtype {}
    class ActionSubType extends Action {}

    expect(() => dispatcher.dispatch(new NonActionSubtype())).to.throw();
    expect(() => dispatcher.dispatch(new ActionSubType())).to.not.throw();
  });

  it('should generate stream for provided action type', (done) => {
    class TestAction extends Action {
      constructor (public testData: number) {
        super();
      }
    }
    const subscription = dispatcher.getStream<TestAction>(TestAction).subscribe((action) => {
      expect(action.testData).to.equal(100);
      subscription.unsubscribe();
      done();
    });

    dispatcher.dispatch(new TestAction(100));
  });

  describe('safeSubscribeOn', () => {
    it('should not unsubscribe on error in subscription function', (done) => {
      class TestAction extends Action { constructor (public data: number) { super(); }}

      let counter = 0;

      const subscription = dispatcher.safeSubscribeOn<TestAction>(TestAction, (action) => {
        counter += 1;
        if (counter === 2) {
          throw new Error('Test Error');
        }

        if (counter === 5) {
          subscription.unsubscribe();
          expect(counter).to.equal(5);
          done();
        }
      }, (err: Error) => {
        if (err.message !== 'Test Error') {
          throw err;
        }
      });

      dispatcher.dispatch(new TestAction(100));
      dispatcher.dispatch(new TestAction(100));
      dispatcher.dispatch(new TestAction(100));
      dispatcher.dispatch(new TestAction(100));
      dispatcher.dispatch(new TestAction(100));
    });
  });
});
