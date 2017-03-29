import fetch from 'node-fetch';
import {startServer} from '../src/server';

describe('default', () => {
  var server;
  beforeEach(async (done) => {
    server = await startServer({src: `${__dirname}/app/mocks/**/*.js`});
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

    await expect(request).toEqual({data: {title: 'My Awesome Test Mock, Dude!'}});
  });
});
