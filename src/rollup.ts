/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import type unplugin from "./";
import { createRollupPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import actionsKit from "actions-kit/unplugin//rollup"
 *
 * export default {
 *   plugins: [actionsKit()],
 * }
 * ```
 */
export default createRollupPlugin(unpluginFactory) as typeof unplugin.rollup;
