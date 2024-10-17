/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import type unplugin from "./";
import { createRspackPlugin } from "unplugin";
import { unpluginFactory } from "./";
/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.ts
 * import actionsKit from "actions-kit/unplugin/rspack"
 *
 * export actionsKit defineConfig({
 *   plugins: [actionsKit()],
 * })
 * ```
 */
export default createRspackPlugin(unpluginFactory) as typeof unplugin.rspack;
