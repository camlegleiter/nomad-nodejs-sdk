const esc = require('url-escape-tag');

const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.ACLToken = class extends BaseAPI {
  bootstrapToken(callback) {
    return this.request.postAsync({
      uri: 'acl/bootstrap',
    })
    .bind(this)
    .asCallback(callback);
  }

  listTokens(callback) {
    return this.request.getAsync({
      uri: 'acl/tokens',
    })
    .bind(this)
    .asCallback(callback);
  }

  // Name (string: <optional>) The human readable name of the token.
  // Type (string: <required>) - The type of token. Must be either 'client' or 'management'.
  // Policies (array<string>: <required>) - Must be null or blank for management type tokens,
  //   otherwise must specify at least one policy for client type tokens.
  // Global (bool: <optional>) - If true, indicates this token should be replicated globally to all
  //   regions. Otherwise, this token is created local to the target region.
  createToken({
    Name, Type, Policies, Global,
  }, callback) {
    const body = {
      Type,
      Policies,
    };
    if (Name !== undefined) {
      body.Name = Name;
    }
    if (Global !== undefined) {
      body.Global = Global;
    }

    return this.request.postAsync({
      body,
      uri: 'acl/tokens',
    })
    .bind(this)
    .asCallback(callback);
  }

  // AccessorID (string: <required>) - Specifies the token (by accessor) that is being updated.
  //   Must match payload body and request path.
  // Name (string: <optional>) - Specifies the human readable name of the token.
  // Type (string: <required>) - Specifies the type of token. Must be either client or management.
  // Policies (array<string>: <required>) - Must be null or blank for management type tokens,
  //   otherwise must specify at least one policy for client type tokens.
  updateToken({
    AccessorID, Name, Type, Policies,
  }, callback) {
    const body = {
      AccessorID,
      Type,
      Policies,
    };
    if (Name !== undefined) {
      body.Name = Name;
    }

    return this.request.postAsync({
      body,
      uri: esc`acl/token/${AccessorID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  // AccessorID (string: <required>) - Specifies the token (by accessor) that is being read.
  readToken({ AccessorID }, callback) {
    return this.request.getAsync({
      uri: esc`acl/token/${AccessorID}`,
    })
    .bind(this)
    .asCallback(callback);
  }

  readSelfToken(callback) {
    return this.request.getAsync({
      uri: 'acl/token/self',
    })
    .bind(this)
    .asCallback(callback);
  }

  // AccessorID (string: <required>) - Specifies the token (by accessor) that is being read.
  deleteToken({ AccessorID }, callback) {
    return this.request.deleteAsync({
      uri: esc`acl/token/${AccessorID}`,
    })
    .bind(this)
    .asCallback(callback);
  }
};
