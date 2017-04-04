import {flatten}          from 'lodash';
import {inspect}          from 'util';
import {writeFileSync}    from 'fs';
import gs                 from 'glob-stream';
import path               from 'path';
import eventStream        from 'event-stream';
import Hapi               from 'hapi';
import watch              from 'glob-watcher';
import appRootDir         from 'app-root-dir';
import format             from 'string-template';

import {forceRequireFile} from './utils'

let contract;
export function getRoutes (options) {
  contract = [];
  return new Promise(resolve => {
    try {
      return gs(options.src)
      .pipe(eventStream.through(
        (file, callback) => read(file, options),
        () => end(options, resolve)
      ));
    } catch (error) {
      console.error(error);
    }
  });
}

function formattedRoute (route, params = {}) {
  return format(route, params);
}

function read (file, options) {
  let fileContents = forceRequireFile(file.path);

  let transformedEndpoints = fileContents.map((endpoint) => {
    let request = endpoint.defaultRequest || {};

    let transformedEndpoint = {
      route: formattedRoute(endpoint.route, request.params),
      method: endpoint.method,
      headers: endpoint.headers || {},
      in_progress: endpoint.in_progress || false,
      payload: endpoint.response(request)
    };

    if (endpoint.defaultRequest) transformedEndpoint.defaultRequest = endpoint.defaultRequest;

    return transformedEndpoint;
  });

  contract.push(flatten(transformedEndpoints));
}

function end (options, resolve) {
  let contractPath = path.join(options.baseDir, options.dest, 'api_contract.json');
  let jsonContract = JSON.stringify(flatten(contract), null, 2);
  writeFileSync(contractPath, jsonContract);
  console.log(`Api Contract generated at: ${contractPath}`);
  resolve();
}
