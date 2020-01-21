### v-if与v-for同时出现,哪个优先级更高?怎么优化能得到更好的性能
1. 当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级, 这点在vue官方API中有明确提到, 但官方同样不希望这两个指令运用在同一元素上

2. 如果v-for 与 v-if在同一元素上同时出现时, 一般有两种情况, 针对这两种情况, 可以做出如下优化:
    - 需要根据每条循环数据中的某一属性判断该元素是否渲染
        - 错误写法:
            ```js
                <ul>
                    <li v-for="item in users" v-if="item.isShow" v-text="item.name"></li>
                </ul>
            ```
        - 正确写法:
            应该在computed上面通过某个属性先判断, 过滤要显示的元素
            ```js
                <ul>
                    <li v-for="item in showUsers" v-text="item.name"></li>
                </ul>

                computed: {
                    showUsers: () {
                        return this.users.filter(item => item.isShow);
                    }
                }
            ```
    - 需要根据某个条件判断元素是否渲染
        - 错误写法:
            ```js
                <ul>
                    <li v-for="item in users" v-if="isShow" v-text="item.name"></li>
                </ul>
            ```
        -  正确写法:
            应该直接写在该元素的父元素上
            ```js
                <ul v-if="isShow">
                    <li v-for="item in users" v-text="item.name"></li>
                </ul>
            ```
