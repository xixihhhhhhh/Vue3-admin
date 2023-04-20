import axios from 'axios'
import NProgress from 'nprogress'
import { useStore } from "@/stores";

const store = useStore();

// 创建一个实例，可以自定义配置
const http = axios.create({
  baseURL: 'http://api_blog.mgaronya.com',
  timeout: 10000,
})

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在请求发送之前做些什么
    NProgress.start() // 开始进度条
    // config.headers.Authorization = 'Bearer ' + store.user.token
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('token')
    return config
  },
  (error) => {
    // 处理请求错误
    NProgress.done() // 结束进度条
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    NProgress.done() // 结束进度条
    return response.data
  },
  (error) => {
    // 处理响应错误
    NProgress.done() // 结束进度条
    return Promise.reject(error)
  }
)

export default http