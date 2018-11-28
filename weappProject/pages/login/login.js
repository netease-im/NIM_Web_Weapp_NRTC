import { showToast } from '../../utils/util.js'

const app = getApp()
Page({
  data: {
    uid: Math.floor(Math.random() * 10000),
    channelName: '',
    role: 0, // 加入时角色
    roleArrayIndex: 0,
    roleArray: [
      { value: 0, desc: '主播' },
      { value: 1, desc: '观众' }
    ],
    isJoining: false
  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      app.globalData.userInfo = userInfo
    }
  },
  /**
   * 用户单击加入房间
   */
  joinHandler(e) {
    let self = this
    if (e.detail.userInfo) {
      if (!app.globalData.userInfo) {
        app.globalData.userInfo = e.detail.userInfo
        wx.setStorage({
          key: 'userInfo',
          data: e.detail.userInfo,
        })
        this.setData({
          userInfo: e.detail.userInfo
        })
      }
      wx.showModal({
        title: '是否推流',
        content: '选择取消则作为观众加入，观众模式不推流',
        success(res) {
          self.setData({
            role: res.confirm ? 0 : 1
          })
          // 加入房间逻辑
          self.joinChannel()
        }
      })
    } else {
      showToast('text', '清先授权')
    }
  },
  /**
   * 输入房间名
   */
  roomInputHandler(e) {
    this.setData({
      channelName: e.detail.value
    })
  },  
  /**
   * 切换角色
   */
  roleArrayHandler(e) {
    console.log('切换角色:', e.detail.value)
    let role = parseInt(e.detail.value)
    this.setData({
      role
    })
  },
  /**
   * 加入房间逻辑
   */
  joinChannel() {
    if (this.data.channelName) {
      this._generateJoinChannelParameter()
      wx.navigateTo({
        url: `/pages/room/room?rome=${this.data.channelName}`
      })
    } else {
      showToast('text', '请输入房间号')
    }
  },
  _generateJoinChannelParameter(channelInfo) {
    // 存储到全局，方便下一页面调用
    app.globalData.imInfo.channelName = this.data.channelName
    app.globalData.imInfo.accid = (app.globalData.userInfo && app.globalData.userInfo.nickName) || 'unknow'
    app.globalData.imInfo.role = this.data.role
  },
})