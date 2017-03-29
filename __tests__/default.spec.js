import path        from 'path';
import fetch from 'node-fetch';
import {startServer} from '../src/server';
import appRootDir  from 'app-root-dir';

describe('default', () => {
  var server;

  beforeEach(async (done) => {
    server = await startServer({
      src: `./__tests__/app/__mocks__/**/*.js`
    });

    done();
  });

  afterEach(() => {
    server.stop();
  });

  it('GET', async () => {
    let request = await fetch('http://localhost:9000/default')
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });

    expect(request).toEqual({data: {title: 'My Awesome Test Mock, Dude!'}});
  });
});
