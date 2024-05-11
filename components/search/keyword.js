import {
  HTTP
} from '../../utils/http'

class KeywordModel extends HTTP {
  constructor() {
    super();
    this.key = 'o';
    this.maxLength = 10;
  }

  // 获取历史搜索
  getHistory() {
    let history = wx.getStorageSync(this.key);
    if (!history) {
      return []
    }
    return history
  }

  // 历史搜索写入 Storage
  addToHistory(keyword) {
    let words = this.getHistory();
    const has = words.includes(keyword);
    // 队列
    if (!has) {
      const length = words.length;
      // 删除数组最后一个元素
      if (length >= this.maxLength) {
        words.pop()
      }
      // 添加第一个
      words.unshift(keyword);
      wx.setStorageSync(this.key, words);
    }
    if (has) {
      const index = words.indexOf(keyword);
      let temp = words.splice(index, 1);
      words.unshift(temp[0]);
      wx.setStorageSync(this.key, words);
    }
  }

  // 搜索
  search(keyword, page, tag, number = 5) {
    return this.request({
      url: `/search`,
      method: 'POST',
      data: {
        keyword,
        page,
        tag,
        number
      }
    })
  }

}

export {
  KeywordModel
}