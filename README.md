# zod-storage

Type-safe local and session storage

## Usage

```ts
import { makeLocalStorage } from 'zod-storage'
import * as z from 'zod'

const userStorage = makeLocalStorage(
  'user-data',
  z.object({ id: z.string(), email: z.string().email() }),
  { id: "1", email: "john@email.com" }
)

// Later on you can use it:
const id = userStorage.get("id") // will have autocomplete
//    ^? string
const user = userStorage.getAll()
//    ^? { id: string, email: string }

// @ts-expect-error : You can't set a number because it is expecting a string
userStorage.set("id", 1)

userStorage.setAll({ id: "123", email: "john@email.com" })
userStorage.merge({ id: "1234" })
expect(userStorage.getAll()).toEqual({ id: "1234", email: "john@email.com" })

userStorage.clear()
expect(userStorage.getAll()).toBe(null)
```
