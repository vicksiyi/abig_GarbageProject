const typeText = require("../../resources/js/type")
const randomNum = require("../../../../utils/random")
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
    imageUrlText: '',
    colorClass: ['blue', 'red', 'green', 'yellow'],
    dataColor: [],
    showEm: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  query: function (e) {
    let _this = this
    let queryName = e.currentTarget.dataset.msg || _this.data.inputValue
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
      name: queryName
    }).get({
      success: function (res) {
        // res.data 包含该记录的数据
        if (res.data.length) {
          _this.setData({
            value: res.data,
            loadShow: false
          })
          // 当选择的是历史记录时候
          if (!e.currentTarget.dataset.msg) {
            _this.localStore(res.data[0].type, queryName)
          }

          for (let i = 0; i < _this.data.typeText.length; i++) {
            if (_this.data.typeText[i].name == res.data[0].type) {
              _this.setData({
                name: res.data[0].name,
                imageUrl: _this.data.typeText[i].image,
                color: _this.data.typeText[i].color,
                contentText: _this.data.typeText[i].explain,
                contentText2: _this.data.typeText[i].require,
                imageUrlText: res.data[0].type,
                showModel: true,
                loadShowLoad: false
              })
            }
          }
        } else {
          let event = async () => {
            let dataTemp = await _this.requestData(queryName)
            if (dataTemp.length) {
              _this.setData({
                showEm: true
              })
            } else {
              _this.setData({
                showEm: false
              })
            }
            _this.setData({
              value: dataTemp,
              loadShowLoad: false,
            })
          }
          event()
        }
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
  },
  onShow: function () {
    let _this = this
    wx.getStorage({
      key: 'historyTag',
      success(res) {
        let dataTemp = JSON.parse(res.data)
        console.log(dataTemp)
        _this.setData({
          dataColor: dataTemp
        })
      }
    })
  },
  localStore: function (type, queryName) {
    let _this = this
    wx.getStorage({
      key: 'historyTag',
      success(re) {
        console.log(re.data, '数据')
        let dataTemp = JSON.parse(re.data)
        // 超过十条数据，则删除第一条 
        if (dataTemp.length >= 10) {
          dataTemp.splice(0, 1)
        }
        dataTemp.push({
          color: _this.selectColor(type),
          msg: queryName
        })
        wx.setStorage({
          key: "historyTag",
          data: JSON.stringify(dataTemp)
        })
        _this.onShow()
      },
      fail(err) { //没数据时候
        wx.setStorage({
          key: "historyTag",
          data: JSON.stringify([{
            color: _this.selectColor(type),
            msg: queryName
          }])
        })
        _this.onShow()
      }
    })
  },
  selectColor: function (type) {
    let _this = this
    console.log(type)
    let color = _this.data.colorClass[0]
    switch (type) {
      case '可回收垃圾':
        color = _this.data.colorClass[0]
        break;
      case '有害垃圾':
        color = _this.data.colorClass[1]
        break;
      case '湿垃圾':
        color = _this.data.colorClass[2]
        break;
      case '干垃圾':
        color = _this.data.colorClass[3]
        break;
      default:
        color = _this.data.colorClass[0]
        break;
    }
    console.log(color)
    return color
  },
  requestData: function (name) {
    let _this = this
    let temp = []
    wx.request({
      url: 'http://118.178.181.46:5000/gc/' + name,
      success(res) {
        if (res.data[0].status != -1) {
          temp = res.data
        }
      }
    })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(temp)
      }, 2000);
    })
  },
  showModelFun: function (res) {
    let _this = this
    let test = 0
    console.log(_this.data.value[res.currentTarget.dataset.id].type)
    for (let i = 0; i < _this.data.typeText.length; i++) {

      if (_this.data.typeText[i].name == _this.data.value[res.currentTarget.dataset.id].type || _this.data.typeText[i].name == _this.data.value[res.currentTarget.dataset.id].type + "垃圾") {
        _this.setData({
          name: _this.data.value[res.currentTarget.dataset.id].name,
          imageUrl: _this.data.typeText[i].image,
          color: _this.data.typeText[i].color,
          contentText: _this.data.typeText[i].explain,
          contentText2: _this.data.typeText[i].require,
          imageUrlText: _this.data.value[res.currentTarget.dataset.id].type,
          showModel: true
        })
        test = 1
      }
    }
    if (!test) {
      _this.setData({
        name: _this.data.value[res.currentTarget.dataset.id].name,
        imageUrl: '',
        color: '#2d8cf0',
        contentText: '暂无',
        contentText2: '',
        imageUrlText: _this.data.value[res.currentTarget.dataset.id].type,
        showModel: true
      })
    }
    _this.localStore(_this.data.value[res.currentTarget.dataset.id].type, _this.data.value[res.currentTarget.dataset.id].name)
  }
})