import requset from '@/utils/request'

export const gethomedata = () => {
  return requset.get('/page/detail', {
    params: {
      platform: String
    }
  })
}
