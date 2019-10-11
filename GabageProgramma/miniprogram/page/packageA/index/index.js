//index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navtext: "圾不可错",
    current: 'homepage',
    admin: false,
    spinShow: false,
    currentTab2: 'tab1Tab2',
    indicatorDots: false,
    autoplay: false,
    circular: true,
    currentItem: 0,
    currentItemList: 0,
    height: '',
    left: "70",
    color: "#2d8cf0",
    contentData: [],
    type: [{
      "image": "../resources/images/tcimg01.png",
      "name": "可回收垃圾",
      "color": "#2d8cf0",
      "margin": "70",
      "explain": "废纸张、废塑料、废玻璃制品、废金属、废织物等适宜回收、可循环利用的生活废弃物"
    },
    {
      "image": "../resources/images/tcimg02.png",
      "name": "有害垃圾",
      "color": "#ed3f14",
      "margin": "270",
      "explain": "对人体健康或自然环境造成直接或潜在的危害废弃物。"
    },
    {
      "image": "../resources/images/tcimg03.png",
      "name": "湿垃圾",
      "color": "#664035",
      "margin": "460",
      "explain": "部分地区又称”厨余垃圾”，日常生活垃圾产生的容易腐烂的生物质废物。"
    },
    {
      "image": "../resources/images/tcimg04.png",
      "name": "干垃圾",
      "color": "#495060",
      "margin": "640",
      "explain": "部分地区又称”其他垃圾”，除有害垃圾、可回收物、湿垃圾以外的生活废弃物。"
    }
    ],
    inputLogo: [
      {
        "image": "../resources/images/1.png",
        "text": "文字搜索"
      },
      {
        "image": "../resources/images/2.png",
        "text": "拍照识别"
      },
      {
        "image": "../resources/images/3.png",
        "text": "语音识别"
      }
    ],
    thisCurrent:'',
    thisPage:['textPage','imagePage','videoPage']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleChange: function (res) {
    let _this = this;
    let currentNumItem = 0
    _this.setData({
      current: res.detail.key
    })
    if (_this.data.current == 'group') {
      _this.setData({
        spinShow: true
      })
      wx.request({
        url: 'http://118.178.181.46:5000/gcurl',
        success(res) {
          _this.setData({
            spinShow: false,
            contentData: res.data
          })
        }
      })
      currentNumItem = 1
    } else if (_this.data.current == 'remind') {
      currentNumItem = 2
    } else if (_this.data.current == 'mine') {
      currentNumItem = 3
    } else {
      currentNumItem = 0
    }
    _this.setData({
      currentItem: currentNumItem
    })
  },
  // 导航
  bindChange: function (res) {
    let _this = this
    _this.setData({
      current: res.detail.currentItemId
    })
  },
  onShow: function () {
    let _this = this
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          height: parseInt(res.windowHeight) - 83 + ''
        })
      }
    });
  },
  // list改变swipter
  changeItem: function (res) {
    let _this = this;
    _this.setData({
      currentItemList: res.currentTarget.dataset.id,
      color: _this.data.type[res.currentTarget.dataset.id].color
    })
    this.setInterMargin(_this.data.type[res.currentTarget.dataset.id].margin)
  },
  // swipter改变list
  bindChangeList: function (res) {
    let _this = this;
    _this.setData({
      color: _this.data.type[res.detail.current].color
    })
    this.setInterMargin(this.data.type[res.detail.current].margin)
  },
  // 滑动箭头
  setInterMargin: function (endList) {
    let _this = this;
    // 终点位置&起始相对位置
    if (Number(this.data.left) > Number(endList)) {
      var lefts = setInterval(() => {
        _this.setData({
          left: Number(this.data.left) - 10 + ""
        })
        if (Number(this.data.left) >= Number(endList)) {
          clearInterval(lefts)
          _this.setData({
            left: endList
          })
        }
      }, 1)
    } else {
      var right = setInterval(() => {
        _this.setData({
          left: Number(this.data.left) + 10 + ""
        })
        if (Number(this.data.left) >= Number(endList)) {
          clearInterval(right)
          _this.setData({
            left: endList
          })
        }
      }, 1)
    }
  },
  handleChangeTab2({
    detail
  }) {
    let _this = this
    _this.setData({
      currentTab2: detail.key
    });
  },
  swiperChange: function (res) {
    let _this = this
    _this.setData({
      thisCurrent: res.detail.current
    })
  },
  swiperClick:function(res){
    let _this = this
    wx.navigateTo({
      url: '../../packageB/pages/' + _this.data.thisPage[res.currentTarget.dataset.id] + '/index'
    })
  }
})