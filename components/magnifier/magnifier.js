// components/magnifier/magnifier.js
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
    fontSize:40
  },

  /**
   * 组件的方法列表
   */
  methods: {
    maginfyFontSize(){
      this.triggerEvent('size',{},{});
    }
  }
})
