// components/menu-button/menu-button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hide: false, //false 藏起来
    shadow: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //hide shadow控制横线和阴影的出现
    hideTLine(e) {
      this.setData({
        hide: false,
        shadow: true,
      })
      this.triggerEvent("switch", {
        type: true
      }, {})
    },
    hideRLine(e) {
      this.setData({
        hide: true,
        shadow: false
      })
      this.triggerEvent("switch", {
        type: false
      }, {})
    }
  }
})
