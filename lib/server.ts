import path from 'path'
import { Plugin, createServer as createViteServer, Resolver } from 'vite'

const debug = require('debug')('codepress')

const appPath = path.join(__dirname, '../lib/app')
debug(`_direname is: ${__dirname}`)
debug(`appPath is: ${appPath}`)

const themePath = path.join(__dirname, '../lib/theme-defalt')

const CodePressResolver: Resolver = {
  publicToFile(publicPath) {
    if (publicPath.startsWith('/@app')) {
      return path.join(appPath, publicPath.replace(/^\/@app\/?/, ''))
    }

    if (publicPath.startsWith('/@theme')) {
      return path.join(themePath, publicPath.replace(/^\/@theme\/?/, ''))
    }
  },
  fileToPublic(filePath) {
    if (filePath.startsWith(appPath)) {
      return `/@app/${path.relative(appPath, filePath)}`
    }
    if (filePath.startsWith(themePath)) {
      return `/@theme/${path.relative(appPath, themePath)}`
    }
  }
}

const CodePressPlugin: Plugin = ({ app, root, watcher }) => {
  // watch theme file if it's outside the project root
  debug(`root: ${root} and watcher:${watcher}`)
  if (path.relative(root, themePath).startsWith('..')) {
    debug(`watching theme dir outside of project root: ${themePath}`)
    watcher.add(themePath)
  }

  app.use(async (ctx, next) => {
    // detect and serve vitepress files
    debug(`ctx.path is: ${ctx.path} and ctx.url is: ${ctx.url}`)
    const file = CodePressResolver.publicToFile(ctx.path, root)
    debug(`file is now: ${file}`)
    if (file) {
      ctx.type = path.extname(file)
      // TODO: cachedRead
      debug(`serving file: ${ctx.url}`)
      return next()
    }

    if (ctx.path.endsWith('.md')) {
      debug(`serving .md: ${ctx.path}`)
    }

    await next()

    // serve our index.html after vite history fallback
    if (ctx.url === '/index.html') {
      ctx.type = 'text/html'
      debug(`index.html: ${ctx.path}`)
    //   ctx.body = await cachedRead(path.join(appPath, 'index-dev.html'))
    }
  })
}

export function createServer() {
  return createViteServer({
    plugins: [CodePressPlugin],
    resolvers: [CodePressResolver]
  })
}
