import esbuild from 'esbuild';
import { a as getBuiltConfigPath } from './utils-a8fea457.esm.js';
import { i as initConfig } from './initConfig-c29e1934.esm.js';

function getEsbuildConfig(cwd) {
  return {
    entryPoints: ['./keystone'],
    absWorkingDir: cwd,
    bundle: true,
    outfile: '.keystone/config.js',
    format: 'cjs',
    platform: 'node',
    plugins: [{
      name: 'external-node_modules',
      setup(build) {
        build.onResolve({
          // this regex is intended to be the opposite of /^\.\.?(?:\/|$)/
          // so it matches anything that isn't a relative import
          // so this means that we're only going to bundle relative imports
          // we can't use a negative lookahead/lookbehind because this regex is executed
          // by Go's regex package which doesn't support them
          // this regex could have less duplication with nested groups but this is probably easier to read
          filter: /(?:^[^.])|(?:^\.[^/.])|(?:^\.\.[^/])/
        }, args => {
          return {
            external: true,
            path: args.path
          };
        });
      }
    }]
  };
}
function loadBuiltConfig(cwd) {
  return initConfig(require(getBuiltConfigPath(cwd)).default);
}
async function loadConfigOnce(cwd) {
  await esbuild.build(getEsbuildConfig(cwd));
  return loadBuiltConfig(cwd);
}

export { loadConfigOnce as a, getEsbuildConfig as g, loadBuiltConfig as l };
