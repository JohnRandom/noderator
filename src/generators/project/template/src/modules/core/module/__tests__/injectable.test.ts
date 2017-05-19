import { expect } from 'chai';
import { Injectable } from '../injectable';

describe('core/decorators/Injectable', () => {
  it('should set __injectable__ property into constructor function', () => {
    @Injectable()
    class TestClass {}

    expect(TestClass['__injectable__']).to.equal(true);
  });
})