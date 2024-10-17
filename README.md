# unplugin-actions-kit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

A typesafety for your GitHub Action inputs & outputs. Powered by [unplugin](https://github.com/unjs/unplugin).

## Installation

```bash
pnpm install -D unplugin-actions-kit
```

## Usage


<details>
<summary>Vite</summary><br/>

```ts
// vite.config.ts
import ActionsKitPlugin from "unplugin-actions-kit/vite";

export default defineConfig({
  plugins: [
    ActionsKitPlugin({ /* options */ }),
  ],
});
```

<br/></details>

<details>
<summary>Rollup</summary><br/>

```ts
// rollup.config.js
import ActionsKitPlugin from "unplugin-actions-kit/rollup";

export default {
  plugins: [
    ActionsKitPlugin({ /* options */ }),
  ],
};
```

<br/></details>

<details>
<summary>Webpack</summary><br/>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("unplugin-actions-kit/webpack").default({ /* options */ }),
  ],
};
```

<br/></details>

<details>
<summary>esbuild</summary><br/>

```ts
// esbuild.config.js
import { build } from "esbuild";
import ActionsKitPlugin from "unplugin-actions-kit/esbuild";

build({
  /* ... */
  plugins: [
    ActionsKitPlugin({
      /* options */
    }),
  ],
});
```

<br/></details>

<details>
<summary>Rspack</summary><br/>

```ts
// rspack.config.mjs
import ActionsKitPlugin from "unplugin-actions-kit/rspack"

/** @type {import("@rspack/core").Configuration} */
export default {
  plugins: [
    ActionsKitPlugin({
      /* options */
    }),
  ],
};
```

<br/></details>

<details>
<summary>Rolldown (Experimental)</summary><br/>

```ts
// rolldown.config.js
import { defineConfig } from "rolldown";
import ActionsKitPlugin from "unplugin-actions-kit/rolldown";

export default defineConfig({
  input: "./index.js",
  plugins: [
    ActionsKitPlugin({
      /* options */
    }),
  ],
});
```

<br/></details>

## Configuration

```typescript
ActionsKitPlugin({
	/**
	 * The path to the action.yml or action.yaml file.
	 * If not provided, it will look for action.yml or action.yaml in the root directory.
	 */
	actionPath?: string;

	/**
	 * Inject `inputs` and `outputs` into the global scope.
	 */
	inject?: boolean | "inputs" | "outputs";

	/**
	 * The output path for the generated typescript file.
	 * If not provided, it will use the directory where the action.yml or action.yaml file is located.
	 */
	outputPath?: string;
});
```


## 📄 License

Published under [MIT License](./LICENSE).

[npm-version-src]: https://img.shields.io/npm/v/unplugin-actions-kit?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/unplugin-actions-kit
[npm-downloads-src]: https://img.shields.io/npm/dm/unplugin-actions-kit?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/unplugin-actions-kit
