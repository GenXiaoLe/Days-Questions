## 手动实现Promise

### 分析Promise的构成
> 一个最简单的promise用法

```
new Promise((resolve, reject) => {
  resolve(1)
}).then((res) => {
  console.log(res)
})
```

从代码上来看，Promise接收一个函数并提供resolve和reject两个方法，在执行resolve之后，会把入参在then方法中执行。那么Promise需要实现的东西大概这些：
1. 创建Promise的实例
2. 这个Promise包含resolve, reject这两个方法
3. 从then中可以看出，Promise应该有状态的tag，代表执行前(Pending)，执行成功(Fulfilled)，执行失败(Rejected)
4. 还包括实例的方法，比如then, 接收两个参数onFulfilled, onRejected, 代表成功和失败时候执行的函数


```
class MyPromise {
  constructor (handle) {
    // 如果传入的不是一个函数
    if ((typfof handle) !== 'function') {
      throw new Error('MyPromise must accept a function as a parameter')
    }

    // 添加状态
    this._status = 'Pending'

    // 最终的值
    this._value = undefined

    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this.then = this.then.bind(this)

    // 执行handle
    try {
      handle(this.resolve, this.reject)
    } catch (err) {
      this.reject(err)
    }
  }

  resolve (val) {
    // 如果当前状态不是Pending
    if (this.status !== 'Pending') {
      return
    }

    this._status = 'Fulfilled'
    this._value = val
  }
  

  reject (val) {
    // 如果当前状态不是Pending
    if (this.status !== 'Pending') {
      return
    }

    this._status = 'Rejected'
    this._value = val
  }

  then (onFulfilled, onRejected) {
    if (this._status === 'Fulfilled') {
      onFulfilled(this._value)
    } else if (this._status === 'Rejected') {
      onFulfilled(this._value)
    }

    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {})
  }
}
```

最简版的Promise已经也好了，但是这个还不满足我们的需求，因为总做周知，Promise使用来解决异步的，这么玩肯定是走不通。
所以接下来我们再来加亿点点东西!