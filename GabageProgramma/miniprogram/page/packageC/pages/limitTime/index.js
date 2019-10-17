const random = require("../../../../utils/random")
const { $Message } = require('../../../../dist/base/index');
const wxml2canvas = require('../../../../utils/wxml2canvas.js')
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
    valueTitleTest: new Array(20).fill(5),
    currentItem: 0,
    currentNum: 0,
    bottonText: '查看答案',
    endValue: [],
    showMetch: false,
    numMetch: 0,
    numPersent: 0,
    className: '',
    showImg: false,
    result: 0,
    userInfo: [],
    width: '',
    height: ''
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
          if (res.data.length == 20) {
            _this.setData({
              valueTitle: res.data,
              spinNow: false,
              targetTime: new Date().getTime() + 1.5 * 60 * 1000
            })
          } else {
            setTimeout(() => {
              $Message({
                content: '系统内部出错',
                type: 'error'
              });
              wx.redirectTo({
                url: '../index/index'
              })
            }, 2000)
          }
        }
      })
  },
  onShow: function () {
    let _this = this
    wx.getStorage({
      key: 'UserInfo',
      success(res) {
        _this.setData({
          userInfo: JSON.parse(res.data).userInfo
        })
        console.log(JSON.parse(res.data).userInfo)
      }
    })


    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          width: res.screenWidth,
          height: res.screenHeight
        })
      }
    });
  },
  onUnload() {
    this.setData({
      clearTimer: true
    });
  },
  endChange: function () {
    let _this = this
    $Message({
      content: '时间到',
      type: 'error'
    });
    let metchData = _this.replaceFun(this.data.valueTitleTest)
    let persent = parseInt(100 - (metchData.empty / 20) * 100)
    let resultTemp = metchData.num * 5 * persent * 0.01
    _this.setData({
      endValue: metchData.textTempSwitch,
      showMetch: true,
      numMetch: metchData.num,
      numPersent: persent,
      result: resultTemp,
      className: _this.classNameFunc(resultTemp)
    })
  },
  /**
   * 选项
   * @param {e} 页面层传过来的数据 
   */
  select: function (e) {
    let _this = this
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
      let persent = parseInt(100 - (metchData.empty / 20) * 100)
      let resultTemp = metchData.num * 5 * persent * 0.01
      _this.setData({
        endValue: metchData.textTempSwitch,
        showMetch: true,
        numMetch: metchData.num,
        numPersent: persent,
        result: resultTemp,
        className: _this.classNameFunc(resultTemp)
      })
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
    let empty = 0
    array.map((value, index) => {
      if (_this.switchMetchFunc(_this.data.valueTitle[index].type)) {
        testMetch = ('其他垃圾' == _this.switchFunc(value))
      } else {
        testMetch = (_this.data.valueTitle[index].type == _this.switchFunc(value))
      }
      if (testMetch) {
        num++
      }
      // 完成百分率
      if (value == 5) {
        empty++
      }
      textTempSwitch.push({
        'judge': testMetch,
        'typeTrue': _this.data.valueTitle[index].type,
        'text': _this.switchFunc(value),
        'name': _this.data.valueTitle[index].name
      })
    })
    console.log(array)
    return {
      'num': num,
      'empty': empty,
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
      case 4:
        textTemp = '其他垃圾'
        break;
      default:
        textTemp = '未选'
        break;
    }
    return textTemp
  },
  // 查看分数
  showMetch: function () {
    let _this = this
    if (_this.data.bottonText == '查看答案') {
      _this.setData({
        bottonText: '查看分数',
        currentNum: 1
      })
    } else {
      _this.setData({
        bottonText: '查看答案',
        currentNum: 0
      })
    }
  },
  /**
   * 除了四大类型以外其他都是其他类型
   * @param {type} 类型 
   * @return {tempTest} 格式化后类型
   */
  switchMetchFunc: function (type) {
    let tempTest = false
    switch (type) {
      case '可回收垃圾':
      case '有害垃圾':
      case '湿垃圾':
      case '干垃圾':
        tempTest = false
        break;
      default:
        tempTest = true
        break;
    }
    return tempTest
  },
  // 上传错误
  submitError: function (e) {
    console.log(e)
  },
  onceAgain: function () {
    wx.redirectTo({
      url: './index'
    })
  },
  close: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  /**
   * 根据得分给称号
   * @param {num} 得分 
   * @return {text} 称号
   */
  classNameFunc: function (num) {
    let texTemp = ['初出茅庐', '初窥门径', '略有小成', '炉火纯青', '傲视群雄', '登峰造极', '所向披靡', '举世无双', '答题星耀', '答题机器']
    let text = ''
    let data = [
      {
        max: 10,
        min: 0
      },
      {
        max: 20,
        min: 10
      },
      {
        max: 30,
        min: 20
      },
      {
        max: 40,
        min: 30
      },
      {
        max: 50,
        min: 40
      },
      {
        max: 60,
        min: 50
      },
      {
        max: 70,
        min: 60
      },

      {
        max: 80,
        min: 70
      },
      {
        max: 90,
        min: 80
      }
    ]
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].min, data[i].max)
      if (num >= data[i].min && num < data[i].max) {
        text = texTemp[i]
        break;
      } else {
        text = '答题机器'
      }
    }
    return text
  },
  // 分享成绩
  handleShare: function () {
    let _this = this
    console.log("分享")
    _this.setData({
      showImg: true
    })
  },
  // 关闭
  showMove: function () {
    let _this = this
    console.log("取消分享")
    _this.setData({
      showImg: false
    })
  },
  // 分享图
  drawCanvas: function () {
    let _this = this
    _this.setData({
      spinNow: true
    })
    wx.getImageInfo({ // 或者用wx.downloadFile
      src: _this.data.userInfo.avatarUrl,
      success: re => {
        let tempPath = re.path


        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#wrapper').boundingClientRect()
        query.exec(function (res) {
          console.log(res[0].width, res[0].height)
          const ctx = wx.createCanvasContext('canvas-map')
          console.log(res[0].width, res[0].height)
          // 背景图片
          ctx.drawImage('../../resources/images/can.jpg', 0, 0, ((804 / 2) * _this.data.width) / 375, ((2093 / 2) * _this.data.height) / 667)
          ctx.setFontSize(20)
          ctx.setFillStyle('#fff')
          let str = '环境护卫队-限时挑战赛'
          ctx.fillText(str, (804 / 2 - ctx.measureText(str).width) * 0.5, (804 / 2) * 0.1)

          // 头像 + 昵称
          // ctx.save(); // 先保存状态 已便于画完圆再用
          // ctx.beginPath(); //开始绘制
          // ctx.arc(100, 100, 100, 0, Math.PI * 2, false)
          // ctx.clip();
          ctx.drawImage(tempPath, ((804 / 2) * 0.5 - 30), 60, 60, 60)
          // ctx.restore();
          // let str2 = _this.data.userInfo.nickName
          // ctx.setFontSize(20)
          // ctx.setFillStyle('#fff')
          // ctx.fillText(str2, ((804 / 2) - ctx.measureText(str2).width) * 0.5, 120)

          if (_this.data.result >= 60) {
            // 认证
            ctx.drawImage('../../resources/images/oauth2.png', ((804 / 2) * 0.5 + 75), 50, 50, 50)
          } else {
            // 认证
            ctx.drawImage('../../resources/images/nooauth.png', ((804 / 2) * 0.5 + 75), 50, 50, 50)
          }


          // 称号
          let str_03 = `「${_this.data.className}」`
          ctx.setFontSize(22)
          ctx.setFillStyle('#f4ea2a')
          ctx.fillText(str_03, ((804 / 2) - ctx.measureText(str_03).width) * 0.5, 148)
          // 比率
          let str3 = `完成率：${_this.data.numPersent}%`
          ctx.setFontSize(15)
          ctx.setFillStyle('#fff')
          ctx.fillText(str3, 30, 168)

          let str4 = `得分：${_this.data.result}`
          ctx.setFontSize(15)
          ctx.setFillStyle('#fff')
          ctx.fillText(str4, (ctx.measureText(str3).width + 60), 168)

          let str5 = '击败：19.5%达人'
          ctx.setFontSize(15)
          ctx.setFillStyle('#fff')
          ctx.fillText(str5, (ctx.measureText(str3).width + ctx.measureText(str4).width + 85), 168)
          let temp01 = ''
          let temp02 = ''
          let temp03 = ''
          _this.data.endValue.map((value, index) => {
            temp01 = value.name
            temp02 = value.typeTrue
            temp03 = value.text
            if (value.judge) {
              // 正确
              ctx.setFontSize(18)
              ctx.setFillStyle('#19be6b')
              ctx.fillText(temp01, (16), (264 * _this.data.height) / 667 + index * 20)
              ctx.setFontSize(18)
              ctx.setFillStyle('#19be6b')
              ctx.fillText(temp02, (160), (264 * _this.data.height) / 667 + index * 20)
              ctx.setFontSize(18)
              ctx.setFillStyle('#19be6b')
              ctx.fillText(temp03, (280), (264 * _this.data.height) / 667 + index * 20)
            } else {
              // 错误
              ctx.setFontSize(18)
              ctx.setFillStyle('#495056')
              ctx.fillText(temp01, (16), (264 * _this.data.height) / 667 + index * 20)
              ctx.setFontSize(18)
              ctx.setFillStyle('#495056')
              ctx.fillText(temp02, (160), (264 * _this.data.height) / 667 + index * 20)
              ctx.setFontSize(18)
              ctx.setFillStyle('#ed3f14')
              ctx.fillText(temp03, (280), (264 * _this.data.height) / 667 + index * 20)
              // 删除线
              ctx.beginPath()
              ctx.moveTo(280 + ctx.measureText(temp03).width, (264 * _this.data.height) / 667 - 4 + index * 20)
              ctx.lineTo(280, (264 * _this.data.height) / 667 - 4 + index * 20)
              ctx.stroke()
            }
          })
          ctx.draw(true, _this.saveImage())
        })
      }
    })
  },
  // 保存图片
  saveImage() {
    let _this = this
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'canvas-map',
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              console.log(res.tempFilePath)
              _this.setData({
                spinNow: false
              })
              $Message({
                content: '图片已保存到相册',
                type: 'success'
              });
            },
            fail(err) {
              console.log(err)
              // if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
              //   console.log("打开设置窗口");
              //   wx.openSetting({
              //     success(settingdata) {
              //       console.log(settingdata)
              //       if (settingdata.authSetting["scope.writePhotosAlbum"]) {
              //         console.log("获取权限成功，再次点击图片保存到相册")
              //       } else {
              //         console.log("获取权限失败")
              //       }
              //     }
              //   })
              // }
            }
          });
        }
      });
    }, 3000)
  }
})