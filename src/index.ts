import { createServer, Plugin } from 'vite'
import { promises as fs } from 'fs'
import path from 'path'

const indexTemplate = fs.readFile(path.join(__dirname, '../theme/index.html'))

const CodePressPlugin: Plugin = ({ root, app }) => {
  app.use(async (ctx, next) => {
    if (ctx.path === '/index.html') {
      ctx.body = await indexTemplate
      return
    }
    return next()
  })
  app.use(async (ctx, next) => {})
}

createServer({
  plugins: [CodePressPlugin]
}).listen(3000, () => {
  console.log('listening on http://localhost:3000')
})
