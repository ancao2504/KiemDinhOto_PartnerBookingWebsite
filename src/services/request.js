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

const token = () => {
  let isRefreshToken = false;

  const faultyDetection = () => {
    window.localStorage.clear()
    window.location.href = '/login'
  }

  const checkToken = async (token) => {
    let isBool = false;
    const headers = {};
    const dataString = JSON.parse(window.localStorage.getItem(addKeyLocalStorage('data')))
    headers.authorization = `Bearer ${token}`
    try {
      await axios({
        method: "POST",
        url: HOST + "/AppUsers/user/getDetailInfo",
        headers,
        data: {
          id: dataString.stationsId
        }
      }).then(() => {
        isBool = true;
      })
    } catch { }

    return isBool;
  }

  return {
    refreshToken: () => {

      // Check if RefreshToken has been called yet. If it has, do not call it again!
      if (isRefreshToken) {
        return;
      }

      isRefreshToken = true;
      const dataString = JSON.parse(window.localStorage.getItem(addKeyLocalStorage('data')))
      axios({
        method: "POST",
        url: HOST + "/AppUsers/user/refreshToken",
        data: {
          token: dataString.token
        }
      }).then(async (result) => {
        const data = result.data;
        const newData = { ...dataString };
        const { newToken } = data.data;
        newData.token = newToken;
        newData.userToken = newToken;

        // Call API: /Stations/advanceUser/getDetailById to check if the token has expired or for other reasons. 
        const isCheckToken = await checkToken(newToken);
        if (isCheckToken) {
          window.localStorage.setItem(addKeyLocalStorage('data'), JSON.stringify(newData))
          window.location.href = '/';
          isRefreshToken = false;
          return;
        }

        // If the token encounters any other issue, the 'faultyDetection' function will be executed.
        faultyDetection();
      }).catch((error) => {
        const { response = {} } = error
        const result = response.data ? response.data : null
        if (!result) {
        } else {
          const { statusCode, message: data } = result;
          faultyDetection();
        }
      })
    }
  }
}

const { refreshToken } = token();

function send({ method = 'get', path, data = null, query = null, headers = {}, newUrl, }) {
  return new Promise((resolve) => {
    let url = HOST + `${path}${getQueryString(query)}`
    if (newUrl) {
      url = `${newUrl}${getQueryString(query)}`
    }
    // headers.authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBVc2VySWQiOjUyOTksInVzZXJuYW1lIjoiMDM1ODcwNTk5NSIsImFjdGl2ZSI6MSwidG9rZW5UeXBlIjoibm9ybWFsVXNlciIsImlhdCI6MTcwMTY4MzgyNiwiZXhwIjoxNzA0Mjc1ODI2fQ.O1W6dPMJBDA9vxi78MGPLZ2lwfFQxi7ObYJSpFMSWmY`
      headers.apiKey =  '8badb9c3-dcd5-4a09-a9f0-7b7800c42a4c'
    axios({
      method,
      url,
      data,
      headers
    })
      .then((result) => {
        console.log(".then ~ result:", result)
        const data = result.data
        return resolve(data)
      })
      .catch((error) => {
        console.log("returnnewPromise ~ error:", error)
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
            refreshToken();
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
