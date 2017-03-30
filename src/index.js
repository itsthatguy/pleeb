import appRootDir     from 'app-root-dir';
import {createServer} from './server';
import {getRoutes}    from './builder';

const serverDefaults = {
  baseDir: appRootDir.get(),
  dest: `./__mocks__/`,
  src: './__mocks__/**/*.js',
  timeout: null,
  watch: true,
};

class Pleeb {
  setOptions (options) {
    let mergedOptions = {...serverDefaults};

    if (process.env.NODE_ENV === 'test') {
      mergedOptions = {
        ...mergedOptions,
        dest: `./__tests__/app/__mocks__/`,
        src: `./__tests__/app/__mocks__/**/*.js`,
        timeout: 0,
        watch: false,
      };
    }

    mergedOptions = {
      ...mergedOptions,
      ...options
    };

    this.options = mergedOptions;
    return mergedOptions;
  }

  start (options = serverDefaults) {
    this.setOptions(options);
    return createServer(this.options);
  }

  build (options = serverDefaults) {
    this.setOptions(options);
    return getRoutes(this.options);
  }

}

export default new Pleeb();
