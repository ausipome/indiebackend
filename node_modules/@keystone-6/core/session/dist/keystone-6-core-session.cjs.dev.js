'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectWithoutProperties = require('@babel/runtime/helpers/objectWithoutProperties');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var cookie = require('cookie');
var Iron = require('@hapi/iron');
var uidSafe = require('uid-safe');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var cookie__namespace = /*#__PURE__*/_interopNamespace(cookie);
var Iron__default = /*#__PURE__*/_interopDefault(Iron);

const _excluded = ["store", "maxAge"];
function generateSessionId() {
  return uidSafe.sync(24);
}
const TOKEN_NAME = 'keystonejs-session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

// should we also accept httpOnly?

function statelessSessions(_ref) {
  let {
    secret,
    maxAge = MAX_AGE,
    path = '/',
    secure = process.env.NODE_ENV === 'production',
    ironOptions = Iron__default["default"].defaults,
    domain,
    sameSite = 'lax'
  } = _ref;
  if (!secret) {
    throw new Error('You must specify a session secret to use sessions');
  }
  if (secret.length < 32) {
    throw new Error('The session secret must be at least 32 characters long');
  }
  return {
    async get(_ref2) {
      var _context$req$headers$;
      let {
        context
      } = _ref2;
      if (!(context !== null && context !== void 0 && context.req)) {
        return;
      }
      const cookies = cookie__namespace.parse(context.req.headers.cookie || '');
      const bearer = (_context$req$headers$ = context.req.headers.authorization) === null || _context$req$headers$ === void 0 ? void 0 : _context$req$headers$.replace('Bearer ', '');
      const token = bearer || cookies[TOKEN_NAME];
      if (!token) return;
      try {
        return await Iron__default["default"].unseal(token, secret, ironOptions);
      } catch (err) {}
    },
    async end(_ref3) {
      let {
        context
      } = _ref3;
      if (!(context !== null && context !== void 0 && context.res)) return;
      context.res.setHeader('Set-Cookie', cookie__namespace.serialize(TOKEN_NAME, '', {
        maxAge: 0,
        expires: new Date(),
        httpOnly: true,
        secure,
        path,
        sameSite,
        domain
      }));
    },
    async start(_ref4) {
      let {
        context,
        data
      } = _ref4;
      if (!(context !== null && context !== void 0 && context.res)) return;
      const sealedData = await Iron__default["default"].seal(data, secret, _objectSpread(_objectSpread({}, ironOptions), {}, {
        ttl: maxAge * 1000
      }));
      context.res.setHeader('Set-Cookie', cookie__namespace.serialize(TOKEN_NAME, sealedData, {
        maxAge,
        expires: new Date(Date.now() + maxAge * 1000),
        httpOnly: true,
        secure,
        path,
        sameSite,
        domain
      }));
      return sealedData;
    }
  };
}
function storedSessions(_ref5) {
  let {
      store: storeOption,
      maxAge = MAX_AGE
    } = _ref5,
    statelessSessionsOptions = _objectWithoutProperties(_ref5, _excluded);
  let {
    get,
    start,
    end
  } = statelessSessions(_objectSpread(_objectSpread({}, statelessSessionsOptions), {}, {
    maxAge
  }));
  let store = storeOption({
    maxAge
  });
  return {
    async get(_ref6) {
      let {
        context
      } = _ref6;
      const data = await get({
        context
      });
      const sessionId = data === null || data === void 0 ? void 0 : data.sessionId;
      if (typeof sessionId === 'string') {
        return store.get(sessionId);
      }
    },
    async start(_ref7) {
      let {
        data,
        context
      } = _ref7;
      let sessionId = generateSessionId();
      await store.set(sessionId, data);
      return (start === null || start === void 0 ? void 0 : start({
        data: {
          sessionId
        },
        context
      })) || '';
    },
    async end(_ref8) {
      let {
        context
      } = _ref8;
      const data = await get({
        context
      });
      const sessionId = data === null || data === void 0 ? void 0 : data.sessionId;
      if (typeof sessionId === 'string') {
        await store.delete(sessionId);
      }
      await (end === null || end === void 0 ? void 0 : end({
        context
      }));
    }
  };
}

exports.statelessSessions = statelessSessions;
exports.storedSessions = storedSessions;
