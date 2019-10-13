// page/packageC//pages/limitTime/index.js
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      targetTime: new Date().getTime() + 14 * 1000
    });
  },
  onUnload() {
    this.setData({
      clearTimer: true
    });
  },
  endChange: function () {
    console.log('结束')
  },
  select:function(e){
    console.log(e.currentTarget.dataset.id)
    
  }
})