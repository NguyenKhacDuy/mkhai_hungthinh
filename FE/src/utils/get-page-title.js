import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Công ty vận tải Hưng Thịnh'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
