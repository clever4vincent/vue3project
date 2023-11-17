import { BASE_API_URL } from '../api'

export const get = async (url, query, token) => {
  // remove empty query
  let headers = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
  }

  if (query) {
    Object.keys(query).forEach((key) => {
      if (!query[key] || query[key] === '') {
        delete query[key]
      }
    })
    if (Object.keys(query).length > 0) {
      url += '?' + new URLSearchParams(query).toString()
    }
  }
  return await fetch(`${BASE_API_URL}${url}`, {
    method: 'GET',
    headers: headers
  }).then((res) => {
    if (res.status === 401) {
      // token不对，需要重新登录
      console.log('token不对，需要重新登录')
    } else if (res.status === 502) {
      return {
        success: false,
        message: '服务器维护中'
      }
    }
    return res.json()
  })
}

export const post = async (url, data, token) => {
  let headers = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
  }

  return await fetch(`${BASE_API_URL}${url}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  }).then((res) => {
    if (res.status === 401) {
      // token不对，需要重新登录
      console.log('token不对，需要重新登录')
    } else if (res.status === 502) {
      return {
        success: false,
        message: '服务器维护中'
      }
    }
    return res.json()
  })
}

export const getTokenInfo = function (token) {
  const base64Url = token.split('.')[1]
  const base64 = encodeURIComponent(base64Url).replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}
export default { get, post, getTokenInfo }
