import request from '@/utils/request'

export function getWaitingApproveLicense() {
    return request({
        url: '/api/license/getWaitingApproveLicenseApprover',
        method: 'get'
    })
}

export function getApprovedLicense() {
  return request({
    url: '/api/license/getApprovedLicenseApprover',
    method: 'get'
  })
}

export function getCompletedLicense(data) {
  return request({
    url: '/api/license/getCompletedLicenseApprover',
    params: {
      page: data.page,
      size: data.size
    },
    method: 'get'
  })
}

export function approveLicense(idLicense) {
  let data = {
    id : idLicense
  }
  return request({
    url: '/api/license/approveLicense',
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

export function getBill(data) {
    return request({
      url: '/api/license/getBill',
      method: 'post',
      responseType: 'blob',
      data
    })
  }

export function downloadImage(data) {
  return request({
    url: '/api/license/downloadImage',
    method: 'post',
    responseType: 'blob',
    data
  })
}