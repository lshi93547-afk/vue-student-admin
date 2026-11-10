import axios from 'axios'
import { ElMessage } from 'element-plus'

// 开发环境读 .env.development（http://localhost:3001）
// 生产环境读 .env.production（/api，由 Nginx 反代到 3001）
const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

const http = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器：自动带上登录 token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器：统一错误提示，只把 data 交给页面
http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    ElMessage.error(err.response?.status ? `请求失败（${err.response.status}）` : '网络异常，请检查 json-server 是否启动')
    return Promise.reject(err)
  }
)

export default http
