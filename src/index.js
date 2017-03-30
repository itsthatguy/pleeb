import path                          from 'path';
import appRootDir                    from 'app-root-dir';
import watch                         from 'glob-watcher';
import {createServer, restartServer} from './server';
import {getRoutes}                   from './builder';

const DEFAULTS = {
  baseDir: appRootDir.get(),
  dest: `./`,
  src: './__mocks__/**/*.js',
  timeout: null,
  watch: true,
};

const TEST_DEFAULTS = {
  baseDir: appRootDir.get(),
  dest: `./__tests__/app/__mocks__/`,
  src: `./__tests__/app/__mocks__/**/*.js`,
  timeout: 0,
  watch: false,
};

function serverDefaults () {
  if (process.env.NODE_ENV === 'test') return TEST_DEFAULTS;
  return DEFAULTS;
};

class Pleeb {
  setOptions (options) {
    let mergedOptions = {...serverDefaults(), ...options};
    let srcGlob = path.join(mergedOptions.baseDir, mergedOptions.src);

    mergedOptions = {
      ...mergedOptions,
      srcGlob,
    };

    this.options = mergedOptions;
    return mergedOptions;
  }

  async start (options = serverDefaults) {
    this.setOptions(options);
    try {
      let server = await createServer(this.options);

      if (this.options.watch) {
        this.watchMocks(this.options);
      }
      return server;
    } catch (error) {
      console.error(error);
    }
  }

  build (options = serverDefaults) {
    this.setOptions(options);
    return getRoutes(this.options);
  }

  watchMocks (options) {
    watch(options.srcGlob, (done) => {
      restartServer(options);
      this.build(options);
      done();
    });
  }

}

export default new Pleeb();
