const app = getApp()
const { $Message } = require('../../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonText: [
      {
        "click": "limitTime",
        "name": "限时答题"
      },
      {
        "click": "infiniteNum",
        "name": "无限答题"
      },
      {
        "click": "testTitle",
        "name": "在线测试"
      }
    ],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.userInfo)
  },
  getUserInfo: function (e) {
    let _this = this
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log(e.detail.errMsg)
    if (e.detail.errMsg != 'getUserInfo:fail auth deny') {
      wx.setStorage({
        key: "UserInfo",
        data: JSON.stringify(e.detail)
      })
      wx.navigateTo({
        url: `../../pages/${_this.data.buttonText[e.currentTarget.dataset.id].click}/index`
      })
    } else {
      $Message({
        content: '必须授权才可进入',
        type: 'warning'
      });
    }
  }
})