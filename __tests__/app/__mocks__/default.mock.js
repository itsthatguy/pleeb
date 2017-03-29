export default [
  {
    route: '/default',
    method: 'GET',
    code: 200,
    timeout: 1000,
    response: () => {
      return {
        "data": {
          "title": "My Awesome Test Mock, Dude!"
        }
      }
    }
  },
  {
    route: '/default/{username}',
    method: 'GET',
    code: 200,
    timeout: 1000,
    defaultRequest: {params: {username: 'foo'}},
    response: (request) => {
      return {
        "data": {
          "title": `My Awesome Test Mock, ${request.params.username}!`
        }
      }
    }
  }
];
