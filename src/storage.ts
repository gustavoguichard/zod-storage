import type * as z from 'zod'

const makeStorage = (storage: Storage | undefined) => {
  return <T extends object>(
    key: string,
    schema: z.Schema<T>,
    initialData?: T,
  ) => {
    if (initialData && typeof storage !== 'undefined') {
      const result = schema.safeParse(initialData)
      if (result.success) {
        storage[key] = JSON.stringify(initialData)
      }
    }

    return {
      getAll: (): T | null => {
        if (typeof storage === 'undefined') return null
        const data = storage[key]
        if (!data) return null

        return schema.parse(JSON.parse(data))
      },
      get: <U extends keyof T>(prop: U): T[U] | null => {
        if (typeof storage === 'undefined') return null
        const data = storage[key]
        if (!data) return null

        return schema.parse(JSON.parse(data))[prop] ?? null
      },
      set: <U extends keyof T>(prop: U, value: T[U]): void => {
        if (typeof storage === 'undefined') return undefined

        const oldData = storage[key] ? JSON.parse(storage[key]) : {}
        const newData = { ...oldData, [prop]: value }
        if (schema.safeParse(newData).success) {
          storage[key] = JSON.stringify(newData)
        }
      },
      setAll: (data: T): void => {
        if (typeof storage === 'undefined') return undefined

        if (schema.safeParse(data).success) {
          storage[key] = JSON.stringify(data)
        }
      },
      merge: (data: Partial<T>): void => {
        if (typeof storage === 'undefined') return undefined

        const oldData = storage[key] ? JSON.parse(storage[key]) : {}
        const newData = { ...oldData, ...data }
        if (schema.safeParse(newData).success) {
          storage[key] = JSON.stringify(newData)
        }
      },
      clear: () => {
        if (typeof storage !== 'undefined') {
          delete storage[key]
        }
      },
    }
  }
}

/**
 * Creates a session storage object that can be used to store and retrieve
 * data from the session storage.
 * @param key The key to use for the session storage.
 * @param schema The zod schema to use for validating the data.
 * @returns An object with getAll, get, set, and clear methods.
 * @example
 * const storage = makeSessionStorage("my-key", z.object({ name: z.string() }));
 * storage.set("name", "John");
 * storage.get("name"); // "John"
 */
const makeSessionStorage = makeStorage(
  typeof sessionStorage === 'undefined' ? undefined : sessionStorage,
)

/**
 * Creates a local storage object that can be used to store and retrieve
 * data from the local storage.
 * @param key The key to use for the local storage.
 * @param schema The zod schema to use for validating the data.
 * @returns An object with getAll, get, set, and clear methods.
 * @example
 * const storage = makeLocalStorage("my-key", z.object({ name: z.string() }));
 * storage.set("name", "John");
 * storage.get("name"); // "John"
 */
const makeLocalStorage = makeStorage(
  typeof localStorage === 'undefined' ? undefined : localStorage,
)

export { makeSessionStorage, makeLocalStorage }
