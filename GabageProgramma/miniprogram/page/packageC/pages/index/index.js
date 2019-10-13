// page/packageC//pages/index/index.js
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
    ]
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

  },
  buttonClick: function (e) {
    // e.currentTarget.dataset.id
    let _this = this
    wx.navigateTo({
      url: `../../pages/${_this.data.buttonText[e.currentTarget.dataset.id].click}/index`
    })
  }
})