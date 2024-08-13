import { createMarkdownRenderer } from './markdown/index'

const debug = require('debug')('codepress:md')

export function createMarkdownFn(root: string) {
  const md = createMarkdownRenderer()
  return (src: string, file: string) => {
    debug(`passed to createMarkdownFn: src: ${src} and file: ${file}`)
    const { html } = md.render(src)
    const vueSrc = `<template>${html}</template>`
    return vueSrc
  }
}
