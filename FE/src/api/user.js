import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function changePassword(data){
  return request({
    url: '/api/user/changePassword',
    method: 'put',
    data
  })
}

export function getAllUser() {
  return request({
    url: '/api/user/getAllUser',
    method: 'get'
  })
}

export function addNewUser(data) {
  return request({
    url: '/api/user/createUser',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/api/user/updateUser',
    method: 'put',
    data
  })
}

export function removeUser(id) {
  let data = {
    userId: id
  }
  return request({
    url: '/api/user/removeUsers',
    method: 'put',
    data
  })
}
