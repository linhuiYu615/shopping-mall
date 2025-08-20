// 建一个存储名 统一用这个
// record是变量，里面装着真正的键名'shopp_info'
// record只是常量钥匙存放键名'shopp_info'，obj才是塞进这个键的具体数据
// 'record'里放的就是'shopp_info'这串字，每次setItem/getItem/removeItem(record, …)时就实际用到它，本身不再单独写。
// record是变量名，shopp_info是字符串。
const record = 'shopp_info'

export const setdata = (obj) => {
  localStorage.setItem(record, JSON.stringify(obj))
}

// 取 取出来必须有返回值
export const getdata = () => {
  // getitem能不能取的到 某些情况下 比如网卡 没set就get了 或者remove忘记了 就会取到空值 所以进行判断
  // null是t oken和userId都是空的 就是上面说的空值
  const temp = { token: '', userId: '' }
  const result = localStorage.getItem(record)
  return result ? JSON.parse(result) : temp
}

// 移除
export const removedata = () => {
  localStorage.removeItem(record)
}

const history = 'hisstory_info'

// 不移除 因为我有clear方法 去那边清空
export const sethistory = (arr) => {
  localStorage.setItem(history, JSON.stringify(arr))
}

export const gethistory = () => {
  const res = localStorage.getItem(history)
  return res ? JSON.parse(res) : []
}
