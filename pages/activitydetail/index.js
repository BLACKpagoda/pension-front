// pages/activitydetail/index.js
import {
  Activity
} from '../../model/activity'
import utils from '../../utils/utils'

const activity = new Activity();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: null,
    status: null,
    join_user_id: [],
    user_id: null,
    join_num: null,
    writeText: false,
    message: '',
    id: '',
    idr: '',
    myNickName: '',
    myAvatarUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    let user_id = wx.getStorageSync('user_id');
    this.setData({
      myNickName: userInfo.nickName,
      myAvatarUrl: userInfo.avatarUrl,
      user_id
    })
    this.getDetail(options.activityId);
    this.getComment(options.activityId);
  },

  getDetail(id) {
    activity.getActivityDetail(id)
      .then(res => {
        console.log(res);
        this.setData({
          // detailData: res.doc[0],
          join_num: res.join_num,
          avatrUrl: res.doc[0].avatrUrl,
          nickName: res.doc[0].nickName,
          ...res.doc[0].act,
          start_time: new Date().format(new Date(res.doc[0].act.start_time)),
          end_time: new Date().format(new Date(res.doc[0].act.end_time)),
        })
        this.judgeJoin();

      })
  },

  confirm(e) {
    console.log(e);
    this.setData({
      writeText: false,
    })
  },

  setMessage(e) {
    this.setData({
      message: e.detail.value
    })
  },

  postComment() {
    console.log(this.data.message);
    let temp = this.data.comment;
    activity.postComment(this.data.message, this.data._id)
      .then(res => {
        console.log(res);
        temp.push({
          content: this.data.message,
          comment_user_avatarUrl: this.data.myAvatarUrl,
          comment_user_nickName: this.data.myNickName,
          comment_user_id: this.data.user_id
        })
        this.setData({
          comment: temp
        })
        this.data.message = ''
      })
  },

  goReply(e) {
    console.log(e.currentTarget.dataset);
    // let temp = {
    // id: e.currentTarget.dataset.id
    // }
    this.setData({
      index: e.currentTarget.dataset.index,
      id: e.currentTarget.dataset.id,
      idr: e.currentTarget.dataset.rindex
      // replying: temp
    })
  },

  postReply() {

    console.log(this.data.index);
    let id = this.data.comment[this.data.index].comment_id;
    let to_user_id = this.data.comment[this.data.index].comment_user_id;
    let to_user_nickName = this.data.comment[this.data.index].comment_user_nickName;
    console.log(this.data.idr);
    if (this.data.idr) {
      console.log('hahahahah');
      id = this.data.comment[this.data.index].reply[this.data.idr].reply_id;
      to_user_id = this.data.comment[this.data.index].reply[this.data.idr].from_user_id;
      to_user_nickName = this.data.comment[this.data.index].reply[this.data.idr].from_user_nickName;
    }

    activity.postComment(this.data.message, id, to_user_id)
      .then(res => {
        let temp = this.data.comment;
        temp[this.data.index].reply.push({
          reply_id: res.id,
          content: this.data.message,
          from_user_id: res.user_id,
          from_user_nickName: wx.getStorageSync('userInfo').nickName,
          to_user_nickName
        })

        this.setData({
          comment: temp
        })
        console.log(res);
      })
  },

  write() {
    this.setData({
      writeText: true
    })
  },

  getComment(id) {
    activity.getActComment(id)
      .then(res => {
        console.log(res);
        this.setData({
          comment: res
        })
      })
  },

  previewImage: function (e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //数据源
    console.log(index);
    let images = this.data.image_url;
    wx.previewImage({
      //当前显示下标
      current: images[index],
      //数据源
      urls: images
    })
  },

  judgeJoin() {
    let user_id = wx.getStorageSync('user_id');
    if (this.data.user_id == user_id) {
      // 活动发起人本人
      this.setData({
        status: 'master'
      })
    } else if (this.data.join_user_id.includes(user_id)) {
      // 已参加该活动
      this.setData({
        status: 'join'
      })
    } else {
      // 未参加该活动
      this.setData({
        status: 'unJoin'
      })
    }
  },
  joinAct() {
    activity.joinActivity(this.data._id)
      .then((res) => {
        this.setData({
          status: "join",
          join_num: (this.data.join_num + 1)
        })
      })
  },
  deleteAct() {
    console.log(this.data);
    activity.deleteActivty(this.data._id)
      .then((res) => {
        console.log(res);
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1500,
          mask: true,
          success: (result) => {
            wx.switchTab({
              url: '../activity/activity',
              success: () => {
                let page = getCurrentPages().pop();
                console.log(page);
                if (page == undefined || page == null) {
                  return
                }
                page.refresh()
              }
            });
          }
        });
      })
  }

})