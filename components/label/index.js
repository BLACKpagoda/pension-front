// components/label/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPosting() {
      this.triggerEvent("onPost", {
        word: this.data.text
      }, {});
    }
  }
})