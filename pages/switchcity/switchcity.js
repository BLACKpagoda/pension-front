import { LETTERS, HOT_CITY_LIST } from '../../locale/citydata'
import { commonMessage } from '../../locale/commonMessageZhCn'
import { AutoPredictor } from '../../utils/autoPredictor'
import utils from '../../utils/utils'
import key from '../../utils/config.js'
import C2Pin from '../../utils/pinyin.js'

const {
  isNotEmpty,
  safeGet,
  getCityListSortedByInitialLetter,
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl,
  onFail,
} = utils;
const appInstance = getApp();

Page({
  data: {
    sideBarLetterList: [],
    winHeight: 0,
    cityList: [],
    hotCityList: HOT_CITY_LIST,
    showChosenLetterToast: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: commonMessage['location.getting'],
    currentCityCode: '',
    inputName: '',
    completeList: [],
    county: '',
    showCountyPicker: false,
    auto: true, // 自动手动定位开关
    weatherData:null
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;
    const sideBarLetterList = LETTERS.map(letter => ({ name: letter }));
    this.setData({
      winHeight,
      sideBarLetterList,
      cityList: cityListSortedByInitialLetter
    });
    // 定位
    this.getLocation();
  },

  touchSideBarLetter: function (e) {
    const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e)
    this.setData({
      toastShowLetter: chosenLetter,
      showChosenLetterToast: true,
      scrollTopId: chosenLetter,
    })
    // close toast of chosenLetter
    setTimeout(() => { this.setData({ showChosenLetterToast: false }) }, 500)
  },
  //选择城市
  chooseCity: function (e) {
    const { city, code } = safeGet(['currentTarget', 'dataset'], e)
    this.setData({
      auto: false,
      showCountyPicker: true,
      city,
      currentCityCode: code,
      scrollTop: 0,
      completeList: [],
      county: ''
    })
    this.getCountyList()

    appInstance.globalData.defaultCity = city
    appInstance.globalData.defaultCounty = ''
  },

  chooseCounty: function (e) {
    var that = this;
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now',
      data: {
        location:C2Pin.fullChar(this.data.city),
        key:key.HFkey
      },
      success: (result)=>{ 
        let weatherData = result.data.HeWeather6[0].now.cond_txt + " " + result.data.HeWeather6[0].now.tmp + "℃";
        const county = safeGet(['currentTarget', 'dataset', 'city'], e)
        that.setData({ county })
        appInstance.globalData.defaultCounty = county
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];             //上一个页面
          prevPage.setData({
            weatherData: weatherData,
            location: this.data.city,
            county: this.data.county,
          })
      },
    });
  },

  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({ scrollTop: 0 })
  },
  bindScroll: function (e) {
    // console.log(e.detail)
  },
  getCountyList: function () {
    console.log(commonMessage['location.county.getting']);
    const code = this.data.currentCityCode

    wx.request({
      url: getCountyListUrl(code),
      success: res => this.setCountyList(res),
      fail: onFail(commonMessage['location.county.fail']),
    })
  },

  setCountyList: function (res) {
    const resultArray = safeGet(['data', 'result'], res)
    const countyList = isNotEmpty(resultArray) ? resultArray[0] : []
    this.setData({ countyList })
  },

  getLocation: function () {
    console.log(commonMessage['location.city.getting'])

    this.setData({ county: '' })
    wx.getLocation({
      type: 'wgs84',
      success: res => this.getLocationFromGeoCoord(res),
      fail: onFail(commonMessage['location.city.fail']),
    })
  },

  getLocationFromGeoCoord: function (geoCoord) {
    const { latitude, longitude } = geoCoord
    wx.request({
      url: getLocationUrl(latitude, longitude),
      success: location => this.setCityCounty(location)
    })
  },

  setCityCounty: function (location) {
    const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], location)
    if (this.data.auto) { // 如果开始手动选择，以手动为准
      this.setData({
        city,
        currentCityCode: adcode,
        county: district
      })
      appInstance.globalData.defaultCity = city
      // this.getCountyList();
    }
  },
  reGetLocation: function () {
    const { city, county } = this.data
    appInstance.globalData.defaultCity = city
    appInstance.globalData.defaultCounty = county
    console.log(appInstance.globalData.defaultCity);
    //返回首页
    wx.switchTab({ url: getIndexUrl() })
  },
  // 失焦时清空输入框
  bindBlur: function (e) {
    this.setData({
      inputName: '',
      completeList: []
    })
  },
  // 输入框输入时
  bindKeyInput: function (e) {
    let inputName = e.detail.value.trim()
    this.setData({ inputName })
    if (!inputName) {
      this.setData({ completeList: [] })
    }
    this.useAutoPredictor(inputName)
  },
  // 输入框自动联想搜索
  useAutoPredictor: function (content) {
    let autoPredictor = new AutoPredictor(content)
    let completeList = autoPredictor.associativeSearch()
    this.setData({ completeList })
  },

  goBack() {
    //设置上个页面的data
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now',
      data: {
        location:C2Pin.fullChar(this.data.city),
        key:key.HFkey
      },
      success: (result)=>{ 
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];             //上一个页面
        let weatherData = result.data.HeWeather6[0].now.cond_txt + " " + result.data.HeWeather6[0].now.tmp + "℃";
        console.log(weatherData);
          prevPage.setData({
            weatherData: weatherData,
            location: this.data.city,
            county: this.data.county,
          })
          wx.navigateBack({
            delta: 1
          });
        }
    });
  }
})
