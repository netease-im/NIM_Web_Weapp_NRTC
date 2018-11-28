// components/yunxin-pusher/yunxin-pusher.js
// const Utils = require("../../utils/util.js")

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
    minBitrate: {
      type: Number,
      value: 200
    },
    maxBitrate: {
      type: Number,
      value: 500
    },
    enableCamera: {
      type: Boolean,
      value: true
    },
    muted: {
      type: Boolean,
      value: false
    },
    beauty: {
      type: Number,
      value: 0
    },
    whiteness: {
      type: Number,
      value: 0
    },
    aspect: {
      type: String,
      value: "3:4"
    },
    /**
     * 加载状态：loading、ready、error
     */
    status: {
      type: String,
      value: "loading",
      observer: function (newVal, oldVal, changedPath) {
        // Utils.log(`player status changed from ${oldVal} to ${newVal}`);
      }
    },
    url: {
      type: String,
      value: "",
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        // Utils.log(`pusher url changed from ${oldVal} to ${newVal}, path: ${changedPath}`);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    livePusherContext: null, // 组件操作上下文
    detached: false // 组件是否被移除标记
  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    /**
     * 在组件实例被从页面节点树移除时执行
     */
    detached: function () {
      // Utils.log("pusher detached");
      // auto stop pusher when detached
      this.data.livePusherContext && this.data.livePusherContext.stop()
      this.data.detached = true
    },
    /**
     * 在组件布局完成后执行，此时可以获取节点信息
     */
    attached: function () {
      // Utils.log("pusher ready")
      if (!this.data.livePusherContext) {
        this.data.livePusherContext = wx.createLivePusherContext(this)
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 播放推流
     * 一般情况下不应手动调用，在推流组件预备好后会自动被调用
     */
    start() {
      // Utils.log(`starting pusher`);
      this.data.livePusherContext.stop()
      if (this.data.detached) {
        Utils.log(`try to start pusher while component already detached`)
        return
      }
      this.data.livePusherContext.start()
    },
    /**
     * 停止推流
     */
    stop() {
      // Utils.log(`stopping pusher`);
      this.data.livePusherContext.stop()
    },
    /**
     * 切换前后摄像头
     */
    switchCamera() {
      this.data.livePusherContext.switchCamera()
    },
    /**
     * 快照
     */
    snapshot() {
      this.data.livePusherContext.snapshot()
    },

    /**
     * 推流状态变化事件回调
     */
    stateChangeHandler(e) {
      // Utils.log(`live-pusher code: ${e.detail.code} - ${e.detail.message}`)
      if (e.detail.code === -1307) { // 网络断连，且经多次重连抢救无效，更多重试请自行重启推
        // Utils.log('live-pusher stopped', "error");
        this.setData({
          status: "error"
        })
        this.triggerEvent('pushfailed');
      } else if (e.detail.code === 1008) { // 编码器启动
        // Utils.log(`live-pusher started`);
        if (this.data.status === "loading") {
          this.setData({
            status: "ready"
          })
        }
      }
    },
    /**
     * 网络状态通知回调
     */
    netChangeHandler(e) {
      // Utils.log(`network: ${JSON.stringify(e.detail)}`);
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
