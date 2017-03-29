import gs          from 'glob-stream';
import eventStream from 'event-stream';
import Hapi        from 'hapi';
import watch       from 'glob-watcher';

var server;

const serverDefaults = {
  src: '../__tests__/app/mocks'
};

export function startServer (options = serverDefaults) {
  server = createServer();
  setupRoutes(options.src);

  return new Promise((resolve) => {
    server.on('start', (event) => {
      console.log('Mock server running at:', server.info.uri);
      if (options.watch) setupWatch(options.src);
      resolve(server);
    });
  });
}

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
