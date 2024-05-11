// components/my-option/my-option.js
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
    // 活动和收藏的切换 默认为活动
    hide:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //hide shadow控制横线和阴影的出现
    hideColLine(){
      this.setData({
        hide:false
      });
      this.triggerEvent("switchMy",{
        AorC:true
      },{})
    },
    hideActLine(){
      this.setData({
        hide:true
      });
      this.triggerEvent("switchMy",{
        AorC:false
      },{})
    }
  }
})
