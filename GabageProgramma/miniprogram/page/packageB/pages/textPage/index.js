const typeText = require("../../resources/js/type")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    loadShow: false,
    loadShowLoad: false,
    value: [],
    showModel: false,
    typeText: typeText.typeText,
    color: '',
    name: '',
    imageUrl: '',
    contentText: '',
    contentText2: '',
    imageUrlText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  query: function (e) {
    let _this = this
    const db = wx.cloud.database()
    // wx.request({
    //   url: 'http://118.178.181.46:5000/gc/'+_this.data.inputValue,
    //   success(e){
    //     console.log(e.data)
    //   }
    // })
    _this.setData({
      loadShowLoad: true
    })
    db.collection('gc_all').where({
      name: _this.data.inputValue
    }).get({
      success: function (res) {
        // res.data 包含该记录的数据
        if (res.data.length) {
          _this.setData({
            value: res.data,
            loadShow: false
          })
          // 当只有一条记录时候
          if (res.data.length == 1) {
            for (let i = 0; i < _this.data.typeText.length; i++) {
              if (_this.data.typeText[i].name == res.data[0].type) {
                _this.setData({
                  name: res.data[0].name,
                  imageUrl: _this.data.typeText[i].image,
                  color: _this.data.typeText[i].color,
                  contentText: _this.data.typeText[i].explain,
                  contentText2: _this.data.typeText[i].require,
                  imageUrlText: res.data[0].type,
                  showModel: true
                })
              }
            }
          }
        }
        _this.setData({
          loadShowLoad: false
        })
      }
    })
  },
  inputBind: function (res) {
    let _this = this
    _this.setData({
      inputValue: res.detail.value
    })
  },
  close: function () {
    let _this = this
    _this.setData({
      showModel: false
    })
  }
})