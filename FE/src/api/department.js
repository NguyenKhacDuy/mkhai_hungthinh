import request from '@/utils/request'

export function getAllDepartment() {
  return request({
    url: '/api/department/getAllDepartment',
    method: 'get'
  })
}

export function addDepartment(data) {
  return request({
    url: '/api/department/createDepartment',
    method: 'post',
    data
  })
}

export function removeDepartment(data) {
  return request({
    url: '/api/department/removeDepartment',
    method: 'post',
    data
  })
}