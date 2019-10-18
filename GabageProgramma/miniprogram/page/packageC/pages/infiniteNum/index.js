const random = require("../../../../utils/random")
const { $Message } = require('../../../../dist/base/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numOne: 1,
    spinNow: true,
    nameOne: '',
    msgOne: '',
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
    trueOne: 0,
    userInfo: [],
    showImgNow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      showImgNow: true
    })
    // 加载题目
    _this.spinChange()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this
    wx.getStorage({
      key: 'UserInfo',
      success(res) {
        _this.setData({
          userInfo: JSON.parse(res.data).userInfo
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let _this = this
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'login',
      success(res) {
        db.collection('gc_userNum').where({
          _openid: res.result.openid
        })
          .get({
            success: function (re) {
              if (!re.data.length) {
                db.collection('gc_userNum').add({
                  data: {
                    allOne: _this.data.numOne,
                    trueOne: _this.data.trueOne,
                    avatarUrl: _this.data.userInfo.avatarUrl,
                    nickName: _this.data.userInfo.nickName
                  }
                })
              } else {
                db.collection('gc_userNum').doc(re.data[0]._id).update({
                  // data 传入需要局部更新的数据
                  data: {
                    allOne: _this.data.numOne + re.data[0].allOne,
                    trueOne: _this.data.trueOne + re.data[0].trueOne
                  },
                  success: function (e) {
                    console.log(e.data)
                  }
                })
              }
            }
          })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  spinChange: function () {
    let _this = this
    _this.setData({
      spinNow: true
    })
    const db = wx.cloud.database()
    db.collection('gc_all').where({
      id: random.randomNum(1, 5952)
    })
      .get({
        success: function (res) {
          _this.setData({
            msgOne: res.data[0].type,
            nameOne: res.data[0].name,
            spinNow: false
          })
        }
      })
  },
  // 提交答案
  select: function (e) {
    let _this = this
    _this.setData({
      spinNow: true
    })
    let metchResponse = _this.selectMetch(e.currentTarget.dataset.id)
    if (metchResponse) {
      _this.setData({
        trueOne: _this.data.trueOne + 1
      })
      $Message({
        content: `回答正确${_this.data.trueOne}题`,
        type: 'success'
      });
    } else {
      $Message({
        content: '回答错误',
        type: 'error'
      });
    }
    setTimeout(() => {
      _this.spinChange()
      _this.setData({
        numOne: _this.data.numOne + 1
      })
    }, 2000);
  },
  /**
   * 匹配类型
   * @param {typeNum}   传入的类别替换数 
   * @return {textTemp} 返回所属类别
   */
  selectTest: function (typeNum) {
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
  },
  /**
   * 验证答案
   * @param {typeNum}   传入的类别替换数 
   * @return {true|false} 是否正确
   */
  selectMetch: function (typeNum) {
    let _this = this
    console.log(_this.data.msgOne)
    let textTemp = _this.selectTest(typeNum)
    if (textTemp == _this.data.msgOne) {
      return true
    } else {
      return false
    }
  },
  showImg: function () {
    let _this = this
    if (!_this.data.showImgNow) {
      _this.setData({
        showImgNow: true
      })
    }
  },
  closeImg: function () {
    let _this = this
    if (_this.data.showImgNow) {
      _this.setData({
        showImgNow: false
      })
    }
  }
})