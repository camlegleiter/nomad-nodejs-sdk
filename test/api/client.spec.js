import nock from 'nock';
import { Readable } from 'stream';

import Nomad from '../../src';

describe('Nomad.Client', () => {
  let AllocationID;
  let Path;
  let Offset;
  let Limit;
  let Origin;
  let Task;
  let Follow;
  let Type;
  let Plain;

  let client;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    AllocationID = '5fc98185-17ff-26bc-a802-0c74fa471c99';
    Path = 'path/to/file.txt';

    client = new Nomad.Client();
  });

  afterEach(() => {
    const pendingMocks = nock.pendingMocks();
    if (pendingMocks.length) {
      const mocks = pendingMocks.slice(0);
      nock.cleanAll();
      throw new Error(`Pending mocks still around: ${JSON.stringify(mocks)}`);
    }
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('#readStats', () => {
    const stats = { AllocDirStats: {}, CPU: [] };

    it('makes a GET call to the /client/stats endpoint', async () => {
      nock(/localhost/).get('/v1/client/stats').reply(200, stats);

      const [, body] = await client.readStats();
      expect(body).toEqual(stats);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/client/stats').reply(200, stats);

      client.readStats((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(stats);
        done();
      });
    });
  });

  describe('#readAllocation', () => {
    const stats = { ResourceUsage: {}, Tasks: {} };

    it('makes a GET call to the /client/allocation/:allocationid/stats endpoint', async () => {
      nock(/localhost/).get(`/v1/client/allocation/${AllocationID}/stats`).reply(200, stats);

      const [, body] = await client.readAllocation({ AllocationID });
      expect(body).toEqual(stats);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/client/allocation/${AllocationID}/stats`).reply(200, stats);

      client.readAllocation({ AllocationID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(stats);
        done();
      });
    });
  });

  describe('#readFile', () => {
    const file = 'Hello, world!';

    it('makes a GET call to the /client/fs/cat/:allocationid endpoint with default path', async () => {
      nock(/localhost/).get(`/v1/client/fs/cat/${AllocationID}`).query({
        path: '/',
      }).reply(200, file);

      const [, body] = await client.readFile({ AllocationID });
      expect(body).toEqual(file);
    });

    it('allows for the file path to be set', async () => {
      nock(/localhost/).get(`/v1/client/fs/cat/${AllocationID}`).query({
        path: Path,
      }).reply(200, file);

      const [, body] = await client.readFile({ AllocationID, Path });
      expect(body).toEqual(file);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/client/fs/cat/${AllocationID}`).query({
        path: '/',
      }).reply(200, file);

      client.readFile({ AllocationID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(file);
        done();
      });
    });
  });

  describe('#readFileAtOffset', () => {
    const file = 'Hello, world!';

    beforeEach(() => {
      Offset = 0;
      Limit = file.length;
    });

    it('makes a GET call to the /client/fs/readat/:allocationid endpoint for a range', async () => {
      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        limit: Limit,
      }).reply(200, file);

      const [, body] = await client.readFileAtOffset({ AllocationID, Offset, Limit });
      expect(body).toEqual(file);
    });

    it('allows for the file path to be set', async () => {
      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: Path,
        offset: Offset,
        limit: Limit,
      }).reply(200, file);

      const [, body] = await client.readFileAtOffset({ AllocationID, Offset, Limit, Path });
      expect(body).toEqual(file);
    });

    it('returns a subset of the file at path', async () => {
      Limit = 5;

      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        limit: Limit,
      }).reply(200, file.substring(Offset, Limit));

      const [, body] = await client.readFileAtOffset({ AllocationID, Offset, Limit });
      expect(body).toBe('Hello');
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        limit: Limit,
      }).reply(200, file);

      client.readFileAtOffset({ AllocationID, Offset, Limit }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(file);
        done();
      });
    });
  });

  describe('#streamFile', () => {
    const file = 'Hello, world!';

    beforeEach(() => {
      Follow = true;
      Offset = 0;
      Origin = 'start';
      Plain = true;
    });

    it('makes a GET call to the /client/fs/stream/:allocationid endpoint for a range', (done) => {
      nock(/localhost/).get(`/v1/client/fs/stream/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        origin: Origin,
      }).reply(200, file);

      client.streamFile({
        AllocationID, Offset, Origin,
      }).on('error', done).on('end', done);
    });

    it('allows for the file path to be set', (done) => {
      nock(/localhost/).get(`/v1/client/fs/stream/${AllocationID}`).query({
        path: Path,
        offset: Offset,
        origin: Origin,
      }).reply(200, file);

      client.streamFile({
        AllocationID, Offset, Origin, Path,
      }).on('error', done).on('end', done);
    });

    it('streams the file at path from the file start', (done) => {
      Limit = 5;

      nock(/localhost/).get(`/v1/client/fs/stream/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        origin: Origin,
      }).reply(() => {
        const stream = new Readable({
          read: () => {},
        });
        stream.push(file.substring(Offset));
        stream.push(null);
        return stream;
      });

      let body = '';
      const stream = client.streamFile({ AllocationID, Offset, Origin });
      stream.on('data', (data) => {
        body += data;
      }).on('error', done).on('end', () => {
        expect(body).toBe(file);
        done();
      });
    });
  });

  describe('#streamLogs', () => {
    const stdout = '2000-01-01 00:00:00 DEBUG className:200 - This is a debug message';
    const stderr = '2000-01-01 00:00:00 ERROR className:200 - This is an error message';

    beforeEach(() => {
      Follow = true;
      Task = 'task';
      Type = 'stdout';
      Offset = 0;
      Origin = 'start';
      Plain = true;
    });

    const createAndEmitPlainStream = (type, offset) => {
      const stream = new Readable({
        read: () => {},
      });

      process.nextTick(() => {
        stream.push((type === 'stdout' ? stdout : stderr).slice(offset));
        stream.push(null);
      });

      return stream;
    };

    const createAndEmitFramedStream = (type, offset) => {
      const stream = new Readable({
        read: () => {},
      });

      process.nextTick(() => {
        stream.push(JSON.stringify({
          File: `alloc/logs/${Task}.${type}.0`,
          Offset: offset,
          Data: Buffer.from(type === 'stdout' ? stdout : stderr).toString('base64'),
        }));
        stream.push(null);
      });

      return stream;
    };

    it('makes a GET call to the /client/fs/logs/:allocationid endpoint with defaults', (done) => {
      nock(/localhost/).get(`/v1/client/fs/logs/${AllocationID}`).query((q) => {
        expect(q).toEqual({
          follow: 'false',
          offset: '0',
          origin: 'start',
          plain: 'false',
          task: Task,
          type: Type,
        });
        return true;
      }).reply(() => createAndEmitFramedStream(Type, Offset));

      client.streamLogs({
        AllocationID, Task, Type,
      }).on('error', done).on('data', () => {}).on('end', done);
    });

    it('emits an error when the request errors', (done) => {
      const errorMessage = 'ECONNABORTED';
      nock(/localhost/).get(`/v1/client/fs/logs/${AllocationID}`)
        .query(true).replyWithError(errorMessage);

      client.streamLogs({
        AllocationID, Task, Type,
      }).on('error', (err) => {
        expect(err.message).toBe(errorMessage);
        done();
      });
    });

    it('emits an error with the response message if receiving a non-200 status', (done) => {
      const errorMessage = 'some error message';

      nock(/localhost/).get(`/v1/client/fs/logs/${AllocationID}`).query({
        follow: 'false',
        offset: '0',
        origin: 'start',
        plain: 'true',
        task: Task,
        type: Type,
      }).reply(400, errorMessage);

      client.streamLogs({
        AllocationID, Task, Type, Plain,
      }).on('error', (err) => {
        expect(err.message).toEqual(errorMessage);
        done();
      });
    });

    it('allows for logs to be tailed for output', (done) => {
      Follow = true;

      nock(/localhost/).get(`/v1/client/fs/logs/${AllocationID}`).query({
        follow: 'true',
        offset: '0',
        origin: 'start',
        plain: 'false',
        task: Task,
        type: Type,
      }).reply(() => createAndEmitFramedStream(Type, Offset));

      client.streamLogs({
        AllocationID, Task, Follow, Type,
      }).on('error', done).on('data', (frame) => {
        expect(Buffer.from(frame.Data, 'base64').toString()).toBe(stdout);
      }).on('end', done);
    });

    it('allows for stderr logs to be returned', (done) => {
      Type = 'stderr';

      nock(/localhost/).get(`/v1/client/fs/logs/${AllocationID}`).query({
        follow: 'false',
        offset: '0',
        origin: 'start',
        plain: 'false',
        task: Task,
        type: Type,
      }).reply(() => createAndEmitFramedStream(Type, Offset));

      client.streamLogs({
        AllocationID, Task, Type,
      }).on('error', done).on('data', (frame) => {
        expect(Buffer.from(frame.Data, 'base64').toString()).toBe(stderr);
      }).on('end', done);
    });

    it('allows for logs to be returned as plain text', (done) => {
      Plain = true;

      nock(/localhost/).get(`/v1/client/fs/logs/${AllocationID}`).query({
        follow: 'false',
        offset: '0',
        origin: 'start',
        plain: 'true',
        task: Task,
        type: Type,
      }).reply(() => createAndEmitPlainStream(Type, Offset));

      client.streamLogs({
        AllocationID, Task, Type, Plain,
      }).on('error', done).on('data', (chunk) => {
        expect(chunk.toString()).toBe(stdout);
      }).on('end', done);
    });
  });

  describe('#listFiles', () => {
    const files = [
      {
        Name: 'alloc',
        IsDir: true,
        Size: 4096,
        FileMode: 'drwxrwxr-x',
        ModTime: '2016-03-15T15:40:00.414236712-07:00',
      },
    ];

    it('makes a GET call to the /client/fs/ls/:allocationid endpoint with default path', async () => {
      nock(/localhost/).get(`/v1/client/fs/ls/${AllocationID}`).query({
        path: '/',
      }).reply(200, files);

      const [, body] = await client.listFiles({ AllocationID });
      expect(body).toEqual(files);
    });

    it('allows for the file path to be set', async () => {
      nock(/localhost/).get(`/v1/client/fs/ls/${AllocationID}`).query({
        path: Path,
      }).reply(200, files);

      const [, body] = await client.listFiles({ AllocationID, Path });
      expect(body).toEqual(files);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/client/fs/ls/${AllocationID}`).query({
        path: '/',
      }).reply(200, files);

      client.listFiles({ AllocationID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(files);
        done();
      });
    });
  });

  describe('#statFile', () => {
    const file = {
      Name: 'alloc',
      IsDir: true,
      Size: 4096,
      FileMode: 'drwxrwxr-x',
      ModTime: '2016-03-15T15:40:00.414236712-07:00',
    };

    it('makes a GET call to the /client/fs/stat/:allocationid endpoint with default path', async () => {
      nock(/localhost/).get(`/v1/client/fs/stat/${AllocationID}`).query({
        path: '/',
      }).reply(200, file);

      const [, body] = await client.statFile({ AllocationID });
      expect(body).toEqual(file);
    });

    it('allows for the file path to be set', async () => {
      nock(/localhost/).get(`/v1/client/fs/stat/${AllocationID}`).query({
        path: Path,
      }).reply(200, file);

      const [, body] = await client.statFile({ AllocationID, Path });
      expect(body).toEqual(file);
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/client/fs/stat/${AllocationID}`).query({
        path: '/',
      }).reply(200, file);

      client.statFile({ AllocationID }, (err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toEqual(file);
        done();
      });
    });
  });

  describe('#gc', () => {
    it('makes a GET call to the /client/gc endpoint with default path', async () => {
      nock(/localhost/).get('/v1/client/gc').reply(200);

      const [, body] = await client.gc();
      expect(body).toBeUndefined();
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/client/gc').reply(200);

      client.gc((err, [, body]) => {
        expect(err).toBeNull();

        expect(body).toBeUndefined();
        done();
      });
    });
  });
});
