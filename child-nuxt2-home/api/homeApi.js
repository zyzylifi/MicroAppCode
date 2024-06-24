import http from '@/utils/http'

// 首页接口
const getIndexData = (params) => { 
  return http.getJson('/api/index/getIndexData',params).then(res => res.data)
}

export default {
  getIndexData
}