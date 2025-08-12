window.customWebpackJsonpLoader = function (context) {
  // create error before stack unwound to get useful stacktrace later
  const error = new Error();

  const { chunkId } = context;
  const { jsonpScriptSrc } = context;
  const { installedChunks } = context;

  const url = replaceHost(jsonpScriptSrc(chunkId));
  seajs.seaUse(url, verify);

  // common func to replace domain flexible
  function replaceHost(src) {
    const url = new URL(src);
    if (window.QCCDN_HOST) url.host = window.QCCDN_HOST;
    return url.href;
  }

  function verify() {
    // object to store loaded and loading chunks
    // undefined = chunk not loaded, null = chunk preloaded/prefetched
    // Promise = chunk loading, 0 = chunk loaded
    const chunk = installedChunks[chunkId];
    if (chunk !== 0) {
      // means the chunk make some error
      if (chunk) {
        error.message = `Loading chunk ${chunkId} failed after several retries.\\n(${url})`;
        error.name = 'ChunkLoadError';
        error.request = url;
        chunk[1](error);
        installedChunks[chunkId] = undefined;
      } else {
        installedChunks[chunkId] = undefined;
      }
    }
  }
};
