const random = require("../../../../utils/random")
const { $Message } = require('../../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetTime: 0,
    clearTimer: false,
    selectData: [
      {
        "logo": "../../resources/images/tcimg01.png",
        "name": "可回收垃圾",
        "color": "#2d8cf0"
      },
      {
        "logo": "../../resources/images/tcimg02.png",
        "name": "有害垃圾",
        "color": "#ed3f14"
      },
      {
        "logo": "../../resources/images/tcimg03.png",
        "name": "湿垃圾",
        "color": "#664035"
      },
      {
        "logo": "../../resources/images/tcimg04.png",
        "name": "干垃圾",
        "color": "#495060"
      },
      {
        "logo": "../../resources/images/tcimg05.png",
        "name": "其他垃圾",
        "color": "#ff9900"
      }
    ],
    spinNow: true,
    valueTitle: [],
    valueTitleTest: new Array(20).fill(0),
    currentItem: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    // 避免直接显示失败
    _this.setData({
      targetTime: new Date().getTime() + 23 * 60 * 60 * 1000
    });
    const db = wx.cloud.database()
    const _ = db.command
    let tempNum = []
    // 随机二十条题目
    for (let i = 0; i < 20; i++) {
      tempNum.push(random.randomNum(1, 5952))
    }
    db.collection('gc_all').where({
      id: _.in(tempNum)
    })
      .get({
        success: function (res) {
          _this.setData({
            valueTitle: res.data,
            spinNow: false,
            targetTime: new Date().getTime() + 60 * 1000
          })
        }
      })
  },
  onUnload() {
    this.setData({
      clearTimer: true
    });
  },
  endChange: function () {
    $Message({
      content: '时间到',
      type: 'error'
    });
  },
  /**
   * 选项
   * @param {e} 页面层传过来的数据 
   */
  select: function (e) {
    let _this = this
    let num = 0
    let metchValue = []
    let temp = `valueTitleTest[${e.currentTarget.dataset.index}]`
    _this.setData({
      [temp]: e.currentTarget.dataset.id
    })
    if (e.currentTarget.dataset.index + 1 < _this.data.valueTitle.length) {
      _this.setData({
        currentItem: e.currentTarget.dataset.index + 1
      })
    } else {
      let metchData = _this.replaceFun(this.data.valueTitleTest)
      num = metchData.num
      metchValue = metchData.textTempSwitch
      $Message({
        content: `对了${num}条题`,
        type: 'success'
      });
    }
  },
  /**
   * 匹配答案
   * @param {array}           答题完毕传入表单
   * @return {num ,textTempSwitch} 对的数目 , 传出格式化之后的值
   */
  replaceFun: function (array) {
    let _this = this
    let textTempSwitch = []
    let testMetch = false
    let num = 0
    array.map((value, index) => {
      if (_this.data.valueTitle[index].type != ('可回收垃圾' || '有害垃圾' || '湿垃圾' || '干垃圾')) {
        testMetch = ('其他垃圾' == _this.switchFunc(value))
      } else {
        testMetch = (_this.data.valueTitle[index].type == _this.switchFunc(value))
      }
      if (testMetch) {
        num++
      }
      textTempSwitch.push({
        'judge': testMetch,
        'typeTrue': _this.data.valueTitle[index].type,
        'text': _this.switchFunc(value)
      })
    })
    console.log(num, textTempSwitch)
    return {
      'num': num,
      'textTempSwitch': textTempSwitch
    }
  },
  /**
   * 传回类别
   * @param {typeNum}   传入的类别替换数 
   * @return {textTemp} 返回所属类别
   */
  switchFunc: function (typeNum) {
    let textTemp = ''
    switch (typeNum) {
      case 0:
        textTemp = '可回收垃圾'
        break;
      case 1:
        textTemp = '有害垃圾'
        break;
      case 2:
        textTemp = '湿垃圾'
        break;
      case 3:
        textTemp = '干垃圾'
        break;
      default:
        textTemp = '其他垃圾'
        break;
    }
    return textTemp
  }
})