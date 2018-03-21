export default {
  bind: function(el, binding, vnode) {
    el.event = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click'
    document.body.addEventListener(touchEvent, el.event)
  },
  unbind: function(el) {
    const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click'
    document.body.removeEventListener(touchEvent, el.event)
  }
}
