import Netcall from '../../sdk/NIM_Web_Netcall_weixin_v5.8.0.js'

import { calculatePosition } from '../../utils/util.js'

const app = getApp()

Page({
  data: {
    role: '', // 加入方式
    ç: null, // {cid,uid,code}
    beauty: false, // 美颜标记
    enableCamera: true, // 开启摄像头标记
    muted: false, // 静音标记
    userlist: [], // 所有用户列表
    rtmpUrl: '', // 推流地址
    tempRtmpUrl: '', // 模式为3时，不进行推流，返回的推流地址暂存至此
    onTheCall: false, // 正在通话中标记
  },
  onLoad (option) {
    let self = this
    wx.setNavigationBarTitle({
      title: option.rome,
    })
    console.log(app.globalData.imInfo)
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    this.setData({
      role: app.globalData.imInfo.role == 0 ? 'host' : 'audience',
    })

    let netcall = Netcall.getInstance({ 
      debug: true,
      appkey: ''
    })
    netcall.destroy()
    netcall.joinChannel({
      channelName: app.globalData.imInfo.channelName,
      scene: 1, // 0:双人、1:多人
      accid: app.globalData.imInfo.accid,
      mode: 0,
      role: app.globalData.imInfo.role
    })
    .then((data) => {
      self.setData({
        channelInfo: data
      })
    })
    this.netcallInstance = netcall
    // 绑定netcall回调事件
    this._bindNetcallEvent()
  },
  onUnload() {
    if (this.data.onTheCall) {
      this.hangupHandler(true)
    }
  },
  _bindNetcallEvent() {
    this.netcallInstance.on('syncDone', (data) => {
      console.log('登录成功')
      console.log(data)
      if (data.userlist.length >= 10) {
        wx.showToast({
          title: '超过视频画面人数上限',
          duration: 3000,
          icon: 'none'
        })
        this.setData({
          onTheCall: true,
        })
        setTimeout(() => {
          wx.navigateBack(1)
        }, 3000)
        return
      }
      let templist = data.userlist
      if(this.data.role == 'audience') {
        // 观众情况下去除自己
        templist.map((user, index) => {
          if (user.uid == this.data.channelInfo.uid) {
            templist.splice(index, 1)
          }
        })
      }
      // 登录成功的回包中可能存在已经在房间中的账号
      let userlist = calculatePosition(templist, [], {
        uid: app.globalData.imInfo.uid
      })
      this.setData({
        onTheCall: true,
        userlist: userlist
      })
      console.log(userlist)
    })
    this.netcallInstance.on('clientLeave', (data) => {
      console.log('有人离开了，离开前：')
      console.log(this.data.userlist)

      this._personLeave(data)

      console.log('有人离开了，离开后：')
      console.log(this.data.userlist)
    })
    this.netcallInstance.on('clientJoin', (data) => {
      console.log('有人加入了')
      if (this.data.userlist.length >= 9) {
        wx.showToast({
          title: '超过视频画面人数上限',
          icon: 'none',
          duration: 2 * 1000
        })
        return
      }
      this._personJoin(data)
      console.log(this.data.userlist)
    })
    this.netcallInstance.on('clientUpdate', (data) => {
      console.log('有人更新了')
      console.log(data)
    })
    this.netcallInstance.on('error', (error) => {
      console.error('出错了')
      console.error(error)
      wx.showToast({
        title: '出错了，请退出重试！',
        duration: 2000,
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack(1)
      }, 2000)
    })
    this.netcallInstance.on('open', (data) => {
      console.log('socket建立成功')
    })
    this.netcallInstance.on('sendCommandOverTime', (data) => {
      console.log('发送命令超时')
    })
    this.netcallInstance.on('liveRoomClose', (data) => {
      console.log('互动直播房间解散了')
      console.log(data)
    })
  },
  _personJoin(data) {
    let uids = this.data.userlist.map(user => user.uid) || []
    if (uids.includes(data.uid) === false) {
      let userlist = calculatePosition([data], this.data.userlist, {
        uid: app.globalData.imInfo.uid
      })
      this.setData({
        userlist: userlist
      })
    }
  },
  _personLeave(data) {
    var userlist = Object.assign([], this.data.userlist)
    let uids = userlist.map(user => user.uid)
    if (uids.includes(data.uid) === false) {
      return
    }
    userlist.map((user, index) => {
      if (user.uid === data.uid) {
        userlist.splice(index, 1)
      }
    })
    userlist = calculatePosition([], userlist, {})
    this.setData({
      userlist
    })
  },
  /**
   * 返回指定uid组件的拉流操作上下文
   */
  _getPlayerComponent (uid) {
    const yunxinPlayer = this.selectComponent(`#yunxinplayer-${uid}`)
    return yunxinPlayer
  },
  /**
   * 返回推流组件的操作上下文
   */
  _getPusherComponent () {
    const yunxinPusher = this.selectComponent(`#yunxin-pusher`)
    return yunxinPusher
  },
  /**
   * 切换摄像头回调
   */
  switchCameraHandler() {
    if (this.data.role === 'audience') {return}
    this._getPusherComponent().switchCamera()
  },
  /**
   * 美颜回调
   */
  beautifyHandler() {
    if (this.data.role === 'audience') { return }
    this.setData({
      beauty: !this.data.beauty
    })
  },
  /**
   * 开关摄像头、麦克风回调
   * 0音视频，1纯音频，2纯视频，3静默
   */
  switchMeetingModeHandler(e) {
    if (this.data.role === 'audience') { return }
    let mode = e.currentTarget.dataset.mode
    let enableCamera = this.data.enableCamera
    let muted = this.data.muted
    if (mode == 1) { // 单击了关闭摄像头 => 纯音频
      enableCamera = !enableCamera
      if (enableCamera) { // 摄像头开启 => 关闭摄像头
        if (muted) {
          mode = 2
        } else {
          mode = 0
        }
      } else { // 摄像头关闭 => 开启摄像头
        if (muted) {
          mode = 3
        } else {
          mode = 1
        }
      }
    } else if (mode == 2) { // 单击了关闭麦克风 => 纯视频
      muted = !muted
      if (muted) { // 静音：false => true
        if (enableCamera) {
          mode = 2
        } else {
          mode = 3
        }
      } else { // true => false
        if (enableCamera) {
          mode = 0
        } else {
          mode = 1
        }
      }
    }
    // 切换本地状态
    this.setData({
      enableCamera,
      muted
    })
    this.netcallInstance.switchMode(mode)
      .then(() => {
        console.log('切换模式至 -> ', mode)
      })
      .catch((err) => {
        console.error(err)
      })
  },
  /**
   * 挂断通话
   */
  hangupHandler(notBack) {
    this.netcallInstance && this.netcallInstance.leaveChannel() // 兼容登录网关502错误离开房间
    this._getPusherComponent() && this._getPusherComponent().stop() // 停止推流
    // 停止拉流
    this.data.userlist.map((user) => {
      if (user.uid !== this.data.channelInfo.uid) {
        this._getPlayerComponent(user.uid) && this._getPlayerComponent(user.uid).stop()
      }
    })
    this.setData({
      onTheCall: false,
      userlist: []
    })
    if (notBack !== true) {
      wx.navigateBack(1)
    }
  },
})
