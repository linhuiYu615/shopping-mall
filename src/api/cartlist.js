import request from '@/utils/request'

export const getcartlist = () => {
  return request.post('/cart/list')
}
