import Vue from 'vue'
Vue.component("demo-component", () => import("C:\\Users\\GDXY-002\\Desktop\\vuepress-starter\\docs\\.vuepress\\components\\demo-component"))
Vue.component("layout", () => import("C:\\Users\\GDXY-002\\Desktop\\vuepress-starter\\docs\\.vuepress\\components\\layout"))
Vue.component("OtherComponent", () => import("C:\\Users\\GDXY-002\\Desktop\\vuepress-starter\\docs\\.vuepress\\components\\OtherComponent"))
Vue.component("Foo-Bar", () => import("C:\\Users\\GDXY-002\\Desktop\\vuepress-starter\\docs\\.vuepress\\components\\Foo\\Bar"))
Vue.component("Badge", () => import("C:\\Users\\GDXY-002\\Desktop\\vuepress-starter\\node_modules\\@vuepress\\theme-default\\global-components\\Badge"))
Vue.component("CodeBlock", () => import("C:\\Users\\GDXY-002\\Desktop\\vuepress-starter\\node_modules\\@vuepress\\theme-default\\global-components\\CodeBlock"))
Vue.component("CodeGroup", () => import("C:\\Users\\GDXY-002\\Desktop\\vuepress-starter\\node_modules\\@vuepress\\theme-default\\global-components\\CodeGroup"))


export default {}