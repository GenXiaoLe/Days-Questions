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

### 基础版Promise的实现
> 不包括处理异步

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
      onRejected(this._value)
    }

    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {})
  }
}
```

最简版的Promise已经也好了，但是这个还不满足我们的需求，因为总所周知，Promise使用来解决异步的，这么玩肯定是行不通。
所以接下来我们再来加亿点点东西!

### 完整版的Promise实现
> 包括处理异步情况

先上一个包含异步的用法
```
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
}).then((res) => {
  console.log(res)
})
```

改造前要先想一想，异步的时候，上面的实现为什么行不通。其实当then执行时候resolve并没有执行，这就导致staus这时候依然是Pending，根本拿走不到相应的函数中去。
那么我们改造的点应该就想到了，应该是创建一个队列并缓存相应的方法，即使当handle并没有执行，状态为Pending的时候，handle依然能拿到缓存队列中的方法去执行。
那么我们下面开始进行改造。

```
class MyPromise {
  constructor (handle) {
    // 如果传入的不是一个函数
    if ((typeof handle) !== 'function') {
      throw new Error('MyPromise must accept a function as a parameter')
    }

    // 添加状态
    this._status = 'Pending'

    // 最终的值
    this._value = undefined

    this.resolve = this.resolve.bind(this)

    this.reject = this.reject.bind(this)

    this.then = this.then.bind(this)

    // 添加成功回调函数队列
    this._fulfilledQueues = []
    // 添加失败回调函数队列
    this._rejectedQueues = []

    // 执行handle
    try {
      handle(this.resolve, this.reject)
    } catch (err) {
      this.reject(err)
    }
  }

  resolve (val) {
    // 如果当前状态不是Pending
    if (this._status !== 'Pending') {
      return
    }

    const fn = this._fulfilledQueues.pop()
    if (fn && (typeof fn) === 'function') {
      fn(val)
    }

    this._status = 'Fulfilled'
    this._value = val
  }
  

  reject (val) {
    // 如果当前状态不是Pending
    if (this._status !== 'Pending') {
      return
    }

    const fn = this._rejectedQueues.pop()
    if (fn && (typeof fn) === 'function') {
      fn(val)
    }

    this._status = 'Rejected'
    this._value = val
  }

  then (onFulfilled, onRejected) {
    // 对方法进行缓存
    if (this._status === 'Pending') {
      this._fulfilledQueues.push(onFulfilled)
      this._rejectedQueues.push(onRejected)
    } else if (this._status === 'Fulfilled') {
      onFulfilled(this._value)
    } else if (this._status === 'Rejected') {
      onRejected(this._value)
    }

    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {})
  }
}
```

这样基本上promise的改造就完成了。

### 基于Promise实现各种原生方法

#### Promise.all
```
Promise.prototype._all = function (promises) {
  return new Promise((resolve, reject) => {
    let promiseLen = promises.length
    let promiseCount = 0
    let values = new Array(promiseLen)

    for (let i = 0; i < promiseLen; i++) {
      (function(v) {
        const promise = promises[v]

        Promise.resolve(promise).then(value => {
          values[v] = value
          promiseCount++

          if (promiseCount === promiseLen) {
            return resolve(values)
          }
        }, error => {
          return reject(error)
        })
      })(i)
    }
  })
}
```