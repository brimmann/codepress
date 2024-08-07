const debug = require('debug')('codepress:md')

export function createMarkDownFn(root: string) {
  return (src: string, file: string) => {
    debug(`passed to createMarkdownFn: src: ${src} and file: ${file}`)
    const vueSrc = `<template>${src}</template>`
    return vueSrc
  }
}
