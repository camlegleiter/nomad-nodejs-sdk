import { Transform } from 'stream';

export default class FramedStream extends Transform {
  constructor(options = {}) {
    super({
      ...options,
      objectMode: true,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _transform(chunk, encoding, callback) {
    let json;
    try {
      json = JSON.parse(chunk.toString());
    } catch (error) {
      return callback(error);
    }
    return callback(null, json);
  }
}
