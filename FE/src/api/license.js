import request from '@/utils/requestLicense'

export function createLicense(data) {
  return request({
    url: '/api/license/createLicense',
    method: 'post',
    data
  })
}

export function updateLicense(data) {
  return request({
    url: '/api/license/updateLicense',
    method: 'post',
    data
  })
}