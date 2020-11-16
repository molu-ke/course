import Vue from 'vue'
Vue.component("demo-component", () => import("C:\\Users\\GDXY-002\\Desktop\\blog\\blog\\.vuepress\\components\\demo-component"))
Vue.component("OtherComponent", () => import("C:\\Users\\GDXY-002\\Desktop\\blog\\blog\\.vuepress\\components\\OtherComponent"))
Vue.component("Foo-Bar", () => import("C:\\Users\\GDXY-002\\Desktop\\blog\\blog\\.vuepress\\components\\Foo\\Bar"))
Vue.component("BaseListLayout", () => import("C:\\Users\\GDXY-002\\Desktop\\blog\\node_modules\\@vuepress\\theme-blog\\global-components\\BaseListLayout"))
Vue.component("BlogTag", () => import("C:\\Users\\GDXY-002\\Desktop\\blog\\node_modules\\@vuepress\\theme-blog\\global-components\\BlogTag"))
Vue.component("BlogTags", () => import("C:\\Users\\GDXY-002\\Desktop\\blog\\node_modules\\@vuepress\\theme-blog\\global-components\\BlogTags"))
Vue.component("NavLink", () => import("C:\\Users\\GDXY-002\\Desktop\\blog\\node_modules\\@vuepress\\theme-blog\\global-components\\NavLink"))


export default {}