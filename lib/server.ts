import path from "path"
import { Plugin, createServer as createViteServer } from "vite"

const debug = require('debug')('codepress')

// const resolveAppFile = (file: string) => path.join(__dirname, '../lib/app', file)

// const resolveThemeFile = (file: string) => path.join(__dirname, '../lib/theme-defalt')

const CodePressPlugin: Plugin = ({root, app}) => {
    app.use(async (ctx, next) => {
        if(ctx.path.startsWith('/@app')) {
            const file = ctx.path.replace(/^\/@app\/?/, '')
            ctx.type = path.extname(file)
            // ctx.body = await cachedRead(resolveAppFile(file))
            debug(`serving app files: ${ctx.url}`)
            return next()
        }
        if (ctx.path.startsWith('/@theme')) {
            const file = ctx.path.replace(/^\/@theme\/?/, '')
            ctx.type = path.extname(file)
            debug(`serving theme files: ${ctx.url}`)
            return next()
        }
    })
}


export function createServer() {
    return createViteServer({
        plugins: [CodePressPlugin]
    })
}