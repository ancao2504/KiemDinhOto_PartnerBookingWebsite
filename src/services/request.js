import axios from 'axios'
import { HOST } from './../constants/url'
import { IS_ZALO_MINI_APP } from '../constants/global'
import { getQueryString } from '../helper/common'
import addKeyLocalStorage from './../helper/localStorage'

function cleanUp() {
  window.localStorage.clear()
  if (IS_ZALO_MINI_APP) {
    window.location.reload()
  } else {
    window.location.href = '/login'
  }
}

function send({ method = 'get', path, data = null, query = null, headers = {}, newUrl, }) {
  return new Promise((resolve) => {
    let _query={
      ...query,
      apikey : '2898a2a7-bdde-414a-8ef8-272328be6c82'
    }
    let url = HOST + `${path}${getQueryString(_query)}`
    if (newUrl) {
      url = `${newUrl}${getQueryString(_query)}`
    }
    axios({
      method,
      url,
      data,
      headers
    })
      .then((result) => {
        const data = result.data
        return resolve(data)
      })
      .catch((error) => {
        const { response = {} } = error
        const result = response.data ? response.data : null
        if (!result) {
        } else {
          const { statusCode, message: data } = result

          if (statusCode === 401) {
            setTimeout(() => {
              cleanUp()
            }, 1000)
          } else if ((statusCode === 401 && data === 'Unauthorized') || (statusCode === 403 && data === 'InvalidToken')) {
            cleanUp()
          } else if (statusCode === 505) {
            return resolve(result)
          } else if (statusCode === 500) {
            return resolve(result)
          } else {
            return resolve(result)
          }
        }
      })
  })
}


export default {
  send,
}
