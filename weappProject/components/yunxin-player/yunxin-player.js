// components/agora-player/agora-player.js
// const Utils = require('../../utils/util.js')
Component({
  properties: {
    config: {
      type: Object,
      value: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    },
    debug: {
      type: Boolean,
      value: false
    },
    /**
     * 加载状态：loading、ready、error
     */
    status: {
      type: String,
      value: 'loading',
      observer: function (newVal, oldVal, changedPath) {
        // Utils.log(`player status changed from ${oldVal} to ${newVal}`)
      }
    },
    /**
     * 画面方向，可选值有 vertical，horizontal
     */
    orientation: {
      type: String,
      value: 'vertical'
    },
    objectFit: {
      type: String,
      value: 'fillCrop'
      // value: 'contain'
    },
    name: {
      type: String,
      value: ''
    },
    uid: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        // Utils.log(`player url changed from ${oldVal} to ${newVal}, path: ${changedPath}`)
      }
    }
  },

  data: {
    livePlayerContext: null, // 组件操作上下文
    detached: false // 组件是否被移除标记
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 组件生命周期：在组件布局完成后执行，此时可以获取节点信息
     */
    ready() {
      // Utils.log(`player ${this.data.uid} ready`)
      if (this.data.livePlayerContext) {
        this.data.livePlayerContext = wx.createLivePlayerContext(`yunxinplayer-${this.data.uid}`, this)
      }
      // 组件加载完毕时拉流地址就绪，直接播放
      if (this.data.url) {
        this.start()
      }
    },
    /**
     * 组件生命周期：在组件实例被从页面节点树移除时执行
     */
    detached() {
      // Utils.log(`player ${this.data.uid} detached`)
      // auto stop player when detached
      this.data.livePlayerContext && this.data.livePlayerContext.stop()
      this.data.detached = true
    },

    /**
     * 开始拉流播放
     */
    start() {
      const uid = this.data.uid
      // Utils.log(`starting player ${uid}`)
      if (this.data.status === 'ready') {
        // Utils.log(`player ${uid} already started`)
        return
      }
      if (this.data.detached) {
        // Utils.log(`try to start pusher while component already detached`)
        return
      }
      this.data.livePlayerContext.play()
    },
    /**
     * 停止拉流播放
     */
    stop() {
      const uid = this.data.uid
      // Utils.log(`stopping player ${uid}`)
      this.data.livePlayerContext && this.data.livePlayerContext.stop()
    },
    /**
     * 切换画面方向
     * true为 horizontal，false为 vertical
     */
    changeOrientation(isHorizontal) {
      let orientation = isHorizontal ? 'horizontal' : 'vertical'
      // Utils.log(`rotation: ${rotation}, orientation: ${orientation}, uid: ${this.data.uid}`)
      this.setData({
        orientation: orientation
      })
    },
    /**
     * 切换填充模式
     * true为 fillCrop，false为 contain
     */
    changeObjectFit(isFillCrop) {
      let objectFit = isFillCrop ? 'fillCrop' : 'contain'
      // Utils.log(`rotation: ${rotation}, orientation: ${orientation}, uid: ${this.data.uid}`)
      this.setData({
        objectFit: objectFit
      })
    },
    /**
     * 播放器状态更新回调
     */
    stateChangeHandler(e) {
      // Utils.log(`live-player id: ${e.target.id}, code: ${e.detail.code}`)
      let uid = parseInt(e.target.id.split('-')[1])
      if (e.detail.code === 2004) { // 视频播放开始
        // Utils.log(`live-player ${uid} started playing`)
        if (this.data.status === 'loading') {
          this.setData({
            status: 'ready'
          })
        }
      } else if (e.detail.code === -2301) { // 网络断连，且经多次重连抢救无效，更多重试请自行重启播放
        // Utils.log(`live-player ${uid} stopped`, 'error')
        this.setData({
          status: 'error'
        })
      }
    },
    /**
     * 开启调试
     */
    toggleDebug(isDebug) {
      this.setData({
        debug: isDebug
      })
    }
  }
})
