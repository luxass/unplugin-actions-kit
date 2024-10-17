# actions-kit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

A tiny toolkit for GitHub Actions.

> [!WARNING]
> This package is still in development, and can change at any time.

## 📦 Installation

```bash
pnpm install actions-kit
```

## 🚀 Usage

This package contains a set of utilities to help you build GitHub Actions, or you can use it with a bundler like Webpack or Rollup.

### With Bundler

````typescript

### Utilities

#### `getValidatedInput`

This utility helps you get the input from the action and validate it using [Zod](https://zod.dev)

```typescript
import { getValidatedInput } from "actions-kit";
import { z } from "zod";

const schema = z.string().min(1);
const input = getValidatedInput("example_input", schema);

if (input.success) {
  console.log("Valid input:", input.data);
} else {
  console.error("Validation errors:", input.error);
}
````

## 📄 License

Published under [MIT License](./LICENSE).

[npm-version-src]: https://img.shields.io/npm/v/actions-kit?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/actions-kit
[npm-downloads-src]: https://img.shields.io/npm/dm/actions-kit?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/actions-kit
