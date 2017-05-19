import { Module } from '../module';
import { Injectable } from '../injectable';
import { Inject } from '../inject';
import { InjectionToken } from '../injection-token';
import { expect, assert } from 'chai';

describe('core/Module', () => {
  @Injectable()
  class TestService {}

  @Injectable()
  class TestService_1 {}

  it('should accept only Injectable classes as providers', () => {
    class NonInjecableService {}
    expect(() => new Module([NonInjecableService])).to.throw();
  });

  it('should return instance of provided service', () => {
    const module = new Module([TestService]);
    module.bootstrap();

    expect(module.get(TestService) instanceof TestService).to.equal(true);
  });

  it('shuld accept tokens as providing value', () => {
    const module = new Module([{
      provide: TestService,
      asClass: TestService
    }]);
    module.bootstrap();

    expect(module.get(TestService) instanceof TestService).to.equal(true);
  });

  it('should use asClass value of token to provide service', () => {
    const module = new Module([{
      provide: TestService,
      asClass: TestService_1
    }]);
    module.bootstrap();

    expect(module.get(TestService) instanceof TestService_1).to.equal(true);
  });

  it('should provide services to child modules', () => {
    @Injectable()
    class ParentService {}

    @Injectable()
    class ChildService { constructor (public parentServiceInstance: ParentService) {}}

    const childModule = new Module([ ChildService ]);
    const parentModule = new Module([ ParentService ], [childModule]);

    parentModule.bootstrap();

    expect(childModule.get<ChildService>(ChildService).parentServiceInstance instanceof ParentService).to.equal(true);
    expect(parentModule.get(ParentService) instanceof ParentService).to.equal(true);
  });

  it('parent module should have a prioriy over child modules when instantiate services', () => {
    @Injectable()
    class ParentService {}

    @Injectable()
    class ChildService_1 {}

    @Injectable()
    class ChildService { constructor (public childService_1Instance: ChildService_1) {}}

    @Injectable()
    class FakeChildService {}

    const childModule = new Module([ ChildService, ChildService_1 ]);
    const parentModule = new Module([ ParentService, { provide: ChildService_1, asClass: FakeChildService} ], [childModule]);
    parentModule.bootstrap();

    expect(childModule.get<ChildService>(ChildService).childService_1Instance instanceof FakeChildService).to.equal(true);
  });

  it('should not be able to bootstrap twice', () => {
    const module = new Module([]);
    module.bootstrap();

    expect(() => module.bootstrap()).to.throw();
  });

  it('should use @Inject decorator to provide values', () => {
    const testValueToken = new InjectionToken('test-value');
    
    @Injectable()
    class TestService_1 {}

    @Injectable()
    class TestService_2 {
      constructor (
        public testService_1: TestService_1,
        @Inject(testValueToken) public testValue
      ) {}
    }

    const module = new Module([
      TestService_1,
      TestService_2,
      {
        provide: testValueToken,
        asValue: { foo: 'bar' }
      }
    ]);

    module.bootstrap();

    const service_2_instance: TestService_2 = module.get<TestService_2>(TestService_2);
    expect(service_2_instance.testService_1 instanceof TestService_1).to.equal(true);
    expect(service_2_instance.testValue['foo']).to.equal('bar');

    const value = module.get(testValueToken);
    expect(value['foo']).to.equal('bar');
  });
});
