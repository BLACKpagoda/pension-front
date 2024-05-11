// pages/demo/demo.js
import {
  CourseModel
} from '../../model/course';
import {
  Activity
} from '../../model/activity';

var courseModel = new CourseModel();
var activityModel = new Activity();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleData: [],
    videoData: [],
    page: 1,
    loading: false,
    res: []
  },

  getAct() {
    activityModel.getactivity('晋中市榆次区')
      .then(res => {
        this.setData({
          res
        })
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAct();
    // this.requestData();
  },

  requestData() {
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
            this.data.page++
            wx.hideLoading();
          })
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.openLoading();
    console.log(this.data.page);
    console.log(222);
    if (this.data.flag) {
      this._showLoading();
    }
    setTimeout(() => {
      if (true) {
        courseModel.getArtCourse(this.data.page)
          .then((res) => {
            console.log("page " + this.data.page)
            if (res.length < 6) {
              console.log('没有更多文章数据');
              return;
            }
            this.setData({
              articleData: this.data.articleData.concat(res),
            });
          });
        if (true) {
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

              let i = ((this.data.page - 1) * 2) - 2;
              //  1   2   3   4
              let status1 = courseModel.getCollectStatus(res[0]._id, "video");
              //    0 1 2 3 4 5 6 7 8 9
              let status2 = courseModel.getCollectStatus(res[1]._id, "video");
              Promise.all([status1, status2])
                .then((res) => {
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
                  this.closeLoading()
                })
            })
        }
        this.data.page++;
      }
    }, 1500); //1.5秒之后开始加载 加载完成之后隐藏loading
  },


  openLoading() {
    this.setData({
      loading: true
    })
  },

  closeLoading() {
    this.setData({
      loading: false
    })
  },

})