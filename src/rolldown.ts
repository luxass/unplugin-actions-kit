/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import type unplugin from "./";
import { createRolldownPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import actionsKit from "actions-kit/unplugin//rolldown"
 *
 * export default {
 *   plugins: [actionsKit()],
 * }
 * ```
 */
export default createRolldownPlugin(unpluginFactory) as typeof unplugin.rolldown;
