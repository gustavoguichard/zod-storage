import { makeSessionStorage, makeLocalStorage } from './storage'
import * as z from 'zod'

const storageKey = 'test-key'
const testSchema = z.object({
  name: z.string(),
  age: z.number().optional(),
})

describe('makeSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('stores and retrieves a valid value', async () => {
    const testStorage = makeSessionStorage(storageKey, testSchema)
    const testData = { name: 'John', age: 22 }
    testStorage.set('name', testData.name)
    testStorage.set('age', testData.age)

    expect(testStorage.get('name')).toBe(testData.name)
    expect(testStorage.get('age')).toBe(testData.age)
  })

  it('does not store an invalid value', async () => {
    const testStorage = makeSessionStorage(storageKey, testSchema)
    const testData = 'John'
    testStorage.set('name', testData)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    testStorage.set('age', testData)

    expect(testStorage.get('name')).toBe(testData)
    expect(testStorage.get('age')).toBe(null)
  })

  it('clears the storage', async () => {
    const testStorage = makeSessionStorage(storageKey, testSchema)
    const testData = { name: 'John', age: 22 }
    testStorage.set('name', testData.name)
    testStorage.set('age', testData.age)

    testStorage.clear()

    expect(testStorage.get('name')).toBe(null)
    expect(testStorage.get('age')).toBe(null)
  })

  it('returns null if property not in storage', async () => {
    const testStorage = makeSessionStorage(storageKey, testSchema)
    const testData = { name: 'John', age: 22 }
    testStorage.set('name', testData.name)

    expect(testStorage.get('age')).toBe(null)
  })

  it('get all the data with "getAll"', () => {
    const testStorage = makeSessionStorage(storageKey, testSchema)
    const testData = { name: 'John', age: 22 }
    testStorage.setAll(testData)

    expect(testStorage.getAll()).toEqual(testData)
  })

  it('merges new data with existing data', () => {
    const testStorage = makeSessionStorage(storageKey, testSchema)
    const testData = { name: 'John', age: 22 }
    testStorage.setAll(testData)
    testStorage.merge({ name: 'Jane' })

    expect(testStorage.getAll()).toEqual({ name: 'Jane', age: 22 })
  })
})

describe('makeLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves a valid value', async () => {
    const testStorage = makeLocalStorage(storageKey, testSchema, {
      name: '',
    })
    const testData = { name: 'John', age: 22 }
    testStorage.set('name', testData.name)
    testStorage.set('age', testData.age)

    expect(testStorage.get('name')).toBe(testData.name)
    expect(testStorage.get('age')).toBe(testData.age)
  })

  it('does not store an invalid value', async () => {
    const testStorage = makeLocalStorage(storageKey, testSchema, {
      name: '',
    })
    const testData = 'John'
    testStorage.set('name', testData)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    testStorage.set('age', testData)

    expect(testStorage.get('name')).toBe(testData)
    expect(testStorage.get('age')).toBe(null)
  })

  it('clears the storage', async () => {
    const testStorage = makeLocalStorage(storageKey, testSchema, {
      name: '',
    })
    const testData = { name: 'John', age: 22 }
    testStorage.set('name', testData.name)
    testStorage.set('age', testData.age)

    testStorage.clear()

    expect(testStorage.get('name')).toBe(null)
    expect(testStorage.get('age')).toBe(null)
  })

  it('returns null if property not in storage', async () => {
    const testStorage = makeLocalStorage(storageKey, testSchema, {
      name: '',
    })
    const testData = { name: 'John', age: 22 }
    testStorage.set('name', testData.name)

    expect(testStorage.get('age')).toBe(null)
  })
})
