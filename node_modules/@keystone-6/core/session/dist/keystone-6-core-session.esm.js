import _objectWithoutProperties from '@babel/runtime/helpers/esm/objectWithoutProperties';
import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import * as cookie from 'cookie';
import Iron from '@hapi/iron';
import { sync } from 'uid-safe';

const _excluded = ["store", "maxAge"];
function generateSessionId() {
  return sync(24);
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
    ironOptions = Iron.defaults,
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
      const cookies = cookie.parse(context.req.headers.cookie || '');
      const bearer = (_context$req$headers$ = context.req.headers.authorization) === null || _context$req$headers$ === void 0 ? void 0 : _context$req$headers$.replace('Bearer ', '');
      const token = bearer || cookies[TOKEN_NAME];
      if (!token) return;
      try {
        return await Iron.unseal(token, secret, ironOptions);
      } catch (err) {}
    },
    async end(_ref3) {
      let {
        context
      } = _ref3;
      if (!(context !== null && context !== void 0 && context.res)) return;
      context.res.setHeader('Set-Cookie', cookie.serialize(TOKEN_NAME, '', {
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
      const sealedData = await Iron.seal(data, secret, _objectSpread(_objectSpread({}, ironOptions), {}, {
        ttl: maxAge * 1000
      }));
      context.res.setHeader('Set-Cookie', cookie.serialize(TOKEN_NAME, sealedData, {
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

export { statelessSessions, storedSessions };
