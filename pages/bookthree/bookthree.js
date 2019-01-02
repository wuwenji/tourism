// pages/book/book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-12-01',
    newInfo: '',
    cancelMsg: '取消成功！',
    canmsgFlg: false,
    productId: '',
    bodyShow: true
  },
  callMe() {
    wx.makePhoneCall({
      phoneNumber: '15920421859',
    })
  },
  evaluationFun (e) {
    wx.navigateTo({
      url: '../score/score?productId=' + e.currentTarget.dataset.productid + '&orderCode=' + e.currentTarget.dataset.ordercode,
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
  cancelFun () {
    let that = this;
    wx.request({
      url: getApp().globalData.urlPage + 'travel/order/cancel',
      method: 'POST',
      data: {
        orderCode: that.data.newInfo.orderCode
      },
      success(resp) {
        if (resp.statusCode == 200) {
          if (resp.data.data.result == 1) {
            that.alertMeg('取消成功!')
            setTimeout(resp => {
              wx.switchTab({
                url: '../orders/orders'
              })
            }, 1000)
           
          } else {
            that.alertMeg(resp.data.data.msg)
          }
        }
      }
    })
  },
  goToDetail (e) {
    let id = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '../detail/detail?productID=' + id,
    })
  },
  alertMeg (val) {
    this.setData({
      cancelMsg: val,
      canmsgFlg: true
    })
    setTimeout(resp => {
      this.setData({
        canmsgFlg: false
      })
    }, 1000)
  },
  /* 支付 */
  payment () {
    console.log(1)
    wx.request({
      url: getApp().globalData.urlPage + 'travel/order/pay',
      method: 'POST',
      data: {
        orderCode: this.data.newInfo.orderCode
      },
      success (resp) {
        //console.log(resp)
        if (resp.data.data.msg == '支付成功!'){
          wx.reLaunch({
            url: '../msg/msg',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = 'TR-2018122813520'
    //this.getOrderInfo(orderId)
    this.getOrderInfo(options.orderNumber)
  },
  getOrderInfo(id) {
    let that = this;
    wx.request({
      url: getApp().globalData.urlPage + 'travel/order/info',
      method: 'POST',
      data: {
        orderCode: id
      },
      success(resp) {
        if(resp.statusCode == 200) {
          let data = resp.data.data
          that.setData({
            newInfo: data,
            productId: id,
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