// pages/score/score.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xings: [
      '../../images/scor_.png', 
      '../../images/scor_.png', 
      '../../images/scor_.png',
      '../../images/scor_.png',
      '../../images/scor_.png',
    ],
    stars: 0,
    labels: [],
    selectLabels: [],
    selecs:{},
    productId: 0,
    orderCode: 0,
    successFlg: false
  },
  xingFun (e) {
    var number = e.currentTarget.dataset.index + 1
    var attrs = []
    for (var i = 0; i < number; i++) {
      attrs.push('../../images/scor.png')
    }
    if (number < 5) {
      for (var i = 0; i< 5 - number; i++) {
        attrs.push('../../images/scor_.png')
      }
    }
    this.setData({
      xings: attrs,
      stars: number
    })
  },
  selectLabel (e) {
    let id = e.currentTarget.dataset.labelid
    let selects = this.data.selectLabels
    let sels = this.data.selecs
    if (selects.indexOf(id) > -1) {
      selects.splice(selects.indexOf(id), 1)
      sels[id] = false
      this.setData({
        selecs: sels
      })
    } else {
      selects.push(id)
      sels[id] = true
      this.setData({
        selecs: sels
      })
    } 
  },
  formSubmit: function (e) {
    let that = this;
    let setData = {
      orderCode: this.data.orderCode,
      productId: this.data.productId,
      content: e.detail.value.content,
      userId: app.globalData.openId,
      stars: this.data.stars,
      labelIdList: this.data.selectLabels  
    }
    //console.log(setData)
    wx.request({
      url: app.globalData.urlPage + 'travel/evaluation/save',
      method: 'POST',
      data: setData,
      success(resp) {
        if (resp.statusCode == 200) {
          that.setData({
            successFlg: true
          })
          setTimeout(() => {
            that.setData({
              successFlg: false
            })
            wx.switchTab({
              url: '../orders/orders'
            })
          }, 1000)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      productId: options.productId,
      orderCode: options.orderCode
    })
    this.getLabels(options.productId)
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
  getLabels (id) {
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/evaluation/listLabel',
      method: 'POST',
      data: {
        productId: id
      },
      success(resp) {
        if (resp.statusCode == 200) {
          //console.log(resp)
          let data = resp.data.data
          let selecs_ = {}
          data.map(resp => {
            selecs_[resp.id] = false
          })
          that.setData({
            labels: resp.data.data,
            selecs: selecs_
          })
        }
      }
    })
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