# @phipagamentos Logger
This is a package to add logging to request/response packages inside backend services and web applications.

## Installing
Using NPM:

```sh
npm install @phipagamentos/logger
```

## Usage
There is 3 ways to use this package, for now. This package can be:

1. A simple logger that uses [bunyan](https://github.com/trentm/node-bunyan) as logging package.
2. A middleware for [Express](https://github.com/expressjs/express) services, used to log all requests received by the service
3. A interceptor for [axios](https://github.com/axios/axios) request package, logging all requests that axios executes

### Simple Logger

```javascript
const { Logger: basicLogger } = require('@somosphi/logger').default({
  PROJECT_NAME: 'project-name',
});

basicLogger.info(JSON.stringify({
  message: 'This is a cool message',
  origin: 'Some Place',
  status: 200,
})); 
/*
  This will create the following log: 
 {"name":"project-name","hostname":"hostname.local","pid":245,"level":30,"msg":"{\"message\":\"This is a cool message\",\"origin\":\"Some Place\",\"status\":200}","time":"2019-09-10T00:42:46.361Z","v":0}
*/
```

### Express Middleware
```javascript
const { ExpressLogger } = require('@somosphi/logger').default({
  PROJECT_NAME: 'project-name',
});

/** Request/Response Logger */
app.use(ExpressLogger.onSuccess);
app.use(ExpressLogger.onError);

/*
  This will create the following log:
{"name":"project-name","hostname":"hostname.local","pid":298,"level":30,"msg":"{\"origin\":\"Express\",\"requrestId\":\"77215bf8-f821-4faf-bcc1-2c0260eafc66\",\"type\":\"Request or Response\",\"headers\":{\"data\":\"all headers\"},\"body\":{\"data\":\"all body\"}}","time":"2019-09-10T00:49:04.394Z","v":0}
*/
```

### Axios Interceptor
```javascript
const { AxiosLogger } = require('@somosphi/logger').default({
  PROJECT_NAME: 'project-name',
});

const axiosInstance = require('axios').default.create({ ...config });

AxiosLogger.attachInterceptor(axiosInstance);

/*
  This will create the following log:
{"name":"project-name","hostname":"hostname.local","pid":24654,"level":30,"msg":"{\"origin\":\"Axios\",\"requrestId\":\"77215bf8-f821-4faf-bcc1-2c0260eafc66\",\"type\":\"Request or Response\",\"headers\":{\"data\":\"all headers\"},\"body\":{\"data\":\"all body\"},\"method\":\"HTTP Method\",\"url\":\"https://somosphi.com\",\"data\":{\"data\":\"all data from axios\"},\"params\":{\"data\":\"params used\"},\"status\":200,\"statusText\":\"OK\"}","time":"2019-09-10T00:53:40.767Z","v":0}
*/
```

### Request Debug
```javascript
const { RequestLogger } = require('@somosphi/logger').default({
  PROJECT_NAME: 'project-name',
});
const request = require('request');

RequestLogger.attachDebug(request);

/*
  This will create the following log:
{"name":"project-name","hostname":"hostname.local","pid":24654,"level":30,"msg":"{\"origin\":\"Request\",\"requrestId\":\"77215bf8-f821-4faf-bcc1-2c0260eafc66\",\"type\":\"Request or Response\",\"headers\":{\"data\":\"all headers\"},\"body\":{\"data\":\"all body\"},\"method\":\"HTTP Method\",\"url\":\"https://somosphi.com\",\"data\":{\"data\":\"all data from axios\"},\"params\":{\"data\":\"params used\"},\"status\":200,\"statusText\":\"OK\"}","time":"2019-09-10T00:53:40.767Z","v":0}
*/
```
