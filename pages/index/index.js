// pages/recommend/recommend.js
import {
  CourseModel
} from '../../model/course.js';
import utils from '../../utils/utils'

var courseModel = new CourseModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //课程数据
    articleData: null,
    videoData: null,
    //默认true显示推荐 点击之后变成false表示收藏 用来切换分类和推荐
    RorT: true,
    //上拉加载更多
    loading: false,
    //页数
    page: 1,
    //防止请求发送多次 true 可以请求 false 没得数据
    flag: true,
    //视频锁
    videoFlag: true,
    //收藏状态 写在videoData中
    // 是否正在搜索
    searching: false,
    //菜单栏
    fixed: true, //默认一开始不固定
    scrollTop: 0,
    hidebox: true, //默认一开始隐藏盒子
    hide: false, //默认一开始不隐藏
    // 分类
    tagData: 0
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
  //分类推荐切换
  switchType(e) {
    if (e.detail.RorT == false) {
      // 获取最新分类
      this.setTag();
      this._lock();
    } else {
      this._unlock();
    }

    this.setData({
      RorT: e.detail.RorT,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData();
    this.data.page++;
  },

  requestData() {
    console.log(this.data.page);
    wx.showLoading({
      title: "正在刷新",
      mask: true
    });
    const article = courseModel.getArtCourse(this.data.page);
    const video = courseModel.getVideoCourse(this.data.page);
    Promise.all([article, video])
      .then((res) => {
        this.setData({
          articleData: res[0],
          videoData: res[1]
        })
        var status1 = courseModel.getCollectStatus(res[1][0]._id, "video");
        var status2 = courseModel.getCollectStatus(res[1][1]._id, "video");
        Promise.all([status1, status2])
          .then((res) => {
            let tempData = this.data.videoData
            if (res[0].code == 300) {
              tempData[0].collect_status = true //true 表示收藏过 
            } else if (res.code == 200) {
              tempData[0].collect_status = false //false 表示收藏过 
            }
            if (res[1].code == 300) {
              tempData[1].collect_status = true //true 表示收藏过 
            } else if (res.code == 200) {
              tempData[1].collect_status = false //false 表示收藏过 
            }
            this.setData({
              videoData: tempData
            })
            wx.hideLoading();
          })
      })
  },

  typeArticle(e) {
    wx.navigateTo({
      url: '../course/course?tag=' + e.detail.tag,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    this._lock();
    this.requestData();
    this.data.page++;
    this._unlock();
    this._unVideoLock();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },
  //收藏
  doCollect(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let index = 0;
    courseModel.doCollect(id, "video")
      .then((res) => {
        if (res.code == 200) {
          for (var i = 0; i < this.data.videoData.length; i++) {
            if (this.data.videoData[i]._id == id) {
              index = i;
            }
          }
          let temp = this.data.videoData;
          temp[index].collect_status = true
          this.setData({
            videoData: temp
          })
        }
      })
  },
  //取消收藏
  deleteCollect(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let index = 0;
    courseModel.deleteCollect(id, "video")
      .then((res) => {
        if (res.code == 200) {
          for (var i = 0; i < this.data.videoData.length; i++) {
            if (this.data.videoData[i]._id == id) {
              index = i;
            }
          }
          let temp = this.data.videoData;
          temp[index].collect_status = false
          this.setData({
            videoData: temp
          })
          console.log('取消点赞成功');
        }
      })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      more: utils.random(16)
    })
    if (this.data.flag) {
      this._showLoading();
    }
    setTimeout(() => {
      if (this.data.flag) {
        this._lock();
        courseModel.getArtCourse(this.data.page)
          .then((res) => {
            console.log("page " + this.data.page)
            if (res.length < 6) {
              console.log('没有更多文章数据');
              return;
            }
            this.setData({
              articleData: this.data.articleData.concat(res),
            }); // 1   2   3 
            // 0 1 2 3 4 5 6
          });
        if (this.data.videoFlag) {
          courseModel.getVideoCourse(this.data.page)
            .then((res) => {
              if (res.length < 2) {
                this._vidoeLock()
                console.log('没有更多视频数据');
                this._unlock(); //文章比视频多
                return;
              }
              this.setData({
                videoData: this.data.videoData.concat(res),
              });
              console.log("haha" + this.data.page);
              let i = (this.data.page * 2) - 2;
              //  1   2   3   4
              let status1 = courseModel.getCollectStatus(res[0]._id, "video");
              //    0 1 2 3 4 5 6 7 8 9
              let status2 = courseModel.getCollectStatus(res[1]._id, "video");
              Promise.all([status1, status2])
                .then((res) => {
                  console.log(this.data.page + "meme");
                  let tempData = this.data.videoData;
                  if (res[0].code == 300) {
                    tempData[i].collect_status = true //true 表示收藏过 
                    console.log(tempData[i].collect_status)
                  } else if (res.code == 200) {
                    tempData[i].collect_status = false //false 表示收藏过
                    console.log(tempData[i].collect_status)
                  }
                  if (res[1].code == 300) {
                    tempData[(i + 1)].collect_status = true //true 表示收藏过 
                    console.log(tempData[i].collect_status)
                  } else if (res.code == 200) {
                    tempData[(i + 1)].collect_status = false //false 表示收藏过 
                    console.log(tempData[i].collect_status)
                  }
                  this.setData({
                    videoData: tempData
                  })
                  this._hideLoading();
                  this.data.page++;
                })
            })
        }
        console.log("dinyijie");
        this._unlock();
      }
    }, 1500); //1.5秒之后开始加载 加载完成之后隐藏loading
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPageScroll: function (e) {
    var _this = this;
    // if (e.scrollTop <= 160) {
    //   this.setData({
    //     fixed: true, //小于180时  是否隐藏盒子 是 是否为fixed 是
    //     hidebox: true,
    //   })
    // }
    //判断浏览器滚动条上下滚动
    if (e.scrollTop > this.data.scrollTop || e.scrollTop == wx.getSystemInfoSync().windowHeight) {
      //向下滚动
      if (e.scrollTop <= 160) {
        this.setData({
          fixed: true, //小于180时  是否隐藏盒子 是 是否为fixed 是
          hidebox: true,
        })
      }
      if (e.scrollTop > 160) {
        _this.setData({
          hide: true,
          fixed: false,
          hidebox: false
        })
      }
    } else {
      if (e.scrollTop <= 160) {
        // this.setData({
        //   fixed: true, //小于180时  是否隐藏盒子 是 是否为fixed 是
        //   hidebox: true,
        // })
      }
      if (e.scrollTop > 160) {
        _this.setData({
          fixed: false,
          hide: false,
          hidebox: false
        })
      }
      //向上滚动
    }
    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: e.scrollTop
      })
    }, 100)
  },
  setTag() {
    courseModel.getTag()
      .then(res => {
        this.setData({
          tagData: res
        })
        return res
      })
  },

  _showLoading() {
    //显示加载动画
    this.setData({
      loading: true
    });
  },
  _hideLoading() {
    //隐藏加载动画
    this.setData({
      loading: false
    });
  },
  //防止被多次请求
  _lock() {
    this.setData({
      flag: false
    });
  },
  _unlock() {
    this.setData({
      flag: true
    })
  },
  //防止视频没有之后被多次请求
  _vidoeLock() {
    this.setData({
      videoFlag: false
    });
  },
  _unVideoLock() {
    this.setData({
      videoFlag: true
    })
  },
  //搜索
  toSearch() {
    this.setData({
      searching: true
    })
    this._lock();
  },
  // 一键回到顶部
  toTop: function (e) {
    this.setData({
      fixed: true, //小于180时  是否隐藏盒子 是 是否为fixed 是
      hidebox: true,
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 2000
    })
  },
  backSearch() {
    this.setData({
      searching: false
    })
    this._unlock();
  },
})