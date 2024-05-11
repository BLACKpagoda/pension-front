import {
  LETTERS,
  CITY_LIST
} from '../locale/citydata'
import config from 'config'
const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function random (n) {
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
}

// API
const getLocationUrl = (latitude, longitude) => (`https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`)
const getCountyListUrl = code => (`https://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`)
const getIndexUrl = () => ('../demo/demo')

/**
 * 安全地在深层嵌套对象中取值
 * get deeply nested data from an object safely, return null if not found
 * @param {Array} keyList an Array of keys
 * @param {Object} obj 
 */
const safeGet = (keyList, obj) => keyList.reduce((preValue, curKey) => ((preValue && preValue[curKey]) ? preValue[curKey] : null), obj)

const isNotEmpty = array => (Array.isArray(array) && array.length > 0)

const isChinese = str => (/^[\u4e00-\u9fa5]+$/.test(str))

// 城市名按首字母分组
const getCityListSortedByInitialLetter = () => (
  LETTERS.map(
    letter => ({
      initial: letter,
      cityInfo: CITY_LIST.filter(city => city.initial == letter)
    })
  )
)

const getSlicedName = (cityObj, key, sliceLen) => (cityObj[key] && cityObj[key].slice(0, sliceLen))

const onFail = (err) => {
  console.log(err)
} // add your logic here e.g. show a toast

function checkNullForm(keyword) {
  console.log(2222);
  switch (keyword) {
    case 'title':
      showToast('请输入标题');
      break;
    case 'desc':
      showToast('请填写活动介绍');
      break;
    case 'start_time':
      showToast('请选择开始时间');
      break;
    case 'end_time':
      showToast('请选择结束时间');
      break;
    case 'addr':
      showToast('请选择活动地点');
      break;
    case 'detail_addr':
      showToast('请填写详细地址');
      break;
    case 'tag':
      showToast('请选择活动类别');
      break;
  }
}

const showToast = (text) => {
  wx.showToast({
    title: `${text}`,
    icon: 'none',
    duration: 2000,
  });
}

Date.prototype.format = function(date) {
  let format = 'yyyy-MM-dd HH:mm';
	let o = {
	"M+": date.getMonth() + 1,
	"d+": date.getDate(),
	"H+": date.getHours(),
	"m+": date.getMinutes(),
	"s+": date.getSeconds(),
	"q+": Math.floor((date.getMonth() + 3) / 3),//季度
	"f+": date.getMilliseconds(),//毫秒
	};
	if(/(y+)/.test(format))
		format = format.replace(RegExp.$1, date.getFullYear() + "").substr(4 - RegExp.$1.length);
	for(let k in o) {
		if(new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	}
	return format;
}

export default {
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl,
  safeGet,
  isNotEmpty,
  isChinese,
  getCityListSortedByInitialLetter,
  getSlicedName,
  onFail,
  checkNullForm,
  random
}