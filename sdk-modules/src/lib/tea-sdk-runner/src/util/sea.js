/* eslint-disable no-multi-assign,@typescript-eslint/no-this-alias,@typescript-eslint/no-unused-vars */
/**
 * Sea.js 2.2.2 | seajs.org/LICENSE.md
 */
export default function seajs(global, undefined) {
  // Avoid conflicting when `sea.js` is loaded multiple times
  if (global.seajs) {
    return;
  }

  // 通过 XHR 重新加载资源
  // type - css/js
  // url - 资源地址
  // callback - 回调
  function retryViaXhr(type, url, callback) {
    let start;
    const URL = window.URL || window.webkitURL;
    const xhr = new XMLHttpRequest();
    let bytes;
    let rtt;
    let cost;
    let speed;
    let server;
    let logid;
    const notify = function (errorMessage) {
      callback({
        type,
        url,
        success: !errorMessage,
        error: errorMessage,
        status: +xhr.status,
        rurl: xhr.responseURL,
        bytes,
        rtt,
        cost,
        speed,
        server,
        logid,
      });
    };
    xhr.onerror = xhr.onload = function (evt) {
      if (+xhr.status !== 200) {
        return notify(`ERR_${xhr.status}`);
      }
      const memoryUrl = URL.createObjectURL(
        new Blob([xhr.responseText], {
          type: type === 'js' ? 'text/javascript' : 'text/css',
        }),
      );
      if (type === 'js') {
        let script = document.createElement('script');
        script.onload = script.onerror = function (evt) {
          try {
            document.body.removeChild(script);
            script.onload = script.onerror = null;
            script = null;
            URL.revokeObjectURL(memoryUrl);
          } catch (err) {}
          if (evt.type === 'load') {
            notify(null);
          } else {
            notify(`Cannot load ${memoryUrl} (source ${url})`);
          }
        };
        script.src = memoryUrl;
        document.body.appendChild(script);
      } else if (type === 'css') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = memoryUrl;
        link.setAttribute('data-origin-href', url);
        document.head.appendChild(link);
        setTimeout(() => {
          notify(null);
          URL.revokeObjectURL(memoryUrl);
        }, 10);
      } else {
        URL.revokeObjectURL(memoryUrl);
      }
    };
    xhr.onreadystatechange = function () {
      switch (xhr.readyState) {
        case 1: {
          start = +new Date();
          break;
        }
        case 2: {
          rtt = +new Date() - start;
          break;
        }
        case 4: {
          rtt = rtt || 0;
          cost = Math.max(1, +new Date() - start - rtt);
          if (/img\.qcloud\.com|imgcache\.qq\.com/.test(xhr.responseURL || url)) {
            bytes = +xhr.getResponseHeader('content-length');
            server = xhr.getResponseHeader('server_ip');
            logid = xhr.getResponseHeader('x-nws-log-uuid');
          }
          if (bytes > 0) {
            // 单位为 bytes/s
            speed = cost > 0 ? Math.round((bytes / cost) * 1000) : 0;
          }
          break;
        }
      }
    };
    const addSeed = function (url) {
      const joiner = url.indexOf('?') > -1 ? '&' : '?';
      return [url, `r=${Math.random()}`].join(joiner);
    };
    xhr.open('GET', addSeed(url), true);
    xhr.send(null);
  }

  const seajs = (global.seajs = {
    // The current version of Sea.js being used
    version: '2.2.2',
  });

  const data = (seajs.data = {});

  /**
   * util-lang.js - The minimal language enhancement
   */

  function isType(type) {
    return function (obj) {
      return {}.toString.call(obj) == `[object ${type}]`;
    };
  }

  const isObject = isType('Object');
  const isString = isType('String');
  const isArray = Array.isArray || isType('Array');
  const isFunction = isType('Function');

  let _cid = 0;
  function cid() {
    return (_cid += 1);
  }

  /**
   * util-events.js - The minimal events support
   */

  let events = (data.events = {});

  // Bind event
  seajs.on = function (name, callback) {
    const list = events[name] || (events[name] = []);
    list.push(callback);
    return seajs;
  };

  // Remove event. If `callback` is undefined, remove all callbacks for the
  // event. If `event` and `callback` are both undefined, remove all callbacks
  // for all events
  seajs.off = function (name, callback) {
    // Remove *all* events
    if (!(name || callback)) {
      events = data.events = {};
      return seajs;
    }

    const list = events[name];
    if (list) {
      if (callback) {
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i] === callback) {
            list.splice(i, 1);
          }
        }
      } else {
        delete events[name];
      }
    }

    return seajs;
  };

  // Emit event, firing all bound callbacks. Callbacks receive the same
  // arguments as `emit` does, apart from the event name
  const emit = (seajs.emit = function (name, data) {
    let list = events[name];
    let fn;

    if (list) {
      // Copy callback lists to prevent modification
      list = list.slice();

      // Execute event callbacks
      while ((fn = list.shift())) {
        fn(data);
      }
    }

    return seajs;
  });

  /**
   * util-path.js - The utilities for operating path such as id, uri
   */

  const DIRNAME_RE = /[^?#]*\//;

  const DOT_RE = /\/\.\//g;
  const DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;
  const DOUBLE_SLASH_RE = /([^:/])\/\//g;

  // Extract the directory portion of a path
  // dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
  // ref: http://jsperf.com/regex-vs-split/2
  function dirname(path) {
    return path.match(DIRNAME_RE)[0];
  }

  // Canonicalize a path
  // realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
  function realpath(path) {
    // /a/b/./c/./d ==> /a/b/c/d
    path = path.replace(DOT_RE, '/');

    // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
    while (path.match(DOUBLE_DOT_RE)) {
      path = path.replace(DOUBLE_DOT_RE, '/');
    }

    // a//b/c  ==>  a/b/c
    path = path.replace(DOUBLE_SLASH_RE, '$1/');

    return path;
  }

  // Normalize an id
  // normalize("path/to/a") ==> "path/to/a.js"
  // NOTICE: substring is faster than negative slice and RegExp
  function normalize(path) {
    const last = path.length - 1;
    const lastC = path.charAt(last);

    // If the uri ends with `#`, just return it without '#'
    if (lastC === '#') {
      return path.substring(0, last);
    }

    return path.substring(last - 2) === '.js' ||
      path.indexOf('?') > 0 ||
      path.substring(last - 3) === '.css' ||
      lastC === '/'
      ? path
      : `${path}.js`;
  }

  const PATHS_RE = /^([^/:]+)(\/.+)$/;
  const VARS_RE = /{([^{]+)}/g;

  function parseAlias(id) {
    const { alias } = data;
    return alias && isString(alias[id]) ? alias[id] : id;
  }

  function parsePaths(id) {
    const { paths } = data;
    let m;

    if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
      id = paths[m[1]] + m[2];
    }

    return id;
  }

  function parseVars(id) {
    const { vars } = data;

    if (vars && id.indexOf('{') > -1) {
      id = id.replace(VARS_RE, (m, key) => (isString(vars[key]) ? vars[key] : m));
    }

    return id;
  }

  function parseMap(uri) {
    const { map } = data;
    let ret = uri;

    if (map) {
      for (let i = 0, len = map.length; i < len; i++) {
        const rule = map[i];

        ret = isFunction(rule) ? rule(uri) || uri : uri.replace(rule[0], rule[1]);

        // Only apply the first matched rule
        if (ret !== uri) break;
      }
    }

    return ret;
  }

  const ABSOLUTE_RE = /^\/\/.|:\//;
  const ROOT_DIR_RE = /^.*?\/\/.*?\//;

  function addBase(id, refUri) {
    let ret;
    const first = id.charAt(0);

    // Absolute
    if (ABSOLUTE_RE.test(id)) {
      ret = id;
    }
    // Relative
    else if (first === '.') {
      ret = realpath((refUri ? dirname(refUri) : data.cwd) + id);
    }
    // Root
    else if (first === '/') {
      const m = data.cwd.match(ROOT_DIR_RE);
      ret = m ? m[0] + id.substring(1) : id;
    }
    // Top-level
    else {
      ret = data.base + id;
    }

    // Add default protocol when uri begins with "//"
    if (ret.indexOf('//') === 0) {
      ret = location.protocol + ret;
    }

    return ret;
  }

  function id2Uri(id, refUri) {
    if (!id) return '';

    id = parseAlias(id);
    id = parsePaths(id);
    id = parseVars(id);
    id = normalize(id);

    let uri = addBase(id, refUri);
    uri = parseMap(uri);

    return uri;
  }

  const doc = document;
  const cwd = dirname(doc.URL);
  const { scripts } = doc;

  // Recommend to add `seajsnode` id for the `sea.js` script element
  const loaderScript = doc.getElementById('seajsnode') || scripts[scripts.length - 1];

  // When `sea.js` is inline, set loaderDir to current working directory
  const loaderDir = dirname(getScriptAbsoluteSrc(loaderScript) || cwd);

  function getScriptAbsoluteSrc(node) {
    return node.hasAttribute // non-IE6/7
      ? node.src
      : // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
        node.getAttribute('src', 4);
  }

  // For Developers
  seajs.resolve = id2Uri;

  /**
   * util-request.js - The utilities for requesting script and style files
   * ref: tests/research/load-js-css/test.html
   */

  const head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
  const baseElement = head.getElementsByTagName('base')[0];

  const IS_CSS_RE = /\.css(?:\?|$)/i;
  let currentlyAddingScript;
  let interactiveScript;

  // `onload` event is not supported in WebKit < 535.23 and Firefox < 9.0
  // ref:
  //  - https://bugs.webkit.org/show_activity.cgi?id=38995
  //  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
  //  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
  const isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/, '$1') < 536;

  function request(url, callback, charset, crossorigin, time) {
    const isCSS = IS_CSS_RE.test(url);
    const node = doc.createElement(isCSS ? 'link' : 'script');

    if (charset) {
      const cs = isFunction(charset) ? charset(url) : charset;
      if (cs) {
        node.charset = cs;
      }
    }

    // crossorigin default value is `false`.
    const cors = isFunction(crossorigin) ? crossorigin(url) : crossorigin;
    if (cors !== false) {
      node.crossorigin = cors;
    }

    addOnload(node, callback, isCSS, url, time);

    if (isCSS) {
      node.rel = 'stylesheet';
      node.href = url;
    } else {
      node.async = true;
      node.src = url;
    }

    // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
    // the end of the insert execution, so use `currentlyAddingScript` to
    // hold current node, for deriving url in `define` call
    currentlyAddingScript = node;

    // ref: #185 & http://dev.jquery.com/ticket/2709
    baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);

    currentlyAddingScript = null;
  }

  function addOnload(node, callback, isCSS, url, time) {
    time = time || 0;

    const resourceLoadTimeoutId = setTimeout(() => {
      seajs.emit('resource-slow', {
        type: isCSS ? 'css' : 'js',
        url: isCSS ? node.href : node.src,
        retry: time,
        second: 10,
      });
    }, 10000);
    const supportOnload = 'onload' in node;

    // for Old WebKit and Old Firefox
    if (isCSS && (isOldWebKit || !supportOnload)) {
      setTimeout(() => {
        pollCss(node, callback);
      }, 1); // Begin after node insertion
      return;
    }

    if (supportOnload) {
      node.onload = onload;
      node.onerror = function (e) {
        emit('error', { uri: url, node });
        onload(e);
      };
    } else {
      node.onreadystatechange = function (e) {
        if (/loaded|complete/.test(node.readyState)) {
          onload(e);
        }
      };
    }

    function onload(e) {
      let url = isCSS ? node.href : node.src;
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      const eventType = e && e.type;
      clearTimeout(resourceLoadTimeoutId);

      if (eventType === 'error') {
        const clean = function () {
          node.onload = node.onerror = node.onreadystatechange = null;
          try {
            head.removeChild(a);
          } catch (err) {}
          node = null;
        };
        const { charset } = node;
        // 第 1 次：传统重试，附带跨域属性
        // 第 2 次：传统重试，移除跨域属性
        // 第 3 次：备用域名重试，移除跨域属性
        if (time <= 2) {
          time += 1;
          setTimeout(() => {
            if (time === 3) {
              try {
                url = url.replace(window.QCCDN_HOST, window.QCCDN_BACKUP_HOST);
              } catch (err) {}
            }
            request(url, callback, charset, url, time);
          }, 500);
          console.warn('Retrying %d (classic): %s', time, url);
          clean();
          return;
        }
        // 第 4 次：XHR 重试，用原域名重试
        if (time === 3) {
          time += 1;
          setTimeout(() => {
            try {
              url = url.replace(window.QCCDN_BACKUP_HOST, window.QCCDN_HOST);
            } catch (err) {}
            retryViaXhr(isCSS ? 'css' : 'js', url, (result) => {
              result.retry = time;
              seajs.emit(result.success ? 'resource-load' : 'resource-error', result);
              callback();
            });
          }, 1000);
          console.warn('Retrying %d (xhr): %s', time, url);
          clean();
          return;
        }
      }
      if (eventType) {
        seajs.emit(`resource-${eventType}`, {
          type: isCSS ? 'css' : 'js',
          url,
          retry: time,
        });
      }

      if (/^(?:loaded|complete|undefined)$/.test(node.readyState)) {
        // Ensure only run once and handle memory leak in IE
        node.onload = node.onerror = node.onreadystatechange = null;

        // Remove the script to reduce memory leak
        if (!isCSS && !data.debug) {
          head.removeChild(node);
        }

        // Dereference the node
        node = null;

        callback();
      }
    }

    /* function onload() {
      // Ensure only run once and handle memory leak in IE
      node.onload =
        node.onerror =
        node.onreadystatechange = null;


      // Remove the script to reduce memory leak
      if (!isCSS && !data.debug) {
       head.removeChild(node);
      }

      // Dereference the node
      // node = null;

      callback();
    } */
  }

  function pollCss(node, callback) {
    const { sheet } = node;
    let isLoaded;

    // for WebKit < 536
    if (isOldWebKit) {
      if (sheet) {
        isLoaded = true;
      }
    }
    // for Firefox < 9.0
    else if (sheet) {
      try {
        if (sheet.cssRules) {
          isLoaded = true;
        }
      } catch (ex) {
        // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
        // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
        // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
        if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
          isLoaded = true;
        }
      }
    }

    setTimeout(() => {
      if (isLoaded) {
        // Place callback here to give time for style rendering
        callback();
      } else {
        pollCss(node, callback);
      }
    }, 20);
  }

  function getCurrentScript() {
    if (currentlyAddingScript) {
      return currentlyAddingScript;
    }

    // For IE6-9 browsers, the script onload event may not fire right
    // after the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script
    // ref: http://goo.gl/JHfFW
    if (interactiveScript && interactiveScript.readyState === 'interactive') {
      return interactiveScript;
    }

    const scripts = head.getElementsByTagName('script');

    for (let i = scripts.length - 1; i >= 0; i--) {
      const script = scripts[i];
      if (script.readyState === 'interactive') {
        interactiveScript = script;
        return interactiveScript;
      }
    }
  }

  // For Developers
  seajs.request = request;

  /**
   * util-deps.js - The parser for dependencies
   * ref: tests/research/parse-dependencies/test.html
   */

  const REQUIRE_RE =
    /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;
  const SLASH_RE = /\\\\/g;

  function parseDependencies(code) {
    const ret = [];

    code.replace(SLASH_RE, '').replace(REQUIRE_RE, (m, m1, m2) => {
      if (m2) {
        ret.push(m2);
      }
    });

    return ret;
  }

  /**
   * module.js - The core of module loader
   */

  const cachedMods = (seajs.cache = {});
  let anonymousMeta;

  const fetchingList = {};
  const fetchedList = {};
  const callbackList = {};

  const STATUS = (Module.STATUS = {
    // 1 - The `module.uri` is being fetched
    FETCHING: 1,
    // 2 - The meta data has been saved to cachedMods
    SAVED: 2,
    // 3 - The `module.dependencies` are being loaded
    LOADING: 3,
    // 4 - The module are ready to execute
    LOADED: 4,
    // 5 - The module is being executed
    EXECUTING: 5,
    // 6 - The `module.exports` is available
    EXECUTED: 6,
  });

  function Module(uri, deps) {
    this.uri = uri;
    this.dependencies = deps || [];
    this.exports = null;
    this.status = 0;

    // Who depends on me
    this._waitings = {};

    // The number of unloaded dependencies
    this._remain = 0;
  }

  // Resolve module.dependencies
  Module.prototype.resolve = function () {
    const mod = this;
    const ids = mod.dependencies;
    const uris = [];

    for (let i = 0, len = ids.length; i < len; i++) {
      uris[i] = Module.resolve(ids[i], mod.uri);
    }
    return uris;
  };

  // Load module.dependencies and fire onload when all done
  Module.prototype.load = function () {
    const mod = this;

    // If the module is being loaded, just wait it onload call
    if (mod.status >= STATUS.LOADING) {
      return;
    }

    mod.status = STATUS.LOADING;

    // Emit `load` event for plugins such as combo plugin
    const uris = mod.resolve();
    emit('load', uris);

    const len = (mod._remain = uris.length);
    let m;

    // Initialize modules and register waitings
    for (let i = 0; i < len; i++) {
      m = Module.get(uris[i]);

      if (m.status < STATUS.LOADED) {
        // Maybe duplicate: When module has dupliate dependency, it should be it's count, not 1
        m._waitings[mod.uri] = (m._waitings[mod.uri] || 0) + 1;
      } else {
        mod._remain -= 1;
      }
    }

    if (mod._remain === 0) {
      mod.onload();
      return;
    }

    // Begin parallel loading
    const requestCache = {};

    for (let i = 0; i < len; i++) {
      m = cachedMods[uris[i]];

      if (m.status < STATUS.FETCHING) {
        m.fetch(requestCache);
      } else if (m.status === STATUS.SAVED) {
        m.load();
      }
    }

    // Send all requests at last to avoid cache bug in IE6-9. Issues#808
    for (const requestUri in requestCache) {
      if (Object.prototype.hasOwnProperty.call(requestCache, requestUri)) {
        requestCache[requestUri]();
      }
    }
  };

  // Call this method when module is loaded
  Module.prototype.onload = function () {
    const mod = this;
    mod.status = STATUS.LOADED;

    if (mod.callback) {
      mod.callback();
    }

    // Notify waiting modules to fire onload
    const waitings = mod._waitings;
    let uri;
    let m;

    for (uri in waitings) {
      if (Object.prototype.hasOwnProperty.call(waitings, uri)) {
        m = cachedMods[uri];
        m._remain -= waitings[uri];
        if (m._remain === 0) {
          m.onload();
        }
      }
    }

    // Reduce memory taken
    delete mod._waitings;
    delete mod._remain;
  };

  // Fetch a module
  Module.prototype.fetch = function (requestCache) {
    const mod = this;
    const { uri } = mod;

    mod.status = STATUS.FETCHING;

    // Emit `fetch` event for plugins such as combo plugin
    let emitData = { uri };
    emit('fetch', emitData);
    const requestUri = emitData.requestUri || uri;

    // Empty uri or a non-CMD module
    if (!requestUri || fetchedList[requestUri]) {
      mod.load();
      return;
    }

    if (fetchingList[requestUri]) {
      callbackList[requestUri].push(mod);
      return;
    }

    fetchingList[requestUri] = true;
    callbackList[requestUri] = [mod];

    // Emit `request` event for plugins such as text plugin
    emit(
      'request',
      (emitData = {
        uri,
        requestUri,
        onRequest,
        charset: isFunction(data.charset) ? data.charset(requestUri) : data.charset,
        crossorigin: isFunction(data.crossorigin) ? data.crossorigin(requestUri) : data.crossorigin,
      }),
    );

    if (!emitData.requested) {
      requestCache ? (requestCache[emitData.requestUri] = sendRequest) : sendRequest();
    }

    function sendRequest() {
      seajs.request(emitData.requestUri, emitData.onRequest, emitData.charset, emitData.crossorigin);
    }

    function onRequest() {
      delete fetchingList[requestUri];
      fetchedList[requestUri] = true;

      // Save meta data of anonymous module
      if (anonymousMeta) {
        Module.save(uri, anonymousMeta);
        anonymousMeta = null;
      }

      // Call callbacks
      let m;
      const mods = callbackList[requestUri];
      delete callbackList[requestUri];
      while ((m = mods.shift())) m.load();
    }
  };

  // Execute a module
  Module.prototype.exec = function () {
    const mod = this;

    // When module is executed, DO NOT execute it again. When module
    // is being executed, just return `module.exports` too, for avoiding
    // circularly calling
    if (mod.status >= STATUS.EXECUTING) {
      return mod.exports;
    }

    mod.status = STATUS.EXECUTING;

    // Create require
    const { uri } = mod;

    function require(id) {
      return Module.get(require.resolve(id)).exec();
    }

    require.resolve = function (id) {
      return Module.resolve(id, uri);
    };

    require.async = function (ids, callback) {
      Module.use(ids, callback, `${uri}_async_${cid()}`);
      return require;
    };

    // Exec factory
    const { factory } = mod;

    let exports = isFunction(factory) ? factory(require, (mod.exports = {}), mod) : factory;

    if (exports === undefined) {
      exports = mod.exports;
    }

    // Reduce memory leak
    delete mod.factory;

    mod.exports = exports;
    mod.status = STATUS.EXECUTED;

    // Emit `exec` event
    emit('exec', mod);

    return exports;
  };

  // Resolve id to uri
  Module.resolve = function (id, refUri) {
    // Emit `resolve` event for plugins such as text plugin
    const emitData = { id, refUri };
    emit('resolve', emitData);

    return emitData.uri || seajs.resolve(emitData.id, refUri);
  };

  // Define a module
  Module.define = function (id, deps, factory) {
    const argsLen = arguments.length;

    // define(factory)
    if (argsLen === 1) {
      factory = id;
      id = undefined;
    } else if (argsLen === 2) {
      factory = deps;

      // define(deps, factory)
      if (isArray(id)) {
        deps = id;
        id = undefined;
      }
      // define(id, factory)
      else {
        deps = undefined;
      }
    }

    // Parse dependencies according to the module factory code
    if (!isArray(deps) && isFunction(factory)) {
      deps = parseDependencies(factory.toString());
    }

    const meta = {
      id,
      uri: Module.resolve(id),
      deps,
      factory,
    };

    // Try to derive uri in IE6-9 for anonymous modules
    if (!meta.uri && doc.attachEvent) {
      const script = getCurrentScript();

      if (script) {
        meta.uri = script.src;
      }

      // NOTE: If the id-deriving methods above is failed, then falls back
      // to use onload event to get the uri
    }

    // Emit `define` event, used in nocache plugin, seajs node version etc
    emit('define', meta);

    meta.uri
      ? Module.save(meta.uri, meta)
      : // Save information for "saving" work in the script onload event
        (anonymousMeta = meta);
  };

  // Save meta data to cachedMods
  Module.save = function (uri, meta) {
    const mod = Module.get(uri);

    // Do NOT override already saved modules
    if (mod.status < STATUS.SAVED) {
      mod.id = meta.id || uri;
      mod.dependencies = meta.deps || [];
      mod.factory = meta.factory;
      mod.status = STATUS.SAVED;
    }
  };

  // Get an existed module or create a new one
  Module.get = function (uri, deps) {
    return cachedMods[uri] || (cachedMods[uri] = new Module(uri, deps));
  };

  // Use function is equal to load a anonymous module
  Module.use = function (ids, callback, uri) {
    const mod = Module.get(uri, isArray(ids) ? ids : [ids]);

    mod.callback = function () {
      const exports = [];
      const uris = mod.resolve();

      for (let i = 0, len = uris.length; i < len; i++) {
        exports[i] = cachedMods[uris[i]].exec();
      }

      if (callback) {
        callback.apply(global, exports);
      }

      delete mod.callback;
    };

    mod.load();
  };

  // Load preload modules before all other modules
  Module.preload = function (callback) {
    const preloadMods = data.preload;
    const len = preloadMods.length;

    if (len) {
      Module.use(
        preloadMods,
        () => {
          // Remove the loaded preload modules
          preloadMods.splice(0, len);

          // Allow preload modules to add new preload modules
          Module.preload(callback);
        },
        `${data.cwd}_preload_${cid()}`,
      );
    } else {
      callback();
    }
  };

  // Public API

  seajs.use = function (ids, callback) {
    Module.preload(() => {
      Module.use(ids, callback, `${data.cwd}_use_${cid()}`);
    });
    return seajs;
  };

  Module.define.cmd = {};
  global.define = Module.define;

  // For Developers

  seajs.Module = Module;
  data.fetchedList = fetchedList;
  data.cid = cid;

  seajs.require = function (id) {
    const mod = Module.get(Module.resolve(id));
    if (mod.status < STATUS.EXECUTING) {
      mod.onload();
      mod.exec();
    }
    return mod.exports;
  };

  /**
   * config.js - The configuration for the loader
   */

  const BASE_RE = /^(.+?\/)(\?\?)?(seajs\/)+/;

  // The root path to use for id2uri parsing
  // If loaderUri is `http://test.com/libs/seajs/[??][seajs/1.2.3/]sea.js`, the
  // baseUri should be `http://test.com/libs/`
  data.base = (loaderDir.match(BASE_RE) || ['', loaderDir])[1];

  // The loader directory
  data.dir = loaderDir;

  // The current working directory
  data.cwd = cwd;

  // The charset for requesting files
  data.charset = 'utf-8';

  // The CORS options, Do't set CORS on default.
  data.crossorigin = false;

  // Modules that are needed to load before all other modules
  data.preload = (function () {
    const plugins = [];

    // Convert `seajs-xxx` to `seajs-xxx=1`
    // NOTE: use `seajs-xxx=1` flag in uri or cookie to preload `seajs-xxx`
    let str = location.search.replace(/(seajs-\w+)(&|$)/g, '$1=1$2');

    // Add cookie string
    str += ` ${doc.cookie}`;

    // Exclude seajs-xxx=0
    str.replace(/(seajs-\w+)=1/g, (m, name) => {
      plugins.push(name);
    });

    return plugins;
  })();

  // data.alias - An object containing shorthands of module id
  // data.paths - An object containing path shorthands in module id
  // data.vars - The {xxx} variables in module id
  // data.map - An array containing rules to map module uri
  // data.debug - Debug mode. The default value is false

  seajs.config = function (configData) {
    for (const key in configData) {
      let curr = configData[key];
      const prev = data[key];

      // Merge object config such as alias, vars
      if (prev && isObject(prev)) {
        for (const k in curr) {
          prev[k] = curr[k];
        }
      } else {
        // Concat array config such as map, preload
        if (isArray(prev)) {
          curr = prev.concat(curr);
        }
        // Make sure that `data.base` is an absolute path
        else if (key === 'base') {
          // Make sure end with "/"
          if (curr.slice(-1) !== '/') {
            curr += '/';
          }
          curr = addBase(curr);
        }

        // Set config
        data[key] = curr;
      }
    }

    emit('config', configData);
    return seajs;
  };
}
