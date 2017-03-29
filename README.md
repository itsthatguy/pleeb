# Pleeb

### Sample mock files

```js
export default [
  // simple request
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
  // request with dynamic response
  {
    route: '/default/{username}',
    method: 'GET',
    code: 200,
    timeout: 1000,
    response: (request) => {
      return {
        "data": {
          "title": `My Awesome Test Mock, ${request.params.username}!`
        }
      }
    }
  }
];

```
