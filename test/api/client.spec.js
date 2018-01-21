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
      throw new Error(`Pending mocks still around: ${pendingMocks}`);
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
});
