### 谈谈对vue生命周期的理解
> vue 官网介绍中的生命周期有 beforeCreate created beforeMount mounted beforeUpdate updated beforeDestroy destroyed

- beforeCreate 和 create
    在官方介绍中 beforeCreate注册调用是在初始化事件和生命周期之后，在初始化注入和校验之前。create调用则在在初始化注入和校验之后

    ```js
        // 源码在core/instance/init中的initMixin函数中
        // 这个函数会在根vue实例创建之后调用

        initLifecycle(vm) // 定义 $parent $children $root $refs 等引用类型
        initEvents(vm) // 监听挂载父元素上的事件 在这里可以看出
        initRender(vm) // 主要用来初始化 $slots $createElement 等渲染需要的方法
        callHook(vm, 'beforeCreate')
        initInjections(vm) // resolve injections before data/props
        initState(vm) // 重要函数 实现proxy代理属性 响应式属性之类的初始化
        initProvide(vm) // resolve provide after data/props
        callHook(vm, 'created')
    ```

    从上面可以看出beforeCreate在做完一系列初始化之后在调用，但是在这个周期中无法访问到data，props之类的一些属性，应为还没有初始化和注入，所以无法进行异步请求并给data赋值之类的操作，但是在created周期中可以调用到

- beforeMount mounted
    在官方介绍中 beforeMount注册调用是在template渲染为render函数或者将el外部的html做为template编译之后，然后创建vm.$el并替换el，之后调用mounted

    ```js
        // 由于是在挂载的时候执行，所以周期源码中在挂载的时候去查找 mountComponent方法是在挂载时候执行的方法
        // core/instance/lifecycle中的 mountComponent方法

        vm.$el = el
        if (!vm.$options.render) {
            vm.$options.render = createEmptyVNode
            if (process.env.NODE_ENV !== 'production') {
            /* istanbul ignore if */
            if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                vm.$options.el || el) {
                    warn(
                    'You are using the runtime-only build of Vue where the template ' +
                    'compiler is not available. Either pre-compile the templates into ' +
                    'render functions, or use the compiler-included build.',
                    vm
                )
            } else {
                warn(
                    'Failed to mount component: template or render function not defined.',
                    vm
                )
            }
            }
        }

        callHook(vm, 'beforeMount')

        let updateComponent
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
            updateComponent = () => {
                const name = vm._name
                const id = vm._uid
                const startTag = `vue-perf-start:${id}`
                const endTag = `vue-perf-end:${id}`

                mark(startTag)
                const vnode = vm._render()
                mark(endTag)
                measure(`vue ${name} render`, startTag, endTag)

                mark(startTag)
                vm._update(vnode, hydrating)
                mark(endTag)
                measure(`vue ${name} patch`, startTag, endTag)
            }
        } else {
            updateComponent = () => {
                vm._update(vm._render(), hydrating)
            }
        }

        // we set this to vm._watcher inside the watcher's constructor
        // since the watcher's initial patch may call $forceUpdate (e.g. inside child
        // component's mounted hook), which relies on vm._watcher being already defined
        new Watcher(vm, updateComponent, noop, {
            before () {
                if (vm._isMounted && !vm._isDestroyed) {
                    callHook(vm, 'beforeUpdate')
                }
            }
        }, true /* isRenderWatcher */)
        hydrating = false

        // manually mounted instance, call mounted on self
        // mounted is called for render-created child components in its inserted hook
        if (vm.$vnode == null) {
            vm._isMounted = true
            callHook(vm, 'mounted')
        }
        return vm
    ```

    从上面可以看出在挂载的时候，vm.$el = el，将el赋值给vue实例的$el，以便之后调用真实dom。并且会实例化一个Watcher，用来监听组件的变更，Watcher中的vm._update(vm._render(), hydrating)涉及到了生成渲染函数以及patch转化为真实dom。

- beforeUpdate 和 updated
    在官方介绍中 beforeUpdate注册和调用是在挂载结束之后data被修改，虚拟dom重新渲染并更新应用之前，updated是在这之后
    ```js
        // core/instance/lifecycle中的 mountComponent方法
        new Watcher(vm, updateComponent, noop, {
            before () {
                if (vm._isMounted && !vm._isDestroyed) {
                    callHook(vm, 'beforeUpdate')
                }
            }
        }, true /* isRenderWatcher */)
        
        // Watcher 异步中在批量更新时候会调用queueWatcher，之后会在微队列任务中压入flushSchedulerQueue方法用来处理更新，flushSchedulerQueue方法在执行之后会调用callUpdatedHooks，通知队列中每一个Watcher进行更新
        // core/observer/scheduler
        function callUpdatedHooks (queue) {
            let i = queue.length
            while (i--) {
                const watcher = queue[i]
                const vm = watcher.vm
                if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
                    callHook(vm, 'updated')
                }
            }
        }
    ```
    在介绍上一个周期的时候，我们看到源码中涉及到了Watcher的实例化，主要就是用来监听组件的更新，在before,也就是开始更新之前会调用beforeUpdate，并且在深入探讨Watcher时候我们又会发现，在队列批量更新渲染之后会注册和调用updated，这个时候我们就可以拿到最新的数据

-  beforeDestroy 和 destroyed
    在官方介绍中 beforeDestroy注册调用是在组件和事件监听执行销毁之前，而destroyed则是在这之后
    ```js
        // core/instance/lifecycle中直接挂载在Vue实例上Vue.prototype.$destroy方法
        // 下面贴出整个destroy代码段

        Vue.prototype.$destroy = function () {
            const vm: Component = this
            if (vm._isBeingDestroyed) {
                return
            }
            callHook(vm, 'beforeDestroy')
            vm._isBeingDestroyed = true
            // remove self from parent
            const parent = vm.$parent
            if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
                remove(parent.$children, vm)
            }
            // teardown watchers
            if (vm._watcher) {
                vm._watcher.teardown()
            }
            let i = vm._watchers.length
            while (i--) {
                vm._watchers[i].teardown()
            }
            // remove reference from data ob
            // frozen object may not have observer.
            if (vm._data.__ob__) {
                vm._data.__ob__.vmCount--
            }
            // call the last hook...
            vm._isDestroyed = true
            // invoke destroy hooks on current rendered tree
            vm.__patch__(vm._vnode, null)
            // fire destroyed hook
            callHook(vm, 'destroyed')
            // turn off all instance listeners.
            vm.$off()
            // remove __vue__ reference
            if (vm.$el) {
                vm.$el.__vue__ = null
            }
            // release circular reference (#6759)
            if (vm.$vnode) {
                vm.$vnode.parent = null
            }
        }
    ```
    上面可以看出在执行$destroy的时候，会先调用beforeDestroy，在完成销毁之后，紧接着调用callHook(vm, 'destroyed')