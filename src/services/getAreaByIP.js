import Request from './request'

export default class AreaByIP {
  static async getAreaByIP(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/Stations/getAreaByIP',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          return resolve(result)
        }
      })
    })
  }
}
