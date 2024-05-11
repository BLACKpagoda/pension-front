// pages/login/login.js
const config = require('../../utils/config')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onGetUserInfo(e) {
    const userInfo = e.detail.userInfo;
    if (!userInfo) {
      return
    }
    let data = {
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl
    }

    // 开始登录
    wx.login({
      success: (result) => {
        console.log(result);
        wx.request({
          url: config.baseUrl + '/user/doLogin',
          data: {
            code: result.code,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
          },
          method: 'POST',
          success: (result) => {
            console.log(result);
            wx.setStorageSync('access_token', result.data.access_token);
            wx.setStorageSync('user_id', result.data.user_id);
            wx.setStorageSync('userInfo', data);
            wx.setStorageSync('login', true);
            wx.switchTab({
              url: '../index/index'
            });
          },
          fail: () => { 
            console.log('fail');
          },
          complete: () => {
            console.log('conplete');
          }
        });
      },

    });
  }
})