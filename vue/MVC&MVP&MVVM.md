### 谈谈你对MVC MVP MVVM架构的理解
> 这三者的共同出发点都是为了解决model和view层的耦合和交互问题
- MVC
    - 定义
    即model-view-controller，model存放数据，controller负责业务逻辑，view负责视图展示。view可以和model互相通知更新，也可以通知controller更新；controller可以通知model更新。
    - 优缺点
    1. 优点是整个架构更加灵活，效率提升
    2. 缺点是数据流很混乱，由于view可以和model互相通知更新，可能最终成为多对多的结果。并且controller层显得更加单薄，失去了它存在的意义。
- MVP
    定义
    即model-presenter-view，presenter作为中间逻辑层可以和model双向交互，也可以和view双向交互，优化了MVC中model和view层混乱的问题，也可以说是MVVM架构的雏形
    - 优缺点
    1. 优点是presenter集中管理model和view层，防止逻辑混乱
    2. 缺点是presenter由于负责所有交互，并且要编写业务逻辑，在开发的过程中会越来越臃肿，且比起MVC架构还少了一些灵活
- MVVM
    - 定义
    即model-view-viewmodel，viewmodel比起之前的presenter层实现了一套数据响应式机制自动响应model数据变化，并且使用虚拟dom和diff算法使model的数据变化体现在view层面上，同时通过事件监听响应view中用户交互修改model的数据。
    - 优缺点
    在viewmodel中减少了大量的dom操作代码，保持view和model松耦合的同时，还减少了维护他们关系的代码，使用户更加专注于业务逻辑，兼顾开发的效率和可维护性，大幅度提升了性能

