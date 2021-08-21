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

const _Promise = new MyPromise((reslove) => {
  setTimeout(() => {
    reslove('this is success class')
  }, 2000)
}).then(res => {
  console.log(res)
}, err => {
  console.log(err)
})