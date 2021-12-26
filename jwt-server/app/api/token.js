const Router = require('@koa/router')
const { generateToken } = require('../../core/util')
const users = require('../data/users')
const { Auth } = require('../../middlewares/auth') 

const tokenRouter = new Router({
  // 设置路由前缀 /token
  prefix: '/token'
})

tokenRouter.post('/', async ctx => {
  const { username, password } = ctx.request.body

  const token = verifyUsernamePassword(username, parseInt(password))

  if (!token) {
    ctx.body = {
      errCode: 10001,
      msg: '账号名或密码不正确',
      request: `${ctx.method} ${ctx.path}`
    }

    return
  }

  ctx.body = {
    token
  }
})

tokenRouter.post('/verify', async (ctx, next) => {
  const token = ctx.request.body.token
  const isValid = await Auth.verifyToken(token)

  ctx.body = {
    isValid
  }
})

tokenRouter.get('/test', async ctx => {
  ctx.body = 'test'
})

function verifyUsernamePassword(username, password) {
  const index = users.findIndex(user => {
    return user.username === username && user.password === password
  })

  const user = users[index]
  if (!user) {
    return
  }
  
  const token = generateToken(user.id, Auth.USER)
  return token
}

module.exports = tokenRouter