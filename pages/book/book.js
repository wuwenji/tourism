// pages/book/book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-12-01',
    name: '',
    alertFlg: false,
    alertMsg: '请填写完整信息！',
    planId: '',
    bodyShow: true,
    addressId: '',
    contact: {
      name: '',
      phone: '',
      email: ''
    },
    radioItems:[],
    tourists: []
  },
  addtouri: function() {
    wx.navigateTo({
      url: '../addtour/addtour',
    })
  },
  alertWindow (string) {
    this.setData({
      alertMsg: string,
      alertFlg: true
    })
    setTimeout(resp => {
      this.setData({
        alertFlg: false
      })
    }, 1000)
  },
  formSubmit: function (e) {
    let value = e.detail.value
    if (value.contactName == '' || value.contactPhone == '' || value.contactEmail == '') {
      this.alertWindow('请填写联系人信息！')
    } else if (this.data.tourists.length < 1) {
      this.alertWindow('请添加游客！')
    } else {
      let sentData = {
        planId: this.data.planId,
        addressId: this.data.addressId,
        contact: this.data.contact,
        tourId: this.data.tourists,
        contact: {
          name: value.contactName,
          phone: value.contactPhone,
          email: value.contactEmail
        },
        remarks: value.remarks || '无'
      }
      console.log(sentData.remarks)
      setTimeout(resp => {
        let str = JSON.stringify(sentData)
        wx.navigateTo({
          url: '../booktwo/booktwo?setData=' + str
        })
      }, 50)
    } 
  },
  radioChange: function (e) {
    var val = e.detail.value
    //console.log(val)
    this.setData({
      boardingPoint: val
    })
  },
  deleteTour: function (e) {
    var index_ = e.currentTarget.dataset.index
    var attr = this.data.tourists
    var attr_ = []
    for (var i in attr) {
      if (i != index_){
        attr_.push(attr[i])
      }
    }
    this.setData({
      tourists: attr_
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    let that = this;
    that.setData({
      name: options.planName,
      date: options.planDate,
      planId: options.planId
    })
    wx.request({
      url: getApp().globalData.urlPage + 'travel/productPlan/listAddress',
      method: 'POST',
      data: {
        planId: options.planId
      },
      success (resp) {
        if (resp.statusCode == 200) {
          let data = resp.data.data
          let obj = []
          for (var i = 0; i < data.length; i++) {
            obj.push({
              name: data[i].address,
              id: data[i].id,
              value: data[i].city + data[i].address,
              checked: i == 0? true: false
            })
          }
          that.setData({
            radioItems: obj,
            addressId: obj[0].id,
            bodyShow: false
          })
        }
      }
    })
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
    if (wx.getStorageSync('tour')) { 
      var obj_ = this.data.tourists
      // console.log(...wx.getStorageSync('tour'))
      obj_.push(...wx.getStorageSync('tour'))
      this.setData({
        tourists: obj_
      })
      wx.removeStorageSync('tour')
    }
    
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