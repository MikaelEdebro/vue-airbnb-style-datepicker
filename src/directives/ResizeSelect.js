export default {
  componentUpdated: resizeSelect,
  inserted: resizeSelect,
}

function resizeSelect(el, binding, vnode) {
  const select = document.createElement('select')
  select.className = el.className
  const option = document.createElement('option')
  option.textContent = el.value
  select.appendChild(option)
  el.parentNode.appendChild(select)
  el.style.width = select.offsetWidth + 'px'
  select.parentNode.removeChild(select)
}
