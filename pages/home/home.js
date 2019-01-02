// pages/home/home.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,//是否自动切换
    city: '广州市',
    // openId: '',
    bodyShow: true,
    indicatorDots: true,//是否显示圆点
    interval: 5000,//自动切换间隔
    duration: 500, //滑动动画时长
    indicatorColor: "rgba(0, 0, 0, .3)",//滑动圆点颜色
    indicatorActiveColor: "#fff", //当前圆点颜色
    current: 0, //当前所在页面的 index
    circular: true, //是否采用衔接滑动
    hotSpots:[],
    localTour: [],
    guessLike: [],
    aroundTour: [],
    banners: []
  },
  changeCity: function () {
    var url = '../switchcity/switchcity?city=' + this.data.city
    wx.navigateTo({
      url: url,
    })
  },
  goDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail?productID=' + e.currentTarget.dataset.id,
    })
  },
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  goLocal: function (e) {
    wx.navigateTo({
      url: '../local/local?type=' + e.currentTarget.dataset.type,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('openID:' + app.globalData.openId)
    this.getBanner()
    // setTimeout(resp => {
    //   console.log('openID:' + app.globalData.openId)
    //   this.setData({
    //     openId: app.globalData.openId
    //   })
    // }, 3000)
  },
  /*获取banner*/
  getBanner () {
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/index/advertisingPictureList',
      success(resp) {
        that.setData({
          banners: resp.data.advertisingPictures
        })
      }
    })
  },
  /*banner点击跳转*/
  imgClick (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.href
    })
  },
  /* 获取产品 */
  getProducts () {
    let that = this;
    let requestUrl = app.globalData.urlPage +  'travel/product/productList'
    wx.request({
      url: requestUrl,
      method: 'POST',
      data: {
        type: 1,
        sort: 1
      },
      success(resp) {
        if (resp.statusCode == 200) {
          if (resp.data.data.length > 8) {
            resp.data.data.length = 8
          }
          that.setData({
            aroundTour: resp.data.data,
            bodyShow: false
          })
        }
      }
    })

    wx.request({
      url: requestUrl,
      method: 'POST',
      data: {
        city: app.globalData.cityCode,
        type: 2,
        sort: 1
      },
      success(resp) {
        if (resp.statusCode == 200) {
          if (resp.data.data.length > 8){
            resp.data.data.length = 8
          }
          that.setData({
            localTour: resp.data.data
          })
        }
      }
    })

    wx.request({
      url: requestUrl,
      method: 'POST',
      data: {
        city: app.globalData.cityCode,
        type: 5,
        sort: 1
      },
      success(resp) {
        if (resp.statusCode == 200) {
          if (resp.data.data.length > 8) {
            resp.data.data.length = 8
          }
          that.setData({
            hotSpots: resp.data.data
          })
        }
      }
    })

    wx.request({
      url: requestUrl,
      method: 'POST',
      data: {
        city: app.globalData.cityCode,
        type: 6,
        sort: 1
      },
      success(resp) {
        //console.log(resp)
        if (resp.statusCode == 200) {
          if (resp.data.data.length > 8) {
            resp.data.data.length = 8
          }
          that.setData({
            guessLike: resp.data.data
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
    this.setData({
      city: app.globalData.city
    })
    this.getProducts()
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