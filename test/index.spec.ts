/* global describe it beforeEach */

import { expect } from 'chai'

import './mock/localStorage'
import AsyncStorage from './mock/asyncStorage'

import ConnextStore from '../src/index'
import { isAsyncStorage } from '../src/utils'

describe('// ----------------- connext-store ----------------- //', () => {
  describe('ConnextStore', () => {
    it('returns same value', () => {
      const store = new ConnextStore(window.localStorage)
      const path = 'testing'
      const value = 'something'
      store.set([{ path, value }])
      const result = store.get(path)
      expect(result).to.be.equal(value)
    })
  })

  describe('isAsyncStorage', () => {
    it('returns false for localStorage', () => {
      const result = isAsyncStorage(window.localStorage)
      const expected = false
      expect(result).to.be.equal(expected)
    })

    it('returns true for AsyncStorage', () => {
      const result = isAsyncStorage(AsyncStorage)
      const expected = true
      expect(result).to.be.equal(expected)
    })
  })
})
