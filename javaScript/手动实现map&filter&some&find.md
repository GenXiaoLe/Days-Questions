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

### 实现filter
先看一下fliter的用法
```
const arr = [{id: 1}, {id: 2}, {id: 3}]

const res = arr.filter(item => item.id > 1) // [{id: 2}, {id: 3}]
```

filter和map很相似，不同点在于，filter返回执行成功的对象，所以在map的基础上做一些改造

```
Array.prototype._filter = function (fn) {
  // 最终返回的结果数组
  const _array = [];

  // 数组本身的内容
  const _self = this;

  // 遍历数组
  for (let i = 0; i < _self.length; i++) {
    // 把相应的值传入到方法中，并执行函数
    if (fn(_self[i])) {
      // 如果执行成功 把当前结果则插入到结果数组中
      _array.push(_self[i])
    }
  }

  return _array
}
```

### 实现find
先看一下find的用法
```
const arr = [{id: 1}, {id: 2}, {id: 3}]

const res = arr.find(item => item.id === 1) // {id: 1}
```

find和filter基本上用法差别很小，只是find用来查找符合条件的单个参数，我们基于filter做一下改造即可

```
Array.prototype._filter = function (fn) {
  // 最终返回的结果数组
  const _item = null;

  // 数组本身的内容
  const _self = this;

  // 遍历数组
  for (let i = 0; i < _self.length; i++) {
    // 把相应的值传入到方法中，并执行函数
    if (fn(_self[i])) {
      // 如果执行成功 把当前结果则插入到结果数组中
      _item = _self[i]
    }
  }

  return item
}
```


### 实现some
先看一下some的用法
```
const arr = [{id: 1}, {id: 2}, {id: 3}]

const res = arr.some(item => item.id === 1) // true
```

这个some方法和find方法可以说是很像了，find返回一个相关参数，some则是返回一个布尔值。
```
Array.prototype._some = function (fn) {
  // 最终返回的结果数组
  const _bol = false;

  // 数组本身的内容
  const _self = this;

  // 遍历数组
  for (let i = 0; i < _self.length; i++) {
    // 把相应的值传入到方法中，并执行函数
    if (fn(_self[i])) {
      // 如果执行成功 把当前结果则插入到结果数组中
      _bol = true
    }
  }

  return _bol
}
```