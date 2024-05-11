// pages/addAct/addAct.js
// var dateTimePicker = require('../../utils/dateTimePicker.js');

import {
  Activity
} from '../../model/activity'
import utils from '../../utils/utils'
const app = getApp();


const activity = new Activity();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: null,
    nickName: null,
    array: [],
    index: null,
    location: app.globalData.defaultCity,
    county: app.globalData.defaultCounty,
    desc: '请填写',
    startImages: [],
    title: '',
    detail_addr: '',
    isPickerRender1: false,
    isPickerShow1: false,
    startTime: "",
    endTime: "",
    pickerConfig: {
      endDate: false,
      column: "minute",
      dateLimit: true,
      initStartTime: "2019-01-01 12:32",
      initEndTime: "2019-12-01 12:32",
      limitStartTime: "2015-05-06 12:32",
      limitEndTime: "2055-05-06 12:32"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getUserInfo();
    this.getTag();
    this.getCurrentTime();
    console.log(this.data);
  },

  getUserInfo() {
    let userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo);
    this.setData({
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl
    })
  },
  /**
   * 发送数据
   */
  onPost() {
    let data = this.data;
    if (!data.title) {
      utils.checkNullForm('title');
      return
    } else if (!data.index) {
      utils.checkNullForm('tag');
      return
    } else if (!data.location) {
      utils.checkNullForm('addr');
      return
    } else if (!data.detail_addr) {
      utils.checkNullForm('detail_addr');
      return
    } else if (data.desc == '请填写') {
      utils.checkNullForm('desc');
      return
    }

    console.log(data.startImages);
    let a = activity.addAct({
      path: data.startImages
    }, {
      title: data.title,
      detail: data.desc,
      start_time: new Date(data.startTime),
      end_time: new Date(data.endTime),
      addr: data.location + data.county,
      detail_addr: data.detail_addr,
      tag: data.array[data.index]
    })
    this.init();
    console.log(a);
  },

  init() {
    this.setData({
      desc: '',
      startImages: '',
      title: '',
      detail_addr: '',
      startTime: '',
      endTime: ''

    })
  },

  getTag() {
    activity.getTag()
      .then(res => {
        let tag = [];
        res.forEach(item => {
          tag.push(item.tag)
        });
        this.setData({
          array: tag
        })
      })
  },

  getCurrentTime() {
    let date = new Date().format(new Date());
    this.setData({
      startTime: date,
      endTime: date
    })
  },

  setTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },

  setDetailAddr(e) {
    this.setData({
      detail_addr: e.detail.value
    })
  },


  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  toDesc() {
    console.log(this.data);
    console.log(JSON.stringify(this.data.startImages)+"=======");
    wx.navigateTo({
      url: `../actDesc/actDesc?desc=${this.data.desc}&images=${JSON.stringify(this.data.startImages)}`,
    });
  },



  setTime: function (val) {
    let data = val.detail.startTime;
    // 删除秒
    data = data.substr(0, data.length - 3);
    console.log(val);
    if (val.currentTarget.dataset.id == 1) {
      this.setData({
        startTime: data
      });
    } else {
      this.setData({
        endTime: data
      });
    }
  },

  pickerShow: function (e) {
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        isPickerShow1: true,
        isPickerRender1: true,
        chartHide1: true
      });
    } else {
      this.setData({
        isPickerShow2: true,
        isPickerRender2: true,
        chartHide2: true
      });
    }

  },

  pickerHide: function (e) {
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        isPickerShow1: false,
        isPickerRender1: false,
        chartHide1: false
      })
      console.log(this.data);
    } else {
      this.setData({
        isPickerShow2: false,
        isPickerRender2: false,
        chartHide2: false
      });
    }
  }

})