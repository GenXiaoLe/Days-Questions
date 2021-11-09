### 谈一谈对vue组件化的理解
> 组件是独立的和可复用的代码组织单元，组件系统是Vue的核心之一，他使开发者可用使用通用，小型的可复用组件构成大型项目

#### 优点
    - 组件的合理使用可以大幅度提高项目的开发效率，测试性，复用性
    - 合理的划分组件，有助于提高项目性能
#### 组件的要素以及设计原则
    - vue中常见的组件化技术有：props，slots，自定义事件等，这些主要用于组件通信，拓展等
    - 组件的设计应该是高内聚，低耦合
    - 组件的开发应该遵循单向数据流的原则
#### 组件的分类
    - 页面组件：一般是一些通用页面设计成组件，如登陆页
    - 业务组件：一般是和业务密切相关，复用性比较高的组件
    - 通用组件：项目中多处用到，复用性较高的组件，如button，search等
#### 从代码角度分析组件
    - 组件的形式
    ```js
        // 第一种 直接调用component方法
        Vue.component('comp', {
            data() {
                return {}
            }
        })

        //  第二种 编写.vue文件
        <template>
            <div></div>
        </template>

        <script>
            export default {
                data() {
                    return {}
                }
            }
        </script>
    ```
    我们首先需要明确一点，Vue的组件是基于配置的，不管是第一种还是第二种，我们编写的都是组件配置而并非组件，框架后续会生成其构造函数

    - 组件构造函数源码分析
    ```js
        // core/global-api/assets.js
        // ASSET_TYPES = ['component', 'directive', 'filter']
        // 在开始阶段，vue会循环遍历实例中组件的配置，在component把组件配置实例化，赋值给对应key

        ASSET_TYPES.forEach(type => {
            Vue[type] = function (
            id: string,
            definition: Function | Object
            ): Function | Object | void {
            if (!definition) {
                return this.options[type + 's'][id]
            } else {
                /* istanbul ignore if */
                if (process.env.NODE_ENV !== 'production' && type === 'component') {
                    validateComponentName(id)
                }
                if (type === 'component' && isPlainObject(definition)) {
                    definition.name = definition.name || id
                    definition = this.options._base.extend(definition)
                }
                if (type === 'directive' && typeof definition === 'function') {
                    definition = { bind: definition, update: definition }
                }
                this.options[type + 's'][id] = definition
                return definition
            }
            }
        })

        // definition = this.options._base.extend(definition)是返回组件配置实例
        // 在extend方法中 将Super即Vue实例的的原型赋值给Sub的原型 然后将全局配置和传入配置合并，然后返回
        
        const Sub = function VueComponent (options) {
            this._init(options)
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        )
        Sub['super'] = Super

        // 组件实例化时机并不一致，全局注册的组件实例化有时在全局vue实例之前，页面中的组件实例一般在patch时候
        // vdom/patch.js

        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return
        }
    ```