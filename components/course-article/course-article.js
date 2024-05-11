// components/course/course.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    article: Object
  },

  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    detail() {
      wx.navigateTo({
        url: '../../pages/details/detalis?id=' + this.data.article._id,
        success: function () {
        }
      });
    }
  }
})