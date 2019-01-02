// pages/scorelist/scorelist.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bodyShow: true,
    avatars: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.productId)
    //let productId = 28
    this.getData(options.productId)
  },
  getData (id) {
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/evaluation/list',
      method: 'POST',
      data: {
        productId: id
      },
      success(resp) {
        if (resp.statusCode == 200) {
          console.log(resp)
          that.setData({
            avatars: resp.data,
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