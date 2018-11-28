//app.js
App({
  onLaunch: function () {
    let systemInfo = wx.getSystemInfoSync()
    this.globalData.videoContainerSize = {
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight - 80
    }
  },
  globalData: {
    userInfo: null,
    channelInfo: {},
    imInfo: {}, // 会话配置信息
  }
})
/**
 * 房间信息
 * channelInfo: {
 *  cid,
 *  config:{
 *    audio:[{rate:13000,op:'upper',net:'2g'}],
 *    video:[{rate:13000,op:'upper',net:'2g'}],
 *    net:{audio_fec_rate,dtunnel,fec,p2p,pacing,qos,record,tunnel},
 *    quality_level_limit,
 *    sdk:{gpl}
 *  },
 * ips,token}
 * 通话配置信息
 * imInfo:{
 *  cid,uid,liveEnable,rtmpUrl
 * }
 */