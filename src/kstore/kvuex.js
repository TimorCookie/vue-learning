let _Vue
class Store {
  constructor (options) {
    this.$options = options
    // 保存用户配置的mutations和actions
    this._mutations = options.mutations || {}
    this._actions = options.actions || {}
    this._vm = new _Vue({
      data: {
        $$state: options.state
      }
    })
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    console.error('please use replaceState to reset state')
  }

  commit (type, payload) {
    // 获取type对应的mutation
    const entry = this._mutations[type]
    if (!entry) {
      return console.error(`unknown mutation type: ${type}`)
    }
    // 指定上下文为Store实例（bind） 将state传递给mutation并执行函数
    entry(this.state, payload)
  }

  dispatch (type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      return console.error(`unknown action type: ${type}`)
    }
    return entry(this, payload)
  }
}
function install (Vue) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
