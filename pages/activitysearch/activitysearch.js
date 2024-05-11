// pages/activitysearch/activitysearch.js
import utils from "../../utils/utils";
import {
    random
} from "../../utils/common.js"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isclass:false,
        keyword: "",
        hasData: true,
        more:String,
        loding:false,
        tag:""
        // //上拉加载更多
        // loading: false,
        // //页数
        // page: 1,
        // //防止请求发送多次 true 可以请求 false 没得数据
        // flag: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        if (options.tag){
            this.setData({
                tag:options.tag,
                isclass:true
                }
            )
        }
    },

    toSearch(e) {
        console.log(e);
        this.setData(({
            keyword: e.detail.keyword
        }))
    },

    backSearch() {
      wx.navigateBack({
            delta:1
      })
    },

    delete() {
        this.setData({
            hasData: false
        })
    },

    hasData() {
        this.setData({
            hasData: true
        })
    },
    onReachBottom(){
        this.setData({
            more:random(16)
        });
        console.log(this.data.more)
    },
    getLoading(e){
        this.setData({
            loading:e.detail.myloading
        })
    },



    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {


    },

    getKeyword() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    // onReachBottom: function () {
    //         if (this.data.flag) {
    //             this._showLoading();
    //         }
    //         setTimeout(() => {
    //             if (this.data.flag) {
    //                 this._lock();
    //                 actvityModel.getSearchactivity(this.data.page)
    //                     .then((res) => {
    //                         console.log("page " + this.data.page)
    //                         if (res.length < 6) {
    //                             console.log('没有更多活动');
    //                             return;
    //                         }
    //                         this.setData({
    //                             articleData: this.data.articleData.concat(res),
    //                         });
    //                     });
    //                 if (this.data.videoFlag) {
    //                     courseModel.getVideoCourse(this.data.page)
    //                         .then((res) => {
    //                             if (res.length < 2) {
    //                                 this._vidoeLock()
    //                                 console.log('没有更多视频数据');
    //                                 this._unlock(); //文章比视频多
    //                                 return;
    //                             }
    //                             this.setData({
    //                                 videoData: this.data.videoData.concat(res),
    //                             });
    //
    //                             let i = ((this.data.page-1) * 2)-2;
    //                             //  1   2   3   4
    //                             let status1 = courseModel.getCollectStatus(res[0]._id,"video");
    //                             //    0 1 2 3 4 5 6 7 8 9
    //                             let status2 = courseModel.getCollectStatus(res[1]._id,"video");
    //                             Promise.all([status1, status2])
    //                                 .then((res) => {
    //                                     let tempData = this.data.videoData;
    //                                     if (res[0].code == 300) {
    //                                         tempData[i].collect_status = true //true 表示收藏过
    //                                         console.log(tempData[i].collect_status)
    //                                     } else if (res.code == 200) {
    //                                         tempData[i].collect_status = false //false 表示收藏过
    //                                         console.log(tempData[i].collect_status)
    //                                     }
    //                                     if (res[1].code == 300) {
    //                                         tempData[(i+1)].collect_status = true //true 表示收藏过
    //                                         console.log(tempData[i].collect_status)
    //                                     } else if (res.code == 200) {
    //                                         tempData[(i+1)].collect_status = false //false 表示收藏过
    //                                         console.log(tempData[i].collect_status)
    //                                     }
    //                                     this.setData({
    //                                         videoData: tempData
    //                                     })
    //                                 })
    //                         })
    //                 }
    //                 this.data.page++;
    //                 this._hideLoading();
    //                 this._unlock();
    //             }
    //         }, 1500); //1.5秒之后开始加载 加载完成之后隐藏loading
    // },
    // _showLoading() {
    //     //显示加载动画
    //     this.setData({
    //         loading: true
    //     });
    //     wx.showLoading({
    //         title: "正在加载更多",
    //         mask: true,
    //         icon: "none"
    //     });
    // },
    // _hideLoading() {
    //     //隐藏加载动画
    //     this.setData({
    //         loading: false
    //     });
    //     wx.hideLoading()
    // },
    // //防止被多次请求
    // _lock() {
    //     this.setData({
    //         flag: false
    //     });
    // },
    // _unlock() {
    //     this.setData({
    //         flag: true
    //     })
    // },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})