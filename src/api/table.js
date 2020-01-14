import request from '@/utils/request'
import axios from 'axios'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
