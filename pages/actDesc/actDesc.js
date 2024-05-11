// pages/actDesc/actDesc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc: '',
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options ---- ');
    console.log(options);
    this.setData({
      desc: options.desc,
      images: JSON.parse(options.images)
    })
    console.log(this.data);
  },

  setText(e) {
    let cursor = e.detail.cursor;
    let text = e.detail.value;
    if (cursor < 1) {

      this.setData({
        desc: text
      })
    } else if (cursor > 200) {
      wx.showToast({
        title: '超出字数限制，最多输入200字',
      });
    } else {
      this.setData({
        desc: text
      })
    }
  },

  selectImage(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.setData({
          images: images.length <= 3 ? images : images.slice(0, 3)
        })
        console.log(this.data.images);
        // $digest(this)
      }
    })
  },

  previewImage: function (e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //数据源
    let images = this.data.images;
    wx.previewImage({
      //当前显示下标
      current: images[index],
      //数据源
      urls: images
    })
  },

  deleteImage(e) {
    let index = e.currentTarget.dataset.index;
    let temp = this.data.images;
    temp.splice(index, 1)
    this.setData({
      images: temp
    })
  },

  onPost() {

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //设置上个页面的data
    prevPage.setData({
      desc: this.data.desc,
      startImages: this.data.images
    })
    console.log(prevPage.data);
    if (!this.data.desc) {
      wx.showToast({
        title: '请输入活动介绍',
        icon: 'none',
        duration: 2000
      });
      return
    }
    wx.navigateBack({
      delta: 1
    })
  }

})