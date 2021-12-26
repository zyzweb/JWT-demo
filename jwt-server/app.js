const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const tokenRouter = require('./app/api/token')
const contentRouter = require('./app/api/content')

const app = new Koa()

// 解析 ctx.request.body 的数据
app.use(bodyParser())
// 注册 token 相关路由
app.use(tokenRouter.routes())
// 注册 文章内容 相关路由
app.use(contentRouter.routes())

app.listen(5000)