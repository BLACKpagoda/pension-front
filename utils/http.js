const config = require('./config');
const noToken = [
  '/user/dologin',
  '/article',
  '/video',
  '/article/detail',
  '/search',
  '/act/getAllAct',
  '/act/detail',
  '/tag'
]

// 错误处理
const tips = {
  1: '抱歉，出现了一个错误'
}

class HTTP {
  request({
    url,
    data = {},
    method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method);
    })

  }
  /**
   * 
   * @param {String} url 
   * @param {*} resolve 
   * @param {*} reject 
   * @param {Object} data 发送数据 
   * @param {String} method  请求方式
   */
  _request(url, resolve, reject, data = {}, method = 'GET') {
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {} else {
          // 没有授权
          wx.redirectTo({
            url: '../login/login',
          });
          return
        }
      },
    });
    data.access_token = wx.getStorageSync('access_token');
    if (noToken.includes(url)) {
      delete data.access_token;
    }

    wx.request({
      url: config.baseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        let code = res.statusCode.toString()
        if (code.startsWith('2')) {
          /**
           * 如果第一个运算子的布尔值为true，则返回第二个运算子的值（注意是值，不是布尔值）；
           * 如果第一个运算子的布尔值为false，则直接返回第一个运算子的值，且不再对第二个运算子求值。
           * params.success 不是必须传入
           */
          // 判断token 是否失效
          if (res.data.code == -1 || res.data.code == 0) {
            wx.getSetting({
              // 已授权
              success(res) {
                if (res.authSetting['scope.userInfo']) {
                  wx.getUserInfo({
                    success: (res) => {
                      let userInfo = res.userInfo;
                      wx.login({
                        success: (result) => {
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
                              wx.setStorageSync('userInfo', userInfo);
                              wx.setStorageSync('login', true);
                              wx.switchTab({
                                url: '../index/index'
                              });
                              return
                            },
                          });
                        },
                      });
                    }
                  });
                } else {
                  // 没有授权
                  wx.redirectTo({
                    url: '../login/login',
                  });
                }
              }
            })
          }
          resolve(res.data);
        } else {
          let error_code = res.data.error_code;
          this._show_error(error_code);
          reject();
        }
      },
      fail: () => {
        this._show_error(1);
        if (res.data.code == -1 || res.data.code == 0) {
          wx.redirectTo({
            url: '../login/login',
          });
        }
        reject();
      }
    });
  }

  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    let tip = tips[error_code];
    wx.showToast({
      title: tip ? tip : tips[1],
      icon: 'none',
      duration: 2000,
    });
  }
}

export {
  HTTP
}