### 实现map
先看一下map的用法
```
const arr = [{id: 1}, {id: 2}, {id: 3}]

const res = arr.map(item => item.id) // [1, 2, 3]
```

简单分析一下：
1. map接受一个函数
2. map会遍历所有数组并且执行函数
3. 最终返回的是一个函数执行结果的集合

实现一下
```
Array.prototype._map = function (fn) {
  // 最终返回的结果数组
  const _array = [];

  // 数组本身的内容
  const _self = this;

  // 遍历数组
  for (let i = 0; i < _self.length; i++) {
    // 把相应的值传入到方法中，并执行函数
    const _res = fn(_self[i])
    
    if (_res) {
      // 如果执行成功 则插入到结果数组中
      _array.push(_res)
    }
  }

  return _array
}
```