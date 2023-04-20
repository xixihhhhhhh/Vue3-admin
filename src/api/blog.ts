import http from './blogRequest'


// 根据用户名搜索好友
export const searchFriendByName = (name: string) => http({ url: `/user/name/${name}`, method: 'get' })
// 根据邮箱搜索好友
export const searchFriendByEmail = (email: string) => http({ url: `/user/email/${email}`, method: 'get' })