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
    const path = ref(window.location.pathname)
    provide(pathSymbole, path)

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
        pagePath += 'index.md'
      } else {
        pagePath += '.md'
      }

      console.log('pagepath', pagePath)
      import(pagePath)
        .then((m) => {
          comp.value = m.default
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
