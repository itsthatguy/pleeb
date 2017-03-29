import gs          from 'glob-stream';
import path        from 'path';
import eventStream from 'event-stream';
import Hapi        from 'hapi';
import watch       from 'glob-watcher';
import appRootDir  from 'app-root-dir';

var server;

const serverDefaults = {
  baseDir: appRootDir.get(),
  src: './__mocks__/**/*.js',
  timeout: null,
  watch: true,
};

var pleebOptions;
function setOptions (options) {
  let mergedOptions = {
    ...serverDefaults,
    ...options
  };

  if (process.env.NODE_ENV === 'test') {
    mergedOptions = {
      ...mergedOptions,
      src: `./__tests__/app/__mocks__/**/*.js`,
      timeout: 0,
      watch: false,
    };
  }

  pleebOptions = mergedOptions;
};

const Pleeb = {
  start: (options = serverDefaults) => {
    setOptions(options);
    let srcGlob = path.join(pleebOptions.baseDir, pleebOptions.src);

    server = createServer();
    setupRoutes(srcGlob);

    return new Promise((resolve) => {
      server.on('start', (event) => {
        console.log('Mock server running at:', server.info.uri);
        if (pleebOptions.watch) setupWatch(srcGlob);
        resolve(server);
      });
    });
  }
};

function createServer () {
  server = new Hapi.Server();
  server.connection({port: 9000});
  return server;
}

function setupRoutes (src) {
  gs(src)
  .pipe(eventStream.through(read, end));
}

function setupWatch (src) {
  watch(src, (done) => {
    console.log('Restarting Mock server');
    server.stop(startServer);
    done();
  });
}

function forceRequireFile (filepath) {
  if (require.cache[filepath]) {
    delete require.cache[filepath];
  }
  let fileContents = require(filepath);
  return fileContents.default || fileContents;
}

function read (file) {
  var fileContents = forceRequireFile(file.path);
  fileContents.map((endpoint) => {
    server.route({
      method: endpoint.method,
      path: endpoint.route,
      handler: (request, reply) => {
        setTimeout(() => {
          reply(endpoint.response(request)).code(endpoint.code);
        }, pleebOptions.timeout || endpoint.timeout || 0);
      }
    });
  });
}

function end () {
  server.start();
}

export default Pleeb;
