import {writeFileSync} from 'fs';
import gs          from 'glob-stream';
import path        from 'path';
import eventStream from 'event-stream';
import Hapi        from 'hapi';
import watch       from 'glob-watcher';
import appRootDir  from 'app-root-dir';
import format      from 'string-template';

import {forceRequireFile} from './utils'

let contract = [];
export function getRoutes (options) {
  return new Promise(resolve => {
    gs(options.src)
    .pipe(eventStream.through(
      file => read(file, options),
      () => end(options, resolve)
    ));
  });
}

function formattedRoute (route, params = {}) {
  return format(route, params);
}

function read (file) {
  let fileContents = forceRequireFile(file.path);

  contract = [
    ...contract,
    fileContents.map((endpoint) => {

      let request = endpoint.defaultRequest || {};

      return {
        route: formattedRoute(endpoint.route, request.params),
        method: endpoint.method,
        in_progress: endpoint.in_progress || false,
        payload: endpoint.response(request)
      };
    })
  ];
}

function end (options, resolve) {
  writeFileSync(path.join(options.baseDir, options.dest, 'api_contract.json'), JSON.stringify(contract, null, 2));
  resolve();
}
