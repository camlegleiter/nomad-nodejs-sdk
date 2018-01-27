import esc from 'url-escape-tag';
import { PassThrough } from 'stream';

import Nomad from '../nomad';
import { FramedStream } from '../stream';
import BaseAPI from './base';

Nomad.Client = class extends BaseAPI {
  readStats(callback) {
    return this.request.getAsync({
      uri: 'client/stats',
    })
    .bind(this)
    .asCallback(callback);
  }

  // AllocationID (string: <required>) - Specifies the allocation ID to query. This is specified as
  //   part of the URL. Note, this must be the full allocation ID, not the short 8-character one.
  //   This is specified as part of the path.
  readAllocation({ AllocationID }, callback) {
    return this.request.getAsync({
      uri: esc`client/allocation/${AllocationID}/stats`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // AllocationID (string: <required>) - Specifies the allocation ID to query. This is specified as
  //   part of the URL. Note, this must be the full allocation ID, not the short 8-character one.
  //   This is specified as part of the path.
  // path (string: "/") - Specifies the path of the file to read, relative to the root of the
  //   allocation directory.
  readFile({ AllocationID, Path = '/' }, callback) {
    return this.request.getAsync({
      json: false,
      qs: {
        path: Path,
      },
      uri: esc`client/fs/cat/${AllocationID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // AllocationID (string: <required>) - Specifies the allocation ID to query. This is specified as
  //   part of the URL. Note, this must be the full allocation ID, not the short 8-character one.
  //   This is specified as part of the path.
  // path (string: "/") - Specifies the path of the file to read, relative to the root of the
  //   allocation directory.
  // offset (int: <required>) - Specifies the byte offset from where content will be read.
  // limit (int: <required>) - Specifies the number of bytes to read from the offset.
  readFileAtOffset({
    AllocationID, Path = '/', Offset, Limit,
  }, callback) {
    return this.request.getAsync({
      json: false,
      qs: {
        path: Path,
        offset: Offset,
        limit: Limit,
      },
      uri: esc`client/fs/readat/${AllocationID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // AllocationID (string: <required>) - Specifies the allocation ID to query. This is specified as
  //   part of the URL. Note, this must be the full allocation ID, not the short 8-character one.
  //   This is specified as part of the path.
  // path (string: "/") - Specifies the path of the file to read, relative to the root of the
  //   allocation directory.
  // offset (int: <required>) - Specifies the byte offset from where content will be streamed.
  // origin (string: "start|end") - Applies the relative offset to either the start or end of the
  //   file.
  streamFile({
    AllocationID, Path = '/', Offset, Origin,
  }) {
    return this.request.get({
      qs: {
        path: Path,
        offset: Offset,
        origin: Origin,
      },
      uri: esc`client/fs/stream/${AllocationID}`,
    });
  }

  // AllocationID (string: <required>) - Specifies the allocation ID to query. This is specified as
  //   part of the URL. Note, this must be the full allocation ID, not the short 8-character one.
  //   This is specified as part of the path.
  // task (string: <required>) - Specifies the name of the task inside the allocation to stream logs
  //   from.
  // follow (bool: false)- Specifies whether to tail the logs.
  // type (string: "stderr|stdout") - Specifies the stream to stream.
  // offset (int: 0) - Specifies the offset to start streaming from.
  // origin (string: "start|end") - Specifies either "start" or "end" and applies the offset
  //   relative to either the start or end of the logs respectively. Defaults to "start".
  // plain (bool: false) - Return just the plain text without framing. This can be useful when
  //   viewing logs in a browser.
  streamLogs({
    AllocationID, Task, Follow = false, Type, Offset = 0, Origin = 'start', Plain = false,
  }) {
    const req = this.request.get({
      json: true,
      qs: {
        task: Task,
        follow: Follow,
        type: Type,
        offset: Offset,
        origin: Origin,
        plain: Plain,
      },
      uri: esc`client/fs/logs/${AllocationID}`,
    });

    const stream = Plain ? new PassThrough() : new FramedStream();

    req.on('error', (err) => {
      stream.emit('error', err);
    });

    req.on('response', (res) => {
      if (res.statusCode !== 200) {
        let complete = false;
        req.on('complete', () => {
          if (complete) {
            return;
          }
          complete = true;
          stream.emit('error', new Error(res.body));
        });
        req.readResponseBody(res);
        return;
      }
      res.pipe(stream);
    });

    return stream;
  }

  // AllocationID (string: <required>) - Specifies the allocation ID to query. This is specified as
  //   part of the URL. Note, this must be the full allocation ID, not the short 8-character one.
  //   This is specified as part of the path.
  // path (string: "/") - Specifies the path of the file to read, relative to the root of the
  //   allocation directory.
  listFiles({ AllocationID, Path = '/' }, callback) {
    return this.request.getAsync({
      json: true,
      qs: {
        path: Path,
      },
      uri: esc`client/fs/ls/${AllocationID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // AllocationID (string: <required>) - Specifies the allocation ID to query. This is specified as
  //   part of the URL. Note, this must be the full allocation ID, not the short 8-character one.
  //   This is specified as part of the path.
  // path (string: "/") - Specifies the path of the file to read, relative to the root of the
  //   allocation directory.
  statFile({ AllocationID, Path = '/' }, callback) {
    return this.request.getAsync({
      json: true,
      qs: {
        path: Path,
      },
      uri: esc`client/fs/stat/${AllocationID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  gc(callback) {
    return this.request.getAsync({
      uri: 'client/gc',
    })
    .bind(this)
    .asCallback(callback);
  }
};
