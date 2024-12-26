export const makeRequest = function makeRequest(endpoint, options = {}) {
  const opts = {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
    params: options.params || [],
    query: options.query || {},
    body: options.body ? JSON.stringify(options.body) : null,
  };
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
