// components/activity/activity.js
import {
  Activity
} from "../../model/activity";
const activityModel = new Activity();
let col1H = 0;
let col2H = 0;
Component({
  data: {
    ress: [],
    res: [],
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    page: 2,
    loading: false,
  },
  /**
   * 组件的属性列表
   */
  //todo
  properties: {
    classId: {
      type: String
    },
    keyword: {
      type: String,
      observer(value) {
        // console.log(777)
        console.log(this)
        this.onShow();
      }
    },
    activityid: {
      type: String
    },
    whereactivity: {
      type: String
    },
    address: {
      type: String,
      value: '晋中市榆次区',
      observer(value) {
        console.log(value);
        activityModel.getactivity(value)
          .then(
            res => {
              console.log(res);
              this.setData({
                res: res,
                ress: res
              });
              if (res.length > 0) { //res一直存在不是boolon值
                console.log("bbb");
                console.log(res);
                this.computePicturesHeight();
                this.detailString();
                this.loadImages();

                // this.methods.ComputePicturesHeight();
              } else {
                console.log("qsdadas");
                this.setData({
                  res: [],
                  ress: [],
                  scrollH: 0,
                  imgWidth: 0,
                  loadingCount: 0,
                  images: [],
                  col1: [],
                  col2: []
                })
              }
            }
          )
      }
    },
    tag: {
      type: String,
      tag: "",
      observer(value) {
        console.log(value);
        console.log(this.properties.address);
        activityModel.getActClass(this.properties.address, value)
          .then(
            res => {
              console.log(res);
              this.setData({
                res: res,
              });
              if (res.length > 0) { //res一直存在不是boolon值
                console.log("bbb");
                console.log(res);
                this.computePicturesHeight();
                this.detailString();
                this.loadImages();
              } else {
                console.log("qsdadas");
                this.setData({
                  res: [],
                  ress: [],
                  scrollH: 0,
                  imgWidth: 0,
                  loadingCount: 0,
                  images: [],
                  col1: [],
                  col2: []
                })
              }
            }
          )
      }
    },
    search: Boolean
  },
  /**
   * 组件的初始数据
   */
  attached: function () {

    // console.log(this.properties.address);
    //接收数据
    let that = this;
    // console.log(this.properties.whereactivity);
    if (this.properties.whereactivity == "list") {
      // console.log(this.properties.address);
      var activitylist = activityModel.getactivity(this.properties.address);
    } else if (this.properties.whereactivity == "myRealease") {
      var activitylist = activityModel.getReleaseactivity();
    } else if (this.properties.whereactivity == "participart") {
      var activitylist = activityModel.getParticipateactivity();
    }
    // else if (this.properties.whereactivity == "actclass") {
    //   var activitylist = activityModel.getactivity(this.properties.address,this.properties.tag);}
    else if (this.properties.whereactivity == "search") {
      console.log(999);
      if (!this.data.keyword) {
        return
      }
      var activitylist = activityModel.getSearchactivity(this.data.keyword, 1, 8);

    }
    //都将别的形式的值改成瀑布流默认的值
    if (this.properties.whereactivity == "list" || this.properties.whereactivity == "search" || this.properties.whereactivity == "actclass") {
      activitylist.then(
        res => {
          // console.log(res);
          console.log(res);
          that.setData({
            res: res,
            ress: res,
          });
          console.log(res);
          this.triggerEvent("hasData", {}, {})
          this.computePicturesHeight();
          this.detailString();
          this.loadImages();
        }
      )
    } else if (this.data.whereactivity == "participart") {
      activitylist.then(
        res => {
          that.setData({
            res
          });
          console.log(res);
          this.computePicturesHeight();
          this.loadImages();
          this.detailString();
        })
    } else {
      activitylist.then(
        res => {
          console.log(res);
          // console.log(res);
          let resf = new Array();
          for (let i = 0; i < res.act.length; i++) {
            let f = {
              nickName: res.nickName,
              avatarUrl: res.avatarUrl,
              act: res.act[i]
            }
            resf.push(f);
          };
          that.setData({
            res: resf
          });
          console.log(res);
          this.computePicturesHeight();
          this.loadImages();
          this.detailString();
        }
      )
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow() {
      // console.log("你请求多了");
      // console.log(this.properties.address);
      //接收数据
      let that = this;
      // console.log(this.properties.whereactivity);
      if (this.properties.whereactivity == "list") {
        // console.log(this.properties.address);
        var activitylist = activityModel.getactivity(this.properties.address);
      } else if (this.properties.whereactivity == "myRealease") {
        var activitylist = activityModel.getReleaseactivity();
      } else if (this.properties.whereactivity == "participart") {
        var activitylist = activityModel.getParticipateactivity();
      } else if (this.properties.whereactivity == "actClass") {
        var activitylist = activityModel.getActClass(this.properties.address, this.properties.tag);
      } else if (this.properties.whereactivity == "activityClass") {
        var activitylist = activityModel.getActClass(classId);
      } else if (this.properties.whereactivity == "search") {
        console.log(999);
        if (!this.data.keyword) {
          return
        }
        var activitylist = activityModel.getSearchactivity(this.data.keyword, 1, 100);

      }
      //都将别的形式的值改成瀑布流默认的值
      if (this.properties.whereactivity == "list" || this.properties.whereactivity == "search") {
        activitylist.then(
          res => {
            // console.log(res);
            that.setData({
              res: res,
              ress: res,
            });
            console.log(res);
            this.triggerEvent("hasData", {}, {})
            this.computePicturesHeight();
            this.detailString();
            this.loadImages();
          }
        )
      } else {
        activitylist.then(
          res => {
            console.log(res);
            // console.log(res);
            let resf = new Array();
            for (let i = 0; i < res.act.length; i++) {
              let f = {
                nickName: res.nickName,
                avatrUrl: res.avatarUrl,
                act: res.act[i]
              }
              resf.push(f);
            };
            that.setData({
              res: resf
            });
            console.log(res);
            this.computePicturesHeight();
            this.detailString();
            this.loadImages();
            //判断是否为空加图片
            // if () {};
          }
        )
      }
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
      });
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
        // data.images = [];
      }
      this.setData(data);
    },
    loadImages: function () {
      let that = this;
      let images = [];
      for (let i = 0; i < that.data.res.length; i++) {
        images.push({
          "pic": that.data.res[i].act.image_url[0],
          "height": 0,
          "shuzi": i
        });
        console.log(that.data.res[i].act.image_url[0])
      }
      let baseId = "img-" + (+new Date());
      for (let i = 0; i < images.length; i++) {
        images[i].id = baseId + "-" + i;
      }
      this.setData({
        loadingCount: images.length,
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