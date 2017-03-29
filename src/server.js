import gs          from 'glob-stream';
import path        from 'path';
import eventStream from 'event-stream';
import Hapi        from 'hapi';
import watch       from 'glob-watcher';
import {forceRequireFile} from './utils';

let server;
export function createServer (options) {
  server = new Hapi.Server();
  server.connection({port: 9000});

  let srcGlob = path.join(options.baseDir, options.src);
  let serverOptions = {
    ...options,
    srcGlob,
  };

  setupRoutes(serverOptions);

  return new Promise((resolve) => {
    server.on('start', (event) => {
      console.log('Mock server running at:', server.info.uri);
      if (options.watch) setupWatch(serverOptions);
      resolve(server);
    });
  });
}

function setupRoutes (options) {
  gs(options.srcGlob)
  .pipe(eventStream.through(
    file => read(file, options),
    () => end(options)
  ));
}

function setupWatch (options) {
  watch(options.srcGlob, (done) => {
    console.log('Restarting Mock server');
    server.stop(startServer);
    done();
  });
}

function read (file, options) {
  var fileContents = forceRequireFile(file.path);
  fileContents.map((endpoint) => {
    server.route({
      method: endpoint.method,
      path: endpoint.route,
      handler: (request, reply) => {
        setTimeout(() => {
          reply(endpoint.response(request)).code(endpoint.code);
        }, options.timeout || endpoint.timeout || 0);
      }
    });
  });
}

function end () {
  server.start();
}
