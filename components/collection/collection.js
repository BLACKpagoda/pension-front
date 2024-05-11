// components/collection/collection.js
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
    judge:false,
    yes:'image/yes.png',
    no:'image/no.png'

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCollection:function(event){
      let judge=this.data.judge
      this.setData({
        judge:!judge
      })
    }
}
})
