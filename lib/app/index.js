import {
  createApp,
  ref,
  provide,
  h,
  inject,
  shallowRef,
  watchEffect
} from 'vue'
import { Layout } from '/@theme/index.js'

const pathSymbole = Symbol()

const App = {
  setup() {
    const path = ref(location.pathname)
    provide(pathSymbole, path)

    window.addEventListener(
      'click',
      (e) => {
        if (e.target.tagName === 'A') {
          const { href, target } = e.target
          if (
            target !== `_blank` &&
            href.startsWith(`${location.protocol}//${location.host}`)
          ) {
            e.preventDefault()
            // TODO: save scroll position
            history.pushState(null, '', href)
            path.value = location.pathname
          }
        }
      },
      { capture: true }
    )

    window.addEventListener('popstate', () => {
      path.value = location.pathname
      // TODO: restore scroll position
    })

    return () => h(Layout)
  }
}

const Default404 = () => '404 not found'

const Content = {
  setup() {
    const path = inject(pathSymbole)
    const comp = shallowRef()

    watchEffect(() => {
      let pagePath = path.value.replace('/.html$/', '')
      if (pagePath.endsWith('/')) {
        pagePath += 'index'
      }

      // always force refetch content
      import(`${pagePath}.md?t=${Date.now()}`)
        .then((m) => {
          comp.value = m.default
          console.log('comp.value', comp.value)
        })
        .catch((err) => {
          comp.value = Default404
        })
    })

    return () => (comp.value ? h(comp.value) : null)
  }
}

const app = createApp(App)

app.component('Content', Content)

app.mount('#app')
