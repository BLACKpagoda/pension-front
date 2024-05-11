/**
 * 上传多张图片
 * @param {Object} data 
 */
import {
  HTTP
} from '../utils/http';

class Image extends HTTP {
  constructor() {
    super();
    this.endImages = []
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
      url: 'http://101.7.155.247:3000/act/uploadFile',
      filePath: data.path[i],
      name: 'actimg',
      formData: null,
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
          that.request({
            url: '/act/addAct',
            method: 'POST',
            data: {
              image: that.endImages,
              ...actInfo
            }
          }).then(res => console.log(res))

        } else {        //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadImg(data, actInfo); //递归，回调自己
        }
      }
    });

  }

}



export {
  Image
}