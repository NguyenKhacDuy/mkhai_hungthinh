import request from '@/utils/requestLicense'

import requestManageNoti from '@/utils/request'

export function createNotification(data,param) {
  return request({
    url: '/api/document/createDocument?type=' + param,
    method: 'post',
    data
  })
}

export function getAllMeetingSchedule(data) {
  const {page, size} = data
  return requestManageNoti({
    url: '/api/document/getAllMeetingSchedule?page=' + `${page}` + '&size=' + `${size}`,
    method: 'get'
  })
}

export function getAllNoti(data) {
  const {page, size} = data
  return requestManageNoti({
    url: '/api/document/getAllNoti?page=' + `${page}` + '&size=' + `${size}`,
    method: 'get'
  })
}

export function getAllTranningDocs(data) {
  const {page, size} = data
  return requestManageNoti({
    url: '/api/document/getAllTrainingDocument?page=' + `${page}` + '&size=' + `${size}`,
    method: 'get'
  })
}

export function deleteDocs(data) {
  return requestManageNoti({
    url: '/api/document/deleteDocument',
    method: 'post',
    data
  })
}

export function getLatestMettingSchedule() {
  return requestManageNoti({
    url: '/api/document/getLatestMeetingSchedule',
    method: 'get'
  })
}

export function download(data) {
  return requestManageNoti({
    url: '/api/document/download',
    method: 'post',
    responseType: 'blob',
    data
  })
}