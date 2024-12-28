export const makeRequest = function makeRequest(endpoint, options = {}) {
  const opts = {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    params: options.params || [],
    query: options.query || {},
  };
  if (opts.body) {
    opts.body = JSON.stringify(opts.body);
  }
  if (opts.formData) {
    delete opts.headers["Content-Type"];
    opts.body = opts.formData;
  }
  let url = endpoint.url.apply(null, opts.params);
  if (Object.keys(opts.query).length > 0) {
    url += "?" + new URLSearchParams(opts.query).toString();
  }
  return fetch(url, {
    method: endpoint.method,
    headers: opts.headers,
    body: opts.body,
  });
};
