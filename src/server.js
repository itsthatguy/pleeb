import gs          from 'glob-stream';
import path        from 'path';
import eventStream from 'event-stream';
import Hapi        from 'hapi';
import watch       from 'glob-watcher';
import appRootDir  from 'app-root-dir';
import {defaults}  from 'lodash';

var server;

const serverDefaults = {
  baseDir: appRootDir.get(),
  src: './__mocks__/**/*.js'
};

const Pleeb = {
  start: (options = serverDefaults) => {
    let mergedOptions = defaults(options, serverDefaults);
    let srcGlob = path.join(mergedOptions.baseDir, mergedOptions.src);

    server = createServer();
    setupRoutes(srcGlob);

    return new Promise((resolve) => {
      server.on('start', (event) => {
        console.log('Mock server running at:', server.info.uri);
        if (mergedOptions.watch) setupWatch(srcGlob);
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
  return require(filepath);
}

function read (file) {
  var fileContents = forceRequireFile(file.path);
  fileContents.default.map((endpoint) => {
    server.route({
      method: endpoint.method,
      path: endpoint.route,
      handler: (request, reply) => {
        setTimeout(() => {
          reply(endpoint.response(request)).code(endpoint.code);
        }, endpoint.timeout || 0);
      }
    });
  });
}

function end () {
  server.start();
}

export default Pleeb;
