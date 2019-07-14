const FramedStream = require('../../src/stream/framedstream');

describe('FramedStream', () => {
  let framedStream;

  describe('constructor', () => {
    it('sets the stream in objectMode', () => {
      framedStream = new FramedStream();

      // eslint-disable-next-line no-underscore-dangle
      expect(framedStream._readableState.objectMode).toBe(true);
    });
  });

  describe('transform', () => {
    beforeEach(() => {
      framedStream = new FramedStream();
    });

    afterEach(() => {
      framedStream.end();
    });

    it('emits data as JSON objects', (done) => {
      const object = { foo: 'bar' };
      framedStream.write(JSON.stringify(object));

      framedStream.on('data', (data) => {
        expect(data).toEqual(object);
        done();
      }).on('error', done);
    });

    it('emits an error if a chunk is not valid JSON', (done) => {
      framedStream.on('data', () => {
        done(new Error('Expected stream to emit error'));
      }).on('error', (err) => {
        expect(err).not.toBeUndefined();
        done();
      });

      framedStream.write('BOOM!');
    });
  });
});
