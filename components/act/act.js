// components/activity/activity.js
import {
  Activity
} from "../../model/activity";
const activityModel = new Activity();

let col1H = 0;
let col2H = 0;
Component({
  data: {
    res: [],
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: []
  },
  /**
   * 组件的属性列表
   */
  properties: {
    res: {
      type: Array,
      observer(res) {
        this.render(res)
      }
    },
    whereactivity: {
      type: String
    }
  },
  /**
   * 组件的初始数据
   */
  attached: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.setData({
        res: [],
        scrollH: 0,
        imgWidth: 0,
        loadingCount: 0,
        images: [],
        col1: [],
        col2: []
      })
    },

    render(res) {
      this.setData({
        res
      });
      this.detailString();
      this.loadImages();
      //瀑布流实现计算高度
      this.computePicturesHeight();
      var query = wx.createSelectorQuery();
      query.select('#qw').boundingClientRect()
      query.exec(function (res) {
        console.log(res);
      })

    },

    //计算图片高度
    computePicturesHeight: function () {
      wx.getSystemInfo({
        success: (res) => {
          let ww = res.windowWidth;
          let wh = res.windowHeight;
          let imgWidth = ww * 0.48;
          let scrollH = wh;
          this.setData({
            scrollH: scrollH,
            imgWidth: imgWidth
          });
        }
      })
    },

    onImageLoad: function (e) {
      let imageId = e.currentTarget.id;
      let oImgW = e.detail.width; //图片原始宽度
      let oImgH = e.detail.height; //图片原始高度
      let imgWidth = this.data.imgWidth; //图片设置的宽度
      let scale = imgWidth / oImgW; //比例计算
      let imgHeight = oImgH * scale; //自适应高度

      let images = this.data.images;
      let imageObj = null;

      for (let i = 0; i < images.length; i++) {
        let img = images[i];
        if (img.id === imageId) {
          imageObj = img;
          break;
        }
      }

      imageObj.height = imgHeight;

      let loadingCount = this.data.loadingCount - 1;
      let col1 = this.data.col1;
      let col2 = this.data.col2;

      if (col1H <= col2H) {
        col1H += imgHeight;
        col1.push(imageObj);
      } else {
        col2H += imgHeight;
        col2.push(imageObj);
      }

      let data = {
        loadingCount: loadingCount,
        col1: col1,
        col2: col2
      };

      if (!loadingCount) {
        data.images = [];
      }

      this.setData(data);
    },

    loadImages: function () {
      let that = this;
      let images = new Array();
      // console.log(that.data.res);
      for (let i = 0; i < that.data.res.length; i++) {
        // console.log(222);
        images.push({
          "pic": that.data.res[i].act.image_url[0],
          "height": 0,
          "shuzi": i
        });
        console.log(that.data.res[i].act.image_url[0])
      }
      let baseId = "img-" + (+new Date());
      // console.log(baseId);
      for (let i = 0; i < images.length; i++) {
        images[i].id = baseId + "-" + i;
      }
      this.setData({
        loadingCount: images.length,
        //传入的url;
        images: images
      });
    },

    detailString: function () {
      for (let i = 0; i < this.data.res.length; i++) {
        if (this.data.res[i].act.detail.length > 35) {
          this.data.res[i].act.detail = this.data.res[i].act.detail.substring(0, 34) + "......";
        }
      };
      this.setData({
        res: this.data.res
      });
    },
    //点击页面跳转
    activityDetails: function (e) {
      console.log(e);
      console.log(e.currentTarget.dataset.activityid);
      wx.navigateTo({
        url: '../../pages/activitydetail/index?activityId=' + e.currentTarget.dataset.activityid,
      });
    }
  }
})