// 实现对axios封装

/*eslint-disable*/
import axios from "axios"
import { Message } from "element-ui"
import store from "@/store"

// 通过axios 创建 axios 实例
const service = axios.create({
baseURL:process.env.VUE_APP_BASE_API,
 timeout: 5000
})
service.interceptors.response.use(response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return data
    } else {
      // 业务已经错误了 
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  }, error => {
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})
// 统一注入token
service.interceptors.request.use(config => {
    // 在这个位置需要统一的去注入token
    if (store.getters.token) {
      // 如果token存在 注入token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
  }, error => {
    return Promise.reject(error)
  }) 
export default service