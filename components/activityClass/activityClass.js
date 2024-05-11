// components/activityClass/activityClass.js
import {
  CourseModel
} from '../../model/course.js';

var courseModel = new CourseModel();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fix: {
      type: Boolean
    },
    address: {
      type: String,
      observer() {}
    }
  },
  attached() {
    console.log(this.properties.fix)
  },

  /**
   * 组件的初始数据
   */
  data: {
    //shadow判断现在处于哪个状态
    shadow: true,
    whereactivity: "list"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //shadow判断现在处于哪个状态
    shadowActive(e) {
      this.setData({
        shadow: true,
        RorT: true
      })
    },
    shadowClassification(e) {
      this.setData({
        shadow: false,
        RorT: false
      })
      this.setTag();
    },
    setTag() {
      courseModel.getTag()
        .then(res => {
          this.setData({
            tagData: res
          })
        })
    },
    tagNav(e) {
      console.log(e.detail.tag);
      wx.navigateTo({
        url: '../../pages/activitysearch/activitysearch?tag=' + e.detail.tag
      })
    },
    refresh() {
      let act = this.selectComponent("#act");
      console.log(act);
      act.refresh();
    }

  }



})