### Vue组件data选项为什么必须是个函数而Vue的根实例则没有此限制？
- 在Vue根实例中data可以为函数，可以为对象
    - 源码层方面分析:
    ```js
        // 在initData时候会先判断data的类型, 所以在根实例中无论是对象或者是函数类型均会解析
        let data = vm.$options.data
        data = vm._data = typeof data === 'function'
            ? getData(data, vm)
            : data || {}
    ```
    - 原因:
    因为无论是什么类型, 只要挂载在根实例上, 均属于全局类型, 可以全局调用, 不存在数据污染
- 在Vue的组件中data必须为函数
    - 源码层面分析:
    ```js
        // 在创建或注册模板的时候, 会判断data的类型, 如果不是函数类型, 则会抛出一个错误
        strats.data = function (
            parentVal: any,
            childVal: any,
            vm?: Component
        ): ?Function {
            if (!vm) {
                if (childVal && typeof childVal !== 'function') {
                process.env.NODE_ENV !== 'production' && warn(
                    'The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.',
                    vm
                )

                return parentVal
                }
                return mergeDataOrFn(parentVal, childVal)
            }

            return mergeDataOrFn(parentVal, childVal, vm)
        }
    ```
    - 原因:
    其实每一个组件均可当作一个构造器, 注册组件的本质其实就是构造器的引用. 如果直接使用对象, 他们的内存地址是一样的, 一个数据改变了其他也改变了, 这就造成了数据污染, 如果使用函数的话, 会形成一个全新的作用域, 这样data中的数据不会相互影响, 从而避免数据污染, 下面从原型链出发举个例子:
    ```js
        const MyComponents = function() {}
        MyComponents.prototype.data = {
            number: 1
        }

        let component1 = new MyComponents()
        let component2 = new MyComponents()
        component1.data.number = 2

        console.log(component1.data.number, 'component1-data') // 2
        console.log(component2.data.number, 'component2-data') // 2
    ```
    
