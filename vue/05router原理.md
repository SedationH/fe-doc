## 分析逻辑

拦截默认行为，控制页面显示

有哪些页面行为？

- 浏览器bower上的前进后退点击操作
- history相关api
  - go back pushState
- link
- hash

浏览器有相关的事件机制来拿到行为变化

Event:

- hasChange
- popState



如何控制页面显示？

url -> Page

```vue
<component :is="xxx"> <component>
```

建立起 map 

url : pageComponent的映射关系



值得一提的是 Just calling `history.pushState()` or `history.replaceState()`won't trigger a `popstate` event. 

这里需要额外处理下映射变动



## 实现原理

阻止默认的链接跳转，利用HTML5 History API来建立一个客户端的router

> Combined with the HTML5 History API, you can build a very basic but fully-functional client-side router. To see that in practice, check out [this example app](https://github.com/chrisvfritz/vue-2.0-simple-routing-example).



基于demo的思路，尝试自己使用组件进行实现

结构如下

```zsh
$ tree src 
src
├── App.vue
├── components
│   ├── RouterLink.vue
│   └── RouterView.vue
├── main.js
└── pages
    ├── ArticlesPage.vue
    └── HomePage.vue
```

main.js

```js
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

const data = {
  currentRoute: window.location.pathname,
}

new Vue({
  render: h => h(App),
  data,
}).$mount('#app')

window.addEventListener('popstate', () => {
  data.currentRoute = window.location.pathname
})
```



App.vue

```vue
<template>
  <div>
    <router-link href="/">Home</router-link>
    <router-link href="/articles">Article</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import RouterLink from '@/components/RouterLink'
import RouterView from '@/components/RouterView'

export default {
  components: {
    RouterView,
    RouterLink
  },
  methods: {},
}
</script>
```



RouterLink

```vue
<template>
  <a :href="href" :class="{ active: isActive }" @click.prevent="go">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: ['href'],
  computed: {
    isActive() {
      return this.href === this.$root.currentRoute
    },
  },
  methods: {
    go() {
      this.$root.currentRoute = this.href
      window.history.pushState(null, null, this.href)
    },
  },
}
</script>

<style scoped>
a {
  margin-left: 10px;
}
.active {
  color: red;
}
</style>
```



RouterView

```vue
<template>
  <component :is="routedComponent"></component>
</template>

<script>
import HomePage from 'src/pages/HomePage.vue'
import ArticlesPage from 'src/pages/ArticlesPage.vue'

const routes = {
  '/': HomePage,
  '/articles': ArticlesPage,
}

export default {
  computed: {
    routedComponent() {
      return routes[this.current]
    },
    current() {
      return this.$root.currentRoute
    },
  },
}
</script>
```
