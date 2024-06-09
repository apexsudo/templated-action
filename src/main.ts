/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
import { spawnSync } from 'child_process'

export async function run(): Promise<void> {
  const mainScript = `${__dirname}/templated`
  spawnSync(mainScript, { stdio: 'inherit' })
}
