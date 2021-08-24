## 手动实现bind&call&apply

### 手动实现call
先来一个call的🌰

```
  let a = { 
    x: 5,
    fn1: function(res) {
      console.log(this.x + res)
    }
  }

  let b = {
    x: 10
  }

  a.fn1(10) // 15
  a.fn1.call(b, 10) // 20
```

从上面例子我们明显可以看出，call把a的指针指向了b，使this.x === 10

```
  let a = { 
    x: 5,
    fn1: function(res) {
      console.log(this.x + res)
    }
  }

  let b = {
    x: 10
  }

  Function.prototype._call = function (_t) {
    _t = _t || window

    // 改变函数的指针 给_t扩展一个相同的方法以及函数
    _t.fn = this
    
    // 去掉上下文参数
    let arr = [...arguments].slice(1)
    
  }

  a.fn1._call(b, 10)
```

TODO: call看起来是在a的方法里面使用了b的属性，其实是在b里面执行了a的方法


### 手动实现apply
先来一个apply的🌰

```
  let a = { 
    x: 5,
    fn1: function(res) {
      console.log(this.x + res)
    }
  }

  let b = {
    x: 10
  }

  a.fn1(10) // 15
  a.fn1.apply(b, [10]) // 20
```

apply和call的区别，call是接收一个一个参数，apply接收的是一个数组

```
  let a = { 
    x: 5,
    fn1: function(res) {
      console.log(this.x + res)
    }
  }

  let b = {
    x: 10
  }

  Function.prototype._apply = function (_t) {
   _t = _t || window

   // 改变函数的指针 给_t扩展一个相同的方法以及函数
   _t.fn = this
   
   // 去掉上下文参数
   let arr = [...arguments].slice(1)
   _t.fn(...arr[0])
 }

 a.fn1._apply(b, [10])
```

### 手动实现bind
先来一个bind的🌰

```
  let a = { 
    x: 5,
    fn1: function(res) {
      console.log(this.x + res)
    }
  }

  let b = {
    x: 10
  }

  const _fn = a.fn1.bind(b, 10)
  _fn() // 20
```

bind看起来传参和call是一致的，但用法上还有一些区别，因为bind会返回一个新的函数，再次调用才会执行方法

```
  let a = { 
    x: 5,
    fn1: function(res) {
      console.log(this.x + res)
    }
  }

  let b = {
    x: 10
  }

  Function.prototype._bind = function (_t) {
    _t = _t || window

    // 改变函数的指针 给_t扩展一个相同的方法以及函数
    _t.fn = this
    
    // 去掉上下文参数
    let arr = [...arguments].slice(1)
    
    return function () {
      _t.fn(...arr)
    }
  }

  const _fn = a.fn1._bind(b, 10)
  fn()
```