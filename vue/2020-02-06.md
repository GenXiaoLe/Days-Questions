### vue-router导航钩子

- 全局前置守卫
> router.beforeEach 注册一个全局前置守卫

    ```js
    const router = new VueRouter()

    router.beforeEach((to, from, next) => {})
    ```

    当一个导航触发时，全局前置守卫按照创建顺序调用，包含三个参数
        1. to: Route: 即将要进入的目标 路由对象
        2. from: Route: 当前导航正要离开的路由
        3. next: Function: 进入下一个路由，这里是一个函数，直接调用，里面可以传入{ path: '/' }之类跳到一个新地址

- 全局解析守卫
> router.beforeResolve 注册一个全局守卫。这和 router.beforeEach 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用

- 全局后置钩子
> router.afterEach 注册一个全局后置钩子。和beforeEach很相似，但不同的是他不会接受 next 函数也不会改变导航本身

- 路由独享的守卫
> 在router配置时候设置beforeEnter

    ```js
        const router = new VueRouter({
            routes: [
                {
                    path: '/foo',
                    component: Foo,
                    beforeEnter: (to, from, next) => {}
                }
            ]
        })
    ```

    和beforeEach用法一致，但它是用在局部的路由中

- 组件内的守卫
> 顾名思义，是配置在组件中的路由守卫，beforeRouteEnter， beforeRouteUpdate， beforeRouteLeave

    ```js
        const Foo = {
            template: `...`,
            beforeRouteEnter (to, from, next) {
                // 在渲染该组件的对应路由被 confirm 前调用
                // 不！能！获取组件实例 `this`
                // 因为当守卫执行前，组件实例还没被创建
            },
            beforeRouteUpdate (to, from, next) {
                // 在当前路由改变，但是该组件被复用时调用
                // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
                // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
                // 可以访问组件实例 `this`
            },
            beforeRouteLeave (to, from, next) {
                // 导航离开该组件的对应路由时调用
                // 可以访问组件实例 `this`
            }
        }
    ```

- 总结流程
1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。