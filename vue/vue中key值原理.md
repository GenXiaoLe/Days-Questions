### 你知道vue中key的作用和工作原理吗？说说你对它的理解

#### 作用
- 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes，相当于唯一标识ID。
- Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染， 因此使用key值可以提高渲染效率，同理，改变某一元素的key值会使该元素重新被渲染。

#### 工作原理
> 因为key值主要在虚拟DOM算法，即diff算法。所以我们在src\core\vdom\patch.js文件中，从源码级别进行探讨
- 用一个源码中的方法进行举例：
```js
// 主要在patch方法中调用
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

// 以下代码在patchVnode方法中
// reuse element for static trees.
// note we only do this if the vnode is cloned -
// if the new node is not cloned it means the render functions have been
// reset by the hot-reload-api and we need to do a proper re-render.
if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
) {
    vnode.componentInstance = oldVnode.componentInstance
    return
}
```
- 分析：在例子中可以看出，对Vnode进行patch的时候会调用sameVnode方法，里面会使用key值是否相等来判断Vnode是否为同一个。并且在对比过程中作为Vnode复用的一个判断条件。

- 结论：key值是在DOM树进行diff算法时候发挥作用。一个是用来判断新旧Vnode是否为同一个，从而进行下一步的比较以及渲染。另外一个作用就是判断Vnode是否可以复用，是否需要重新渲染。
    