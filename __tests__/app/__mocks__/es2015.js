module.exports = [
  {
    route: '/es2015',
    method: 'GET',
    code: 200,
    timeout: 1000,
    response: () => {
      return {
        "data": {
          "title": "My Awesome es2015 Test Mock, Dude!"
        }
      }
    }
  },
  {
    route: '/es2015/{username}',
    method: 'GET',
    code: 200,
    timeout: 1000,
    response: (request) => {
      return {
        "data": {
          "title": "My Awesome es2015 Test Mock, " + request.params.username + "!"
        }
      }
    }
  }
];
