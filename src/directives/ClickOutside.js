export default {
  bind: function(el, binding, vnode) {
    el.event = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.event)
  },
  unbind: function(el) {
    document.body.removeEventListener('click', el.event)
  }
}
