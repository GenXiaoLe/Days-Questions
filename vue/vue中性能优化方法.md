### vue了解哪些性能优化方法
1. 路由懒加载
    ```js
        const router = new vueRouter({
            routers: [
                { path: '/', component: () => import('./Foo.vue') }
            ]
        })
    ```
2. keep-alive缓存页面
    不需要重新加载的页面，使用kepp-alive缓存起来，这里可以结合vuex来使用
    ```js
        <template>
            <div>
                <keep-alive>
                    <router-view>
                </keep-alive>
            </div>
        </template>
    ```
3. 使用v-show复用 
    v-if也能实现相同功能，但是如果组件渲染是将较长，比较重，使用v-show复用可以避免dom元素重新插入，提升性能

4. v-for避免中避免使用v-if
    具体原因在2020-01-20.md中有具体解释

5. 长列表性能优化
    - 如果是存粹的数据展示，不涉及到数据更新，不需要响应式变化，获取最好放到create之类的周期中
    - 如果是大数据常列表，可采用虚拟滚动，只渲染部分区域的内容
        比如vue-virtua-scroller， vue-virtua-scroll-list等库

6. 图片懒加载
    参考库 vue-lazyload
    ```js
        <img v-lazy="/img/1.jpg" />
    ```

7. 无状态组件标记为函数式组件
    不存在内部状态渲染的组件可标记为函数是组件，提升性能效率
    ```js
        <template functional>
            <div>
                <span>title</span>
            </div>
        </template>
    ```

8. 子组件分割
    对于组件的粒度化进行合理细分，可以使vue在diff时候精准更新到某一模块，从而避免无用更新渲染

9. ssr
    使用ssr可以大幅度提高首屏到达速度，提高网站seo权重