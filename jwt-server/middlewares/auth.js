const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { secretKey } = require('../config/config')

class Auth {
  constructor(level) {
    Auth.USER = 2
    Auth.ADMIN = 8
    this.level = level
  } 

  get middleware() {
    return async (ctx, next) => {
      const token = basicAuth(ctx.request)
      let errMsg = 'token不合法'

      if (!token || token.name === 'null') {
        ctx.body = {
          errCode: 10005,
          msg: errMsg,
          request: `${ctx.method} ${ctx.path}`
        }
        return
      }

      try {
        var decoded = jwt.verify(token.name, secretKey)
      } catch(e) {
        if (e.name === 'tokenExpiredError') {
          errMsg = 'token已过期'
        }
        ctx.body = {
          errCode: 10005,
          msg: errMsg,
          request: `${ctx.method} ${ctx.path}`
        }
      }

      if (decoded.scope < this.level) {
        ctx.body = {
          errCode: 10005,
          msg: '权限不足',
          request: `${ctx.method} ${ctx.path}`
        }
        return
      }

      await next()
    }
  }

  static async verifyToken(token) {
    try {
      jwt.verify(token, secretKey)
      return true
    } catch(e) {
      return false
    }
  }
}

module.exports = {
  Auth
}