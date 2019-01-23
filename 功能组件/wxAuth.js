/**
 * 
 * @param {Object} httpTool - 传入axios，如果需要使用其他http工具，可以修改代码中的请求 - 必须
 * @param {String} appid - 公众号对应的appid - 必须
 * @param {String} url - 当前页面的完整url - 必须
 * @param {String} sessionStorageName - sessionStorage存储openId的名字 - 必须
 * @returns {Promise} - 成功则resolve(openid)
 */
function auth (httpTool, appid, url, sessionStorageName) {
  return new Promise(resolve => {
    let openId = sessionStorage.getItem(sessionStorageName)
    let hasCode = location.href.match(/code=(\S*)&state=ok/) // 返回url带有code
    if (openId) { // 检索存储在本地的数据
      resolve(openId)
    } else if (hasCode) {
      let code = hasCode[1] // 提取code
      httpTool.get(`/api/wx/getUserInfo?code=${code}`).then((res) => { // 向后台换取openId
        sessionStorage.setItem(sessionStorageName, res)
        resolve(res)
      })
    } else {
      const redirect_uri = encodeURIComponent(url)
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=ok#wechat_redirect`
    }
  })
}

export default auth