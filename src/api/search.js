const BaseAPI = require('./base');
const Nomad = require('../nomad');

Nomad.Search = class extends BaseAPI {
  // Prefix (string: <required>) - Specifies the identifer against which matches will be found. For
  //   example, if the given prefix were "a", potential matches might be "abcd", or "aabb".
  // Context (string: <required>) - Defines the scope in which a search for a prefix operates.
  //   Contexts can be: "jobs", "evals", "allocs", "nodes", "deployment" or "all", where "all" means
  //   every context will be searched.
  search({ Prefix, Context }, callback) {
    return this.request.postAsync({
      body: {
        Prefix,
        Context,
      },
      uri: 'search',
    })
    .bind(this)
    .asCallback(callback);
  }
};
