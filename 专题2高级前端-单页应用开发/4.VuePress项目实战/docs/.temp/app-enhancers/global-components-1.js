import Vue from 'vue'
Vue.component("demo-component", () => import("E:\\course\\专题2高级前端-单页应用开发\\4.VuePress项目实战\\docs\\.vuepress\\components\\demo-component"))
Vue.component("layout", () => import("E:\\course\\专题2高级前端-单页应用开发\\4.VuePress项目实战\\docs\\.vuepress\\components\\layout"))
Vue.component("OtherComponent", () => import("E:\\course\\专题2高级前端-单页应用开发\\4.VuePress项目实战\\docs\\.vuepress\\components\\OtherComponent"))
Vue.component("Foo-Bar", () => import("E:\\course\\专题2高级前端-单页应用开发\\4.VuePress项目实战\\docs\\.vuepress\\components\\Foo\\Bar"))
Vue.component("Badge", () => import("E:\\course\\专题2高级前端-单页应用开发\\4.VuePress项目实战\\node_modules\\@vuepress\\theme-default\\global-components\\Badge"))
Vue.component("CodeBlock", () => import("E:\\course\\专题2高级前端-单页应用开发\\4.VuePress项目实战\\node_modules\\@vuepress\\theme-default\\global-components\\CodeBlock"))
Vue.component("CodeGroup", () => import("E:\\course\\专题2高级前端-单页应用开发\\4.VuePress项目实战\\node_modules\\@vuepress\\theme-default\\global-components\\CodeGroup"))


export default {}