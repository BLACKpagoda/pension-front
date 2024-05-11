// pages/my/my.js
import * as video from '../../model/video.js';
import {
  MyModel
} from '../../model/my.js';
const myModel = new MyModel();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    default: "../../images/my/avatar-pre.png",
    login: false,
    userInfo: null,
    myArticleData: null,
    myVideoData: null,
    //默认显示活动 false表示收藏
    AorC: true,
    //我的收藏里视频和文章切换
    articleS: false,
    videoS: false,
    //当用户收藏的视频为空时 将视频黑框框隐藏
    hideVideo: true,
    drop1:false,
    drop2:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getAuthorized();
    this.requestMyData();

  },
  
  requestMyData() {
    myModel.getMyArtCourse()
      .then((res) => {
        console.log(res);
        this.setData({
          myArticleData: res,
        })
      })
    myModel.getMyVideoCourse()
      .then((res) => {
        console.log(res)
        if (res.length == 0) {
          this.setData({
            hideVideo: false
          });
          return;
        } else {
          this.setData({
            myVideoData: res,
            hideVideo: true
          })
        }
      })
  },

  getAuthorized() {
    let login = wx.getStorageSync('login');
    if (login) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        login,
        userInfo
      })
      return
    }
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (result) => {
              let userInfo = result.userInfo;
              this.setData({
                login: true,
                userInfo
              })
            }
          });
        } else {
          // 没有授权
          console.log('没有授权');
        }
      },
    });
  },
  onPullDownRefresh: function () {
    this.requestMyData();
    wx.showLoading({
      title: "刷新",
      mask: true,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },
  toLogin() {
    wx.navigateTo({
      url: '../login/login',
    });
  },
  switchMyType(e) {
    this.setData({
      AorC: e.detail.AorC
    });
    console.log(this.data.AorC)
  },
  videoPlay: function (e) {
    var _index = e.currentTarget.dataset.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(_index + "")
    videoContextPrev.stop();
    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index + "")
      videoContext.play();
    }, 500)
  },
  onArticle() {
    this.setData({
      articleS: !(this.data.articleS)
    })
  },
  onVideo() {
    this.setData({
      videoS: !(this.data.videoS)
    })
  },
  // 活动
  realease:function(){
    this.setData({
      drop1:!this.data.drop1
    })
  },
  participart:function(){
    this.setData({
      drop2:!this.data.drop2
    })
  },
})
