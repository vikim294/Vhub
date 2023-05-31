// node.js中的定时器 和 浏览器中的定时器 的实现机制不同
const t = setInterval(() => { console.log('4s has gone') }, 4000)
console.log(t._destroyed)
const s = setTimeout(() => {
  clearInterval(t)
  clearTimeout(s)

  console.log(t._destroyed)
  console.log(s)
}, 5000)
