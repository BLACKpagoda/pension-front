// pages/details/detalis.js
import {
  CourseModel
} from '../../model/course.js'
const course = new CourseModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // fontSize: 20,
    data: null,
    collectStatus:null,
    // collectStatus:{
    //   status:"true",
    //   img:"../../images/collect/yes.png",
    //   text:"已收藏"
    // },
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
//    wx.hideLoading();

    course.getArticleDetail(options.id)
    .then(res => {
        console.log(res);
        this.setData({
          data: res,
          id:options.id
        })
      })
    course.getCollectStatus(options.id,"article")
      .then((res) => {
        console.log(res)
          if(res.code == 300){
            this.setData({
              collectStatus:{status:true,img:"../../images/collect/yes.png",text:"已收藏"}
            })
            console.log(this.data.collectStatus)
          }else if(res.code == 200){
            this.setData({
              collectStatus:{status:false,img:"../../images/collect/no.png",text:"收藏"}
            })
            console.log(this.data.collectStatus)
          }
      })
  },  
  deleteCollect(){
    console.log(this.data.collectStatus)
    course.deleteCollect(this.data.id,"article")
      .then((res) => {
        console.log(res);
        if(res.code == 200){
          this.setData({
            collectStatus:{status:false,img:"../../images/collect/no.png",text:"收藏"}            
          })
          console.log(this.data.collectStatus)
        }else if(res.code == 400){
            wx.showToast({
              title: '取消失败，请重试',
              icon: 'none',
              duration: 1500,
              mask: false
          })
        }
      })
  },
  doCollect(){
    console.log(this.data.collectStatus)
    course.doCollect(this.data.id,"article")
      .then((res) => {
        console.log(res)
        if(res.code == 200){
          this.setData({
            collectStatus:{status:true,img:"../../images/collect/yes.png",text:"已收藏"}
          })
        }else if(res.code == 400){
            wx.showToast({
              title: '点赞失败，请重试',
              icon: 'none',
              duration: 1500,
              mask: false
          })
        }
      })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})