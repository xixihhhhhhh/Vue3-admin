import http from './userRequest'

// 用户登录
export const login = (params: any) => http({ url: '/login', method: 'post', data: params })

// 获取个人用户信息
export const getPersonMsg = () => http({ url: '/personal', method: 'GET' })