Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // wx.navigateTo({
    //   url: "../../packageC/pages/infiniteNum/index"
    // })
    wx.getStorage({
      key: 'thems',
      success(res) {
        wx.redirectTo({
          url: res.data
        })
      },
      fail() {
        wx.redirectTo({
          url: '../thems/index'
        })
      }
    })
  }
})