# @adaptive-ds/lexware

Result-based TypeScript API clients for Lexware Office.

```ts
import { articleList, lexwareClientCreate } from "@adaptive-ds/lexware"

const client = lexwareClientCreate({ accessToken: process.env.LEXWARE_TOKEN ?? "" })
if (!client.success) throw new Error(client.errorMessage)

const articles = await articleList(client.data, { type: "PRODUCT" })
if (!articles.success) {
  console.error(articles.errorMessage)
}
```

Fallible functions return `Result<T>` or `PromiseResult<T>` from `#result`. Runtime inputs and JSON responses are validated with Valibot.
