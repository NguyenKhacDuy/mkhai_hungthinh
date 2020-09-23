import request from '@/utils/request'

export function getLicenseExecuting() {
    return request({
        url: '/api/license/getExecutingLicenseCreator',
        method: 'get'
    })
}

export function getLicenseExecuted(data) {
    return request({
        url: '/api/license/getExecutedLicenseCreator',
        params: {
          page: data.page,
          size: data.size
        },
        method: 'get'
    })
}
export function deleteLicense(IdLicense) {
  let data = {
    id: IdLicense
  }
  return request({
    url: '/api/license/deleteLicense',
    method: 'post',
    data
  })
}
