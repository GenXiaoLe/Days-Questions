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
   console.log(_t.fn, this)
   _t.fn = this
   
  console.log(_t)
   // 去掉上下文参数
   let arr = [...arguments].slice(1)
   _t.fn(...arr)
 }

 a.fn1._call(b, 10)
```

TODO: call看起来是在a的方法里面使用了b的参数，其实是在b里面执行了a的方法