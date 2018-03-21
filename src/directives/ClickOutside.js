export default {
  bind: function(el, binding, vnode) {
    el.event = function(event) {
      console.log('v-click-outside')
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click'
    document.body.addEventListener(touchEvent, el.event)
  },
  unbind: function(el) {
    document.body.removeEventListener('click', el.event)
  }
}
