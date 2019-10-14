const { $Toast } = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 八大主题
    thems: [
      {
        "color": "#2C3E50",
        "image": "http://118.178.181.46/thems/1.jpg",
        "logo": "../resources/images/1.png",
        "url": "../../packageF/pages/index/index",
        "text": "稳重"
      },
      {
        "color": "#ff9900",
        "image": "http://118.178.181.46/thems/2.jpg",
        "logo": "../resources/images/2.png",
        "url": "../../packageG/pages/index/index",
        "text": "温和"
      },
      {
        "color": "#19be6b",
        "image": "http://118.178.181.46/thems/3.jpg",
        "logo": "../resources/images/3.png",
        "url": "../../packageE/pages/index/index",
        "text": "青春"
      },
      {
        "color": "#AEDD81",
        "image": "http://118.178.181.46/thems/4.jpg",
        "logo": "../resources/images/4.png",
        "url": "../../packageH/pages/index/index",
        "text": "庄重"
      },
      {
        "color": "#84AF9B",
        "image": "http://118.178.181.46/thems/5.jpg",
        "logo": "../resources/images/5.png",
        "url": "../../packageI/pages/index/index",
        "text": "希望"
      },
      {
        "color": " #2d8cf0",
        "image": "http://118.178.181.46/thems/6.jpg",
        "logo": "../resources/images/6.png",
        "url": "../../packageJ/pages/index/index",
        "text": "清新"
      },
      {
        "color": "#1c2438",
        "image": "http://118.178.181.46/thems/7.jpg",
        "logo": "../resources/images/7.png",
        "url": "../../packageK/pages/index/index",
        "text": "静寂"
      },
      {
        "color": "#FC9D99",
        "image": "http://118.178.181.46/thems/8.jpg",
        "logo": "../resources/images/8.png",
        "url": "../../packageL/pages/index/index",
        "text": "热情"
      }
    ],
    currentImg: 0,
    titleColor: '#2C3E50'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'thems',
      success(res) {
        wx.redirectTo({
          url: res.data
        })
      },
      fail() {
        $Toast({
          content: '请选择您喜欢的主题进入系统'
        });
      }
    })
  },
  themsChange: function (e) {
    let _this = this
    _this.setData({
      currentImg: e.detail.current,
      titleColor: _this.data.thems[e.detail.current].color
    })
  },
  navChange: function (e) {
    wx.setStorage({
      key: "thems",
      data: e.currentTarget.dataset.nav
    })
    wx.redirectTo({
      url: e.currentTarget.dataset.nav
    })
  }
})