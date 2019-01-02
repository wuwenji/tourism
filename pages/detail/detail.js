// pages/detail/detail.js
var app = getApp()
var WxParse = require('../../utils/wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,//是否自动切换
    indicatorDots: true,//是否显示圆点
    bodyShow: true,
    showProduct: '',
    producId: '',
    evaluations: [],
    dates: [],
    interval: 5000,//自动切换间隔
    duration: 500, //滑动动画时长
    indicatorColor: "rgba(255, 255, 255, .3)",//滑动圆点颜色
    indicatorActiveColor: "#fff", //当前圆点颜色
    current: 0, //当前所在页面的 index
    productDetail: '',
    plan: 4,
    plandate: '',
    circular: true, //是否采用衔接滑动
    banners: ['../../images/u6392.png', '../../images/u6392.png', '../../images/u6392.png']
  },
  gotoDate: function () {
    wx.navigateTo({
      url: '../date/date',
    })
  },
  next: function (e) {
    app.globalData.shoppingCar = e.currentTarget.dataset.shoppingcar
    //console.log(e)
   
    wx.navigateTo({
      url: '../book/book?planId=' + e.currentTarget.dataset.planid + '&planName=' + e.currentTarget.dataset.name + '&planDate=' + e.currentTarget.dataset.date
    })
  },
  goToScore (e) {
    wx.navigateTo({
      url: '../scorelist/scorelist?productId=' + e.currentTarget.dataset.productid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.productID)
    this.getProduct(options.productID)
    this.getEval(options.productID)
    this.setData({
      producId: options.productID
    })
    //this.getProduct(4)
  },
  getEval (id) {
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/evaluation/list',
      method: 'POST',
      data: {
        productId: id
      },
      success(resp) {
        if (resp.statusCode == 200) {
          let data = resp.data
          if (data.length > 2) {
            data.length = 2
          }
          that.setData({
            evaluations: data
          })
          console.log(that.data.evaluations)
        }
      }
    })
  },
  getProduct (id) {
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/product/detail',
      method: 'POST',
      data: {
        id: id
      },
      success(resp) {
        if (resp.statusCode == 200) {
          //console.log(resp.data)
          let plans = resp.data.productPlans.map(resp => {
            let time = resp.startDate.slice(5, 7) + '月' + resp.startDate.slice(8, 10) + '日'
            let planDate = resp.startDate.slice(0, 10)
            resp.date = planDate
            resp.startDate = time 
            return resp
          })
          let obj = []
          for (var i = 0; i < resp.data.productPlans.length; i++) {
            obj.push(resp.data.productPlans[i])
          }
          // if (plans.length > 3) {
          //   for (var i = 0; i < 3; i++) {
          //     obj.push(plans[i])
          //   }
          // } else {
          //   for (var i = 0; i < resp.data.productPlans.length; i++) {
          //     obj.push(resp.data.productPlans[i])
          //   }
          // }
          let features = resp.data.product.features
          WxParse.wxParse('article', 'html', features, that, 0)
          let introduction = resp.data.product.introduction
          WxParse.wxParse('introduction', 'html', introduction, that, 0)
          let notes_ = resp.data.product.notes
          WxParse.wxParse('product', 'html', notes_, that, 0)
          let attention = resp.data.product.attention
          WxParse.wxParse('attention', 'html', attention, that, 0)
          that.setData({
            productDetail: resp.data,
            banners: resp.data.product.images,
            dates: obj,
            plan: obj[0].id,
            plandate: obj[0].date,
            showProduct: obj[0],
            bodyShow: false
          })
        }
      }
    })
  },
  /**更换日期 */
  planClick (e) {
    //console.log(e.currentTarget.dataset.date)
    console.log(e.currentTarget.dataset.showproduct)
    this.setData({
      plan: e.currentTarget.dataset.planid,
      plandate: e.currentTarget.dataset.date,
      showProduct: e.currentTarget.dataset.showproduct
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