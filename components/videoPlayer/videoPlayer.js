// components/videoPlayer/videoPlayer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoData: {
      type: Object,
      observer: () => {
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    videoPlay: function (e) {
      console.log(e);
      var _index = e.currentTarget.dataset.id
      console.log(_index);
      this.setData({
        _index: _index
      })
      //停止正在播放的视频
      var videoContextPrev = wx.createVideoContext(_index + "")
      videoContextPrev.stop();
      setTimeout(function () {
        console.log(_index);
        //将点击视频进行播放
        var videoContext = wx.createVideoContext(_index + "")
        videoContext.play();
      }, 500)
    },
  }
})
