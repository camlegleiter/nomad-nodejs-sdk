import http from 'http';

export const createServer = () => {
  const server = http.createServer((req, res) => {
    server.emit(req.url.replace(/(\?.*)/, ''), req, res);
  });

  server.on('listening', () => {
    const { port } = server.address();
    server.port = port;
    server.url = `http://localhost:${port}`;
  });
  server.port = 0;
  server.protocol = 'http';
  return server;
};

export const createEchoServer = () => {
  const server = http.createServer((req, res) => {
    const { url, method, headers } = req;
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    })
    .on('end', () => {
      res.writeHead(200, {
        'content-type': 'application/json',
      });
      res.write(JSON.stringify({
        url,
        method,
        headers,
        body,
      }));
      res.end();
    });
  });

  server.on('listening', () => {
    const { port } = server.address();
    server.port = port;
    server.url = `http://localhost:${port}`;
  });
  server.port = 0;
  server.protocol = 'http';
  return server;
};

export const createGetServer = ({ responseBody, type = 'application/json', statusCode = 200 } = {}) => {
  const server = http.createServer((req, res) => {
    req.on('data', () => {}).on('end', () => {
      res.writeHead(statusCode, {
        'content-type': type,
      });

      if (typeof responseBody === 'string') {
        res.write(responseBody);
      } else if (responseBody && type === 'application/json') {
        res.write(JSON.stringify(responseBody));
      }

      res.end();
    });
  });

  server.on('listening', () => {
    const { port } = server.address();
    server.port = port;
    server.url = `http://localhost:${port}`;
  });
  server.port = 0;
  server.protocol = 'http';
  return server;
};

export const createPostServer = ({
  responseBody, validateRequestBody, type = 'application/json', statusCode = 200,
}) => {
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    }).on('end', () => {
      if (validateRequestBody) {
        validateRequestBody(JSON.parse(body));
      }

      res.writeHead(statusCode, {
        'content-type': type,
      });

      if (responseBody && typeof responseBody === 'string') {
        res.write(responseBody);
      } else if (type === 'application/json') {
        res.write(JSON.stringify(responseBody));
      }

      res.end();
    });
  });

  server.on('listening', () => {
    const { port } = server.address();
    server.port = port;
    server.url = `http://localhost:${port}`;
  });
  server.port = 0;
  server.protocol = 'http';
  return server;
};
