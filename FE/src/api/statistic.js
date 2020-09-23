import request from '@/utils/request'

export function statisticByUser(data) {
  return request({
    url: '/api/license/statisticUser',
    method: 'post',
    data
  })
}

export function statisticByDept(data) {
  return request({
    url: '/api/license/statisticDepartment',
    method: 'post',
    data
  })
}