import Fly from './flyio'

/** 
 * @requires flyio http请求工具
 * @param {Object} e - 小程序进行授权时，触发bindGetUserInfo函数的参数 - 必须
*/

const authorize = async function (e) {
  let openId = ''
  if (e.mp.detail.rawData) {
    // 用户按了允许授权按钮
    openId = await wxLogin()
  } else {
    // 用户按了拒绝按钮
    return {
      info: '用户拒绝授权',
      status: 'fail'
    }
  }
  return {
    openId: openId,
    status: 'success'
  }
}

// ------ 获取凭证 ------
function wxLogin () {
  return new Promise(resolve => {
    wx.login({
      success: res => {
        let code = res.code
        if (code) {
          getUserInfo(code)
            .then((r) => {
              resolve(r)
            }).catch((e) => {
              console.log(e)
            })
        } else {
          return res.errMsg
        }
      }
    })
  })
}

// 请求后台验证身份
function getUserInfo (code) {
  return new Promise(resolve => {
    wx.getUserInfo({
      success: function (res) {
        getData(code, res)
          .then((r) => {
            resolve(r)
          }).catch((e) => {
            console.log(e)
          })
      }
    })
  })
}

// 存放用户标识openId并返回
function getData (code, res) {
  return new Promise(resolve => {
    Fly.post('/mp/mpuser/saveBasicUser', {
      code: code,
      iv: res.iv,
      encryptedData: res.encryptedData
    })
      .then((res) => {
        if (res.data.status === 'success') {
          let data = JSON.parse(res.data.data).userInfo
          wx.setStorage({
            key: 'openId',
            data: data.openId
          })
          resolve(data.openId)
        }
      }).catch((err) => {
        return err
      })
  })
}

export default authorize
