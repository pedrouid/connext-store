/* global describe it beforeEach */

import { expect } from 'chai'

import ConnextStore from '../src/index'

declare global {
  interface Window {
    localStorage: Storage
  }
}

describe('// ----------------- connext-store ----------------- //', () => {
  it('returns same value', () => {
    const localStorage = window.localStorage
    console.log('localStorage', JSON.stringify(localStorage, null, 2))

    const store = new ConnextStore(window.localStorage)

    console.log('store', JSON.stringify(store, null, 2))

    const path = 'testing'
    const value = 'something'

    store.set([{ path, value }])

    const result = store.get(path)

    expect(result).to.be.equal(value)
  })
})
