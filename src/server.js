import gs                 from 'glob-stream';
import path               from 'path';
import eventStream        from 'event-stream';
import Hapi               from 'hapi';
import {forceRequireFile} from './utils';

let server;
export function createServer (options) {
  server = new Hapi.Server();
  server.connection({port: 9000});

  setupRoutes(options);

  return new Promise((resolve) => {
    server.on('start', (event) => {
      console.log('[Pleeb] Mock server running at:', server.info.uri);
      resolve(server);
    });
  });
}

export function restartServer (options) {
  console.log('[Pleeb] Restarting Mock server');
  server.stop(() => createServer(options));
}

function setupRoutes (options) {
  gs(options.srcGlob)
  .pipe(eventStream.through(
    file => read(file, options),
    () => end(options)
  ));
}


function read (file, options) {
  var fileContents = forceRequireFile(file.path);
  fileContents.map((endpoint) => {
    let config = {
      method: endpoint.method,
      path: endpoint.route,
      handler: (request, reply) => {
        setTimeout(() => {
          reply(endpoint.response(request)).code(endpoint.code);
        }, options.timeout || endpoint.timeout || 0);
      }
    };

    server.route(config);
  });
}

function end () {
  server.start();
}
