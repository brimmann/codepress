import { createApp, ref, provide, h } from 'vue'
import { Layout } from '/@theme/index.js'

const app = createApp({
    setup() {
        const path = ref(window.location.pathname)
        provide("codepress:path", path)

        return () => h(Layout)
    }
})

app.mount('#app')