import MarkdownIt from 'markdown-it'

export interface MarkdownRenderer {
  __data: any
  render: (src: string, env?: any) => { html: string; data: any }
}

export const createMarkdownRenderer = (): MarkdownRenderer => {
  const md = MarkdownIt()
  dataReturnable(md)
  return md as any
}

export const dataReturnable = (md: MarkdownIt) => {
  const render = md.render
  const wrappedRender: MarkdownRenderer['render'] = (src) => {
    ;(md as any).__data = {}
    const html = render.call(md, src)
    return {
      html,
      data: (md as any).__data
    }
  }
  ;(md as any).render = wrappedRender
}
