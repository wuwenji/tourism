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
    bodyShow: false
  },
  callMe() {
    wx.makePhoneCall({
      phoneNumber: '15920421859',
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  cancelFun () {

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
    wx.request({
      url: getApp().globalData.urlPage + 'travel/order/pay',
      method: 'POST',
      data: {
        orderCode: this.data.newInfo.orderCode
      },
      success (resp) {
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
    let setData = JSON.parse(options.detailDate)
    console.log(setData)
    this.setData({
      newInfo: setData
    })
    // let orderId = 'TR-2018122813520'
    // //this.getOrderInfo(orderId)
    // this.getOrderInfo(options.orderNumber)
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