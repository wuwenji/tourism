// pages/shoppingcart/shoppingcart.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0,
    cartId: [],
    shopings: []
  },
  checkboxChange (e) {
    var selectId = e.detail.value.map(resp => {
      return parseInt(resp)
    })
    this.setData({
      cartId: selectId
    })
    var pri = 0;
    this.data.shopings.map((item) => {
      if (selectId.indexOf(item.id) > -1) {
        pri += item.amount
      }
    })
    this.setData({
      totalPrice: pri.toFixed(2)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  cartFun (e) {
    //console.log(e.currentTarget.dataset.detail)
    let data = JSON.stringify(e.currentTarget.dataset.detail)
    wx.navigateTo({
      url: '../shoppingcartdetail/shoppingcartdetail?detailDate=' + data,
    })
  },
  getData () {
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/cart/list',
      method: 'POST',
      data: {
        userId: app.globalData.openId
      },
      success(resp) {
        if (resp.statusCode == 200) {
          let datas = resp.data.data
          datas = datas.map(resp => {
            resp.select = false;
            return resp;
          })
          that.setData({
            shopings: datas
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