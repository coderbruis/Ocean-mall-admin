import request from '@/utils/request'

export function login(data) {
  return request({
    // mock
    url: '/user/login',
    // url: '/oauth/oauth/token',
    method: 'post',
    data
  })
}

export function getInfo(access_token) {
  return request({
    // mock
    url: '/user/info',
    // url: '/api/order/currentUser',
    method: 'get',
    params: { access_token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
