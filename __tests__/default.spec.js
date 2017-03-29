import path        from 'path';
import fetch from 'node-fetch';
import Pleeb from '../src/server';
import appRootDir  from 'app-root-dir';

describe('default', () => {
  var server;

  beforeEach(async (done) => {
    server = await Pleeb.start({
      src: `./__tests__/app/__mocks__/**/*.js`
    });

    done();
  });

  afterEach(() => {
    server.stop();
  });

  it('GET /default', async () => {
    let request = await fetch('http://localhost:9000/default')
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });

    expect(request).toEqual({data: {title: 'My Awesome Test Mock, Dude!'}});
  });

  it('GET /default/fred', async () => {
    let request = await fetch('http://localhost:9000/default/fred')
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });

    expect(request).toEqual({data: {title: 'My Awesome Test Mock, fred!'}});
  });
});
