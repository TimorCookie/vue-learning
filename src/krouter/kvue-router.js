let _Vue
class VueRouter {
  constructor (options) {
    this.$options = options
    // 定义响应式属性current
    const initial = window.location.hash.slice(1) || '/'
    _Vue.util.defineReactive(this, 'current', initial)
    // 监听hashchange事件
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }

  onHashChange () {
    console.log(this.$options)
    this.current = window.location.hash.slice(1)
  }
}
// 插件： 实现install方法，注册$router
VueRouter.install = (Vue) => {
  _Vue = Vue
  // task1: 挂载$router
  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  // task2: 实现两个全局组件（router-view & router-link）
  // 形如 <a href="#/about">about</a>
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render (h) {
      return h('a', {
        attrs: {
          href: '#' + this.to
        }
      },
      this.$slots.default
      )
    }
  })
  Vue.component('router-view', {
    render (h) {
      let component = null
      const route = this.$router.$options.routes.find(route => route.path === this.$router.current)
      if (route) component = route.component
      return h(component)
    }
  })
}
export default VueRouter
