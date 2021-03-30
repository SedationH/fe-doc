function createELe(vnode) {
  vnode.elm = document.createElement(vnode.nodeName, vnode.attributes)
  if (Array.isArray(vnode.children)) {
    for (const ch of vnode.children) {
      vnode.elm.appenChild(createELe(ch))
    }
  }
  return vnode.elm
}
