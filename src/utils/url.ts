import { Moment } from 'moment';
/** Type to represent the value of a single query variable. */
export type UrlQueryValue = string | number | boolean | string[] | number[] | boolean[] | undefined | null;

/** Type to represent the values parsed from the query string. */
export type UrlQueryMap = Record<string, UrlQueryValue>;

export function renderUrl(path: string, query: UrlQueryMap | undefined): string {
  if (query && Object.keys(query).length > 0) {
    path += `?${toUrlParams(query)}`;
  }
  return path;
}

function toUrlParams(a: any) {
  const s: any[] = [];
  const rbracket = /\[\]$/;

  const isArray = (obj: any) => Object.prototype.toString.call(obj) === '[object Array]';

  const add = (k: string, v: any) => {
    v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
    if (typeof v !== 'boolean') {
      s[s.length] = `${tryEncodeURIComponentAsAngularJS(k, true)}=${tryEncodeURIComponentAsAngularJS(v, true)}`;
    } else {
      const valueQueryPart = v ? '=true' : `=${tryEncodeURIComponentAsAngularJS('false', true)}`;
      s[s.length] = tryEncodeURIComponentAsAngularJS(k, true) + valueQueryPart;
    }
  };

  const buildParams = (prefix: string, obj: any) => {
    let i;
    let len;
    let key;

    if (prefix) {
      if (isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
          if (rbracket.test(prefix)) {
            add(prefix, obj[i]);
          } else {
            buildParams(prefix, obj[i]);
          }
        }
      } else if (obj && String(obj) === '[object Object]') {
        for (key in obj) {
          buildParams(`${prefix}[${key}]`, obj[key]);
        }
      } else {
        add(prefix, obj);
      }
    } else if (isArray(obj)) {
      for (i = 0, len = obj.length; i < len; i++) {
        add(obj[i].name, obj[i].value);
      }
    } else {
      for (key in obj) {
        buildParams(key, obj[key]);
      }
    }
    return s;
  };

  return buildParams('', a).join('&');
}

function tryEncodeURIComponentAsAngularJS(val: string, pctEncodeSpaces?: boolean) {
  return tryEncodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
}
export function tryEncodeURIComponent(value: string): string | undefined {
  try {
    // eslint-disable-next-line no-restricted-syntax
    return encodeURIComponent(value);
  } catch (e) {
    return '';
  }
}
export function tryDecodeURIComponent(value: string): string | undefined {
  try {
    // eslint-disable-next-line no-restricted-syntax
    return decodeURIComponent(value);
  } catch (e) {
    return '';
  }
}

/** //en.wikipedia.org/wiki/ISO_8601#Time_intervals */
export const TIME_INTERVAL_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';
export type TimeRange = [Moment, Moment];
export type TimeOption = [string, string] | TimeRange;

export function getTimeOptionId(timeOption: TimeOption): string {
  if (!timeOption) {
    return;
  }
  const [from, to] = timeOption;
  if (typeof from === 'string' || typeof to === 'string') {
    return `${from},${to}`;
  }
  return `${from?.format(TIME_INTERVAL_FORMAT)},${to?.format(TIME_INTERVAL_FORMAT)}`;
}

/** Parses a location search string to an object */
export function locationSearchToObject<Q = UrlQueryMap>(search: string | number): Q {
  const queryString = typeof search === 'number' ? String(search) : search;

  if (queryString.length > 0) {
    if (queryString.startsWith('?')) {
      return parseKeyValue(queryString.substring(1));
    }
    return parseKeyValue(queryString);
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {} as Q;
}

/**
 * Parses an escaped url query string into key-value pairs.
 * Attribution: Code dervived from https://github.com/angular/angular.js/master/src/Angular.js#L1396
 * @returns {Object.<string,boolean|Array>}
 */
export function parseKeyValue(keyValue: string) {
  const obj: any = {};
  const parts = (keyValue || '').split('&');

  for (let keyValue of parts) {
    let splitPoint: number | undefined;
    let key: string | undefined;
    let val: string | undefined | boolean;

    if (keyValue) {
      keyValue = keyValue.replace(/\+/g, '%20');
      key = keyValue;
      splitPoint = keyValue.indexOf('=');

      if (splitPoint !== -1) {
        key = keyValue.substring(0, splitPoint);
        val = keyValue.substring(splitPoint + 1);
      }

      key = tryDecodeURIComponent(key);

      if (key) {
        val = val !== undefined ? tryDecodeURIComponent(val as string) : true;

        let parsedVal: any;
        if (typeof val === 'string' && val !== '') {
          parsedVal = val === 'true' || val === 'false' ? val === 'true' : val;
        } else {
          parsedVal = val;
        }

        if (!hasOwnProperty(obj, key)) {
          obj[key] = isNaN(parsedVal) ? val : parsedVal;
        } else if (Array.isArray(obj[key])) {
          obj[key].push(val);
        } else {
          obj[key] = [obj[key], isNaN(parsedVal) ? val : parsedVal];
        }
      }
    }
  }

  return obj;
}
export const hasOwnProperty = (() => {
  const has = Object.prototype.hasOwnProperty;
  return <T extends Object, K extends keyof T>(t: T, k: K) => !!has.call(t, k);
})();
