// components/type/type.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    logo: null,
    tag: null
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
    toType() {
      this.triggerEvent('typeArticle', {tag: this.data.tag}, {})
    },
    
    tage(){
      this.triggerEvent('tag',{tag:this.properties.tag})
    }
  }
})
