import nock from 'nock';
import esc from 'url-escape-tag';
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

  before(() => {
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

  after(() => {
    nock.enableNetConnect();
  });

  describe('#readStats', () => {
    const stats = { AllocDirStats: {}, CPU: [] };

    it('makes a GET call to the /client/stats endpoint', () => {
      nock(/localhost/).get('/v1/client/stats').reply(200, stats);

      return expect(client.readStats()).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal('/v1/client/stats');

        expect(body).to.deep.equal(stats);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get('/v1/client/stats').reply(200, stats);

      return client.readStats().then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get('/v1/client/stats').reply(200, stats);

      client.readStats((err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal('/v1/client/stats');
        expect(body).to.deep.equal(stats);

        done();
      });
    });
  });

  describe('#readAllocation', () => {
    const stats = { ResourceUsage: {}, Tasks: {} };

    it('makes a GET call to the /client/allocation/:allocationid/stats endpoint', () => {
      nock(/localhost/).get(`/v1/client/allocation/${AllocationID}/stats`).reply(200, stats);

      return expect(client.readAllocation({
        AllocationID,
      })).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.equal(`/v1/client/allocation/${AllocationID}/stats`);

        expect(body).to.deep.equal(stats);
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get(`/v1/client/allocation/${AllocationID}/stats`).reply(200, stats);

      return client.readAllocation({ AllocationID }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/client/allocation/${AllocationID}/stats`).reply(200, stats);

      client.readAllocation({ AllocationID }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.equal(`/v1/client/allocation/${AllocationID}/stats`);
        expect(body).to.deep.equal(stats);

        done();
      });
    });
  });

  describe('#readFile', () => {
    const file = 'Hello, world!';

    it('makes a GET call to the /client/fs/cat/:allocationid endpoint with default path', () => {
      nock(/localhost/).get(`/v1/client/fs/cat/${AllocationID}`).query({
        path: '/',
      }).reply(200, file);

      return expect(client.readFile({
        AllocationID,
      })).eventually.fulfilled.then(([res, body]) => {
        expect(res.req.path).to.contain(`/v1/client/fs/cat/${AllocationID}`);

        expect(body).to.deep.equal(file);
      });
    });

    it('allows for the file path to be set', () => {
      nock(/localhost/).get(`/v1/client/fs/cat/${AllocationID}`).query({
        path: Path,
      }).reply(200, file);

      return client.readFile({ AllocationID, Path });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get(`/v1/client/fs/cat/${AllocationID}`).query({
        path: '/',
      }).reply(200, file);

      return client.readFile({ AllocationID }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/client/fs/cat/${AllocationID}`).query({
        path: '/',
      }).reply(200, file);

      client.readFile({ AllocationID }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.contain(`/v1/client/fs/cat/${AllocationID}`);
        expect(body).to.deep.equal(file);

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

    it('makes a GET call to the /client/fs/readat/:allocationid endpoint for a range', () => {
      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        limit: Limit,
      }).reply(200, file);

      return expect(client.readFileAtOffset({
        AllocationID, Offset, Limit,
      })).eventually.fulfilled;
    });

    it('allows for the file path to be set', () => {
      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: Path,
        offset: Offset,
        limit: Limit,
      }).reply(200, file);

      return client.readFileAtOffset({ AllocationID, Offset, Limit, Path });
    });

    it('returns a subset of the file at path', () => {
      Limit = 5;

      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        limit: Limit,
      }).reply(200, file.substring(Offset, Limit));

      return client.readFileAtOffset({
        AllocationID, Offset, Limit,
      }).then(([, body]) => {
        expect(body).to.equal('Hello');
      });
    });

    it('sets the context to the client', () => {
      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        limit: Limit,
      }).reply(200, file);

      return client.readFileAtOffset({ AllocationID, Offset, Limit }).then(function then() {
        expect(this).to.equal(client);
      });
    });

    it('supports a callback function', (done) => {
      nock(/localhost/).get(`/v1/client/fs/readat/${AllocationID}`).query({
        path: '/',
        offset: Offset,
        limit: Limit,
      }).reply(200, file);

      client.readFileAtOffset({ AllocationID, Offset, Limit }, (err, [res, body]) => {
        expect(err).to.be.null;

        expect(res.req.path).to.contain(`/v1/client/fs/readat/${AllocationID}`);
        expect(body).to.deep.equal(file);

        done();
      });
    });
  });

  describe('#streamFile', () => {
    const file = 'Hello, world!';

    beforeEach(() => {
      Offset = 0;
      Origin = 'start';
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
        const stream = new Readable();
        // eslint-disable-next-line no-underscore-dangle
        stream._read = () => {};
        stream.push(file.substring(Offset));
        stream.push(null);
        return stream;
      });

      let body = '';
      const stream = client.streamFile({ AllocationID, Offset, Origin });
      stream.on('data', (data) => {
        body += data;
      }).on('error', done).on('end', () => {
        expect(body).to.equal(file);
        done();
      });
    });
  });
});
