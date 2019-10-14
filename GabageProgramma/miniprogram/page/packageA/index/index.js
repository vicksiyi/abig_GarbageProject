// page/packageE//pages/index/index.js
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
        "url": "../../../packageF/pages/index/index"
      },
      {
        "color": "#ff9900",
        "image": "http://118.178.181.46/thems/2.jpg",
        "logo": "../resources/images/2.png",
        "url": "../../../packageG/pages/index/index"
      },
      {
        "color": "#19be6b",
        "image": "http://118.178.181.46/thems/3.jpg",
        "logo": "../resources/images/3.png",
        "url": "../../../packageE/pages/index/index"
      },
      {
        "color": "#AEDD81",
        "image": "http://118.178.181.46/thems/4.jpg",
        "logo": "../resources/images/4.png",
        "url": "../../../packageH/pages/index/index"
      },
      {
        "color": "#84AF9B",
        "image": "http://118.178.181.46/thems/5.jpg",
        "logo": "../resources/images/5.png",
        "url": "../../../packageI/pages/index/index"
      },
      {
        "color": " #2d8cf0",
        "image": "http://118.178.181.46/thems/6.jpg",
        "logo": "../resources/images/6.png",
        "url": "../../../packageJ/pages/index/index"
      },
      {
        "color": "#1c2438",
        "image": "http://118.178.181.46/thems/7.jpg",
        "logo": "../resources/images/7.png",
        "url": "../../../packageK/pages/index/index"
      },
      {
        "color": "#FC9D99",
        "image": "http://118.178.181.46/thems/8.jpg",
        "logo": "../resources/images/8.png",
        "url": "../../../packageL/pages/index/index"
      }
    ],
    currentImg: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  themsChange: function (e) {
    let _this = this
    console.log(e.detail.current)
    _this.setData({
      currentImg: e.detail.current
    })
  },
  locationChange:function(e){
    console.log(e)
  }
})