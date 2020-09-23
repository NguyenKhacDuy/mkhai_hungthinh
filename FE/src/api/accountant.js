import request from '@/utils/request'

export function getWaitingPayLicense() {
    return request({
        url: '/api/license/getWaitingPayLicenseAccountant',
        method: 'get'
    })
}

export function getCompletedLicense(data) {
  return request({
    url: '/api/license/getCompletedLicenseAccountant',
    params: {
      size: data.size,
      page: data.page
    },
    method: 'get'
  })
}

export function approvePayLicense(idLicense) {
  let data = {
    id : idLicense
  }
  return request({
    url: '/api/license/approvePayLicense',
    method: 'post',
    data
  })
}

export function cancelLicense(license) {
  let data = {
    id: license.id,
    cancelReason: license.cancelReason
  }
  return request({
    url: '/api/license/cancelLicense',
    method: 'post',
    data
  })
}