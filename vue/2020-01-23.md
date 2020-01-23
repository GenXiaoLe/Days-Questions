### 你怎么理解vue中的diff算法？

1. 什么是diff算法
    diff算法直观来说是在virtual DOM发生变化的时候和真实DOM进行比较，找出不一样的地方进行替换和更新的一种算法
1. diff算法的具体作用是什么
    我们先根据真实DOM生成一颗virtual DOM，当virtual DOM某个节点的数据改变后会生成一个新的Vnode，然后Vnode和oldVnode作对比，发现有不一样的地方就直接修改在真实的DOM上，然后使oldVnode的值为Vnode。
    diff的过程就是调用名为patch的函数，比较新旧节点，一边比较一边给真实的DOM打补丁。
1. diff算法是如何进行比较的
    上面提到diff算法主要是调用patch函数，所以我们从patch函数入手进行比较，直接上源码
    ```js
    // src\core\vdom\patch.js patch函数 开始打补丁

    // 如果不是真实DOM并且是相同的Vnode
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
    }

    // 进入patchVnode函数 开始对比新老Vnode
    // 新旧虚拟dom子节点
    const oldCh = oldVnode.children
    const ch = vnode.children
    // 是否是元素节点
    if (isUndef(vnode.text)) {
      // 是元素节点
      if (isDef(oldCh) && isDef(ch)) { // 都有子节点 diff对比子节点
        // 旧的子节点和新的子节点不相同 开始进行子节点比较
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) { // 只有新vnode有子节点 往旧vnode插入子节点
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) { // 旧vnode有子节点 干掉上面的子节点
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) { // 旧vnode有文本节点 直接赋值
        nodeOps.setTextContent(elm, '')
      }
    }

    // 对比子节点Vnode，进入updateChildren函数
    // 这段就是diff算法的核心代码，主要用于循环比较Vnode节点进行打补丁
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    ```

    通过源码，我们可以得出以下diff的工作原理：
    1. 首先判断有没有oldVnode mount挂载时 界面中是没有vnode 直接调用createElm不走diff算法 这里可理解为初始化生成真实dom树 之后替换掉界面中存在的dom
    1. 再次渲染时首先判断oldVnode是否是真实dom 是的话将转化为虚拟dom 即vnode
    1. 如果oldVnode是虚拟dom 并且和newVnode key值等相同 即同一个vnode 则进入vnode patch比较 调用patchVnode
    1. patchVnode执行时正式进入新旧vnode对比模式 即diff 并且在diff前会先判断文本节点还是元素节点 文本节点直接diff 元素节点会找有没有子节点 有的话对比子节点
        1. 如果新旧vnode均有子节点 则调用updateChildren() 进行对比计算
        1. 如果只有新vnode有子节点 则在旧vnode中追加
        1. 如果只有旧vnode有子节点 则直接干掉这些节点
    1. 进入updateChildren后新旧vnode头尾各创建两个指针 newStartIndex newEndIndex oldStartIndex oldEndIndex
    1. 开始while循环 当newStartIndex > newEndIndex || oldStartIndex > oldEndIndex 跳出循环 以下以ov代替oldVnode nv代替newNode nsi nei osi oei 代替指针
        1. ov[osi] === nv[nsi] 直接替换的vnode    osi nsi 指针后移
        1. ov[oei] === nv[nsi] ov[oei] 位置移到最前 替换    osi nsi 指针后移
        1. ov[osi] === nv[nei] ov[osi] 位置一到最后 替换  nei oei 指针前移
        1. ov[oei] === nv[nei] 直接替换的vnode    nei oei 指针前移
        1. 如果以上四种基础情况均未找到 只能开始遍历nv节点循环查找ov节点 ovi nvi 代表找到的节点
            1. ovi === nvi 将nvi移到对前面 替换     osi nsi 指针后移
            1. ovi 没有找到 插入到nvi第一个    osi nsi 指针后移
    1. 跳出while之后 对比nsi nei osi oei
        1. nsi < nei nv比较长 将最后的vnode 追加到 ov
        1. 反之 osi < oei ov比较长 将最后的vnode干掉