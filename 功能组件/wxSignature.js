const wx = require('weixin-js-sdk')

/**
 * @requires moduleName:weixin-js-sdk
 * @param {Object} httpTool - 传入axios，如果需要使用其他http工具，可以修改代码中的请求 - 必须
 * @param {String} appid - 公众号对应的appid - 必须
 * @param {String} url - 需要签名页面的url，hash模式下需要location.href.split('#')[0]进行处理 - 必须
 * @param {String} shareInfo - 分享设置的信息 - 必须
 */

wx.setWxConfig = function (httpTool, appid, url, shareInfo) {
  url = encodeURIComponent(url)
  // 如果需要使用其他http工具或者接口url更改，可以修改代码中的请求
  httpTool.get(`/api/wx/getJSAPITicket?useUrl=${url}`, {
    data: {
      notInterceptors: true // notInterceptors，跳过axios全局拦截器
    }
  }).then((res) => {
    const appId = appid
    const nonceStr = res.noncestr
    const signature = res.signature
    const timestamp = res.timestamp
    wx.config({
      // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature,// 必填，签名
      jsApiList: [ // 必填，需要使用的JS接口列表
        'JSAPI',
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
        'getLocation',
        'openLocation',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'onVoicePlayEnd',
        'uploadVoice',
        'hideMenuItems',
        'translateVoice'
      ]
    })
    // 旧版本，有个图片上传ios回显的兼容问题，新版本有问题，先保留
    wx.onMenuShareTimeline({
      title: shareInfo, // 分享标题
      link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    })
    wx.onMenuShareAppMessage({
      title: shareInfo, // 分享标题
      desc: shareInfo, // 分享描述
      link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    })
    // 新版本，写上再说
    // wx.updateAppMessageShareData({
    //   title: shareInfo, // 分享标题
    //   desc: shareInfo, // 分享描述
    //   link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    // })
    // wx.updateTimelineShareData({
    //   title: shareInfo, // 分享标题
    //   desc: shareInfo, // 分享描述
    //   link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    // })
  })
}

export default wx