// pages/answer/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_page: 1,
    title: [{
      id: 1,
      name: '杀虫剂',
    }, {
      id: 2,
      name: '用过的湿纸巾'
    }, {
      id: 3,
      name: '贝壳'
    }, {
      id: 4,
      name: '可乐罐',
    }],

  },
  handleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        current_page: this.data.current_page + 1
      });
    } else if (type === 'prev') {
      this.setData({
        current_page: this.data.current_page - 1
      });
    }
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})