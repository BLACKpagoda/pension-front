// pages/activity/activity.js
var key = require('../../utils/config.js').HFkey
import C2Pin from '../../utils/pinyin.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: key,
    weatherData: '', //当前的天气
    x: 0,
    menuFixed: true,
    location: '晋中市',
    county: '榆次区',
    searching: false,

  },
  onLoad: function (options) {
    console.log('onload--------');
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now',
      data: {
        location: C2Pin.fullChar(this.data.location),
        key: this.data.key
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        let weatherData = result.data.HeWeather6[0].now.cond_txt + " " + result.data.HeWeather6[0].now.tmp + "℃";
        this.setData({
          weatherData: weatherData
        })
      },
    });
  },

  onPageScroll: function (e) {
    // console.log(e.scrollTop);
    var that = this;
    // 当页面滚动距离scrollTop 菜单栏距离文档顶部的距离时，菜单栏固定定位
    //     if (that.data.y=true){
    if (e.scrollTop - that.data.x > 20) {
      // console.log(e.scrollTop);
      that.setData({
        x: e.scrollTop,
        menuFixed: true
      })
    } else if (that.data.x - e.scrollTop > 20) {
      // console.log("ada");
      that.setData({
        x: e.scrollTop,
        menuFixed: false
      })
    }
  },

  onPullDownRefresh: function () {
    console.log(2);
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500)
  },

  addAct() {
    wx.navigateTo({
      url: '../addAct/addAct',
    });
  },

  onSearch() {
    wx.navigateTo({
      url:'../activitysearch/activitysearch'
        }
    )
  },

  back() {
    this.setData({
      searching: false
    })
  },

  refresh() {
    console.log(333);
    let act = this.selectComponent("#act");
    act.refresh();
  }

})