const config = require('../utils/config');
import {
  HTTP
} from '../utils/http';

class Activity extends HTTP {
  constructor() {
    super();
    this.endImages = [];
  }
  addAct(image, actInfo) {
    // 没有图片
    console.log(image.path.length);
    if (image.path.length == 0) {
      return this.onPostInfo(actInfo);

    }
    // 有图片
    return this.uploadImg(image, actInfo);
  }
  // 上传信息
  onPostInfo(actInfo) {
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
    return this.request({
      url: '/act/addAct',
      method: 'POST',
      data: {
        ...actInfo,
        image: []
      }
    })
  }

  uploadImg(data, actInfo) {
    const that = this;
    wx.showLoading({
      title: '上传中...',
      mask: true,
    })
    // i, success, fail 记录次数
    let i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: config.baseUrl + '/act/uploadFile',
      filePath: data.path[i],
      name: 'actimg',
      formData: {
        access_token: wx.getStorageSync('access_token')
      },
      success: (res) => {
        wx.hideLoading();
        success++;
        let pic = JSON.parse(res.data);
        console.log(pic);
        that.endImages.push(pic.data[0])
      },
      fail: (err) => {
        console.log(err);
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++;
        if (i == data.path.length) { //当图片传完时，停止调用     
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          console.log(that.endImages);
          console.log(...actInfo);
          wx.switchTab({
            url: '../activity/activity',
            success: () => {
              this.endImages= [];
              let page = getCurrentPages().pop();
              console.log(page);
              if (page == undefined || page == null) {
                return
              }
              page.refresh()
            }
          });
          return that.request({
            url: '/act/addAct',
            method: 'POST',
            data: {
              image: that.endImages,
              ...actInfo
            }
          })

        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadImg(data, actInfo); //递归，回调自己
        }
      }
    });

  }

  getActivityDetail(id) {
    return this.request({
      url: '/act/detail',
      data: {
        act_id: id
      }
    })
  }

  getActComment(id) {
    return this.request({
      url: '/act/getComment',
      data: {
        id
      }
    })
  }
  getActClass(address,tag) {
    return this.request({
      url: '/act/getAllAct',
      data: {
        addr:address,
        tag:tag
      }
    })
  }

  getTag() {
    return this.request({
      url: '/tag'
    })
  }

  getactivity(address) {
    return this.request({
        url: '/act/getAllAct',
        data: {
          addr: address
        }
      },

    )
  }
  //搜索活动
  getSearchactivity(keyword, page, number = 5){
    return this.request({
      url: `/search`,
      method: 'POST',
      data: {
        tag:"act",
        keyword,
        page,
        number
      }
    })
}
  // 获取我发起的活动
  getReleaseactivity() {
    return this.request({
      url: '/user/myAct',
      data: {

      }
    })
  }
  // 获取我加入的活动
  getParticipateactivity() {
    return this.request({
      url: '/user/myJoinAct',
      data: {}
    })
  }

  //参加活动
  joinActivity(id) {
    return this.request({
      url: `/act/apply`,
      data: {
        id
      },
      method: 'POST'
    })
  }

  //删除活动
  deleteActivty(act_id) {
    return this.request({
      url: `/act/deleteAct`,
      data: {
        act_id
      },
      method: 'POST'
    })
  }


  /**
   * 
   * @param {String} content  
   * @param {String} id 可能是评论id，也可能是活动的id
   * @param {String} to_user_id   二级评论需要被回复者id，一级不需要
   */
  postComment(content, id, to_user_id) {
    let data = {}
    if (!to_user_id) {
      data = {
        tag: 'act',
        content,
        id
      }
    } else {
      data = {
        tag: 'comment',
        content,
        id,
        to_user_id
      }
    }
    return this.request({
      url: '/act/comment',
      data,
      method: 'POST'
    })
  }

  search(keyword) {
    return this.request({
      url: '/search',
      data: {
        keyword,
        page: 0,
        tag: 'act',
        number: 20
      }
    })
  }

}



export {
  Activity
}