// components/search/index.js
import {
  KeywordModel
} from './keyword'

const keywordModel = new KeywordModel();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    more: {
      type: String,
      observer: 'loadMore'
    },
    tag: String

  },

  /**
   * 组件的初始数据
   */
  data: {
    historywords: null,
    searching: null,
    // tag: null,
    activityData: null,
    keyword: null,
    page: 1,
    articleData: []
  },

  attached() {
    this.getHistory();
    let pages = getCurrentPages();
    if (pages[0].route == 'pages/index/index') {
      this.data.tag = 'articleAndVideo';
    } else if (pages[0].route == 'pages/activity/activity') {
      this.data.tag = 'act';
    }

  },


  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 监听用户提交搜索词
     * @param {} e
     */
    onConfirm(e) {
      this._showResult();
      this._showLoadingCenter();
      let word = e.detail.value || e.detail.word;
      this.setData({
        keyword: word
      })
      if (!word) {
        return
      }
      // 历史搜索存入缓存
      keywordModel.addToHistory(word);
      if (this.data.tag == 'act') {
        this.triggerEvent("search", {
          keyword: this.data.keyword
        }, {});
        this._hideLoadingCenter();
        return;
      }
      this.loadMore()

    },

    loadMore() {
      keywordModel.search(this.data.keyword, this.data.page, this.data.tag, 30)
        .then(res => {
          console.log(this.data.tag);
          console.log(res);
          if (this.data.tag == 'articleAndVideo') {
            this.data.page++;
            console.log(this.data.page);
            let temp = this.data.articleData.concat(res)
            this.setData({
              articleData: temp,
              hasCourse: true
            })
          } else {
            // this.setData({
            //   activityData: res,
            //   hasActivity: true
            // })

            this.setData({
              hasActivity: true
            })
          }
          this._hideLoadingCenter();
          if (res.length == 0) {
            this.setData({
              empty: true
            })
          }

        })

    },


    /**
     * 从缓存中获取历史搜索
     */
    getHistory() {
      let historywords = keywordModel.getHistory();
      this.setData({
        historywords
      })
    },

    onDelete() {
      // this.initPagination();
      this.setData({
        searching: false,
      })
      this.triggerEvent("delete", {}, {})
    },

    onCancel() {
      this.triggerEvent('cancel', {}, {});
      // this.initPagination();
    },

    _showResult() {
      this.setData({
        searching: true,
        loading: false
      })
    },

    _showLoadingCenter() {
      this.setData({
        loadingCenter: true
      })
    },

    _hideLoadingCenter() {
      this.setData({
        loadingCenter: false
      })
    }


  }
})