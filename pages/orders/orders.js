var app = getApp();

Page({

  data: {
    currentTab: -1, //预设当前项的值
    order: [],
    bodyShow: true,

  },
  orderFun (e) {
    //console.log(e.currentTarget.dataset.orderid)
    wx.navigateTo({
      // url: '../orderdetail/orderdetail?orderNumber=' + e.currentTarget.dataset.orderid,
      url: '../bookthree/bookthree?orderNumber=' + e.currentTarget.dataset.orderid
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    this.setData({
      currentTab: cur
    })
    var index = cur == -1 ? 'null': cur; 
    this.getData(index)
  },
  getData (stuation) {
    let that = this;
    that.setData({
      bodyShow: true
    })
    wx.request({
      url: app.globalData.urlPage + 'travel/order/list',
      method: 'POST',
      data: {
        userId: app.globalData.openId,
        status: stuation
      },
      success(resp) {
        if (resp.statusCode == 200) {
          let lists = resp.data.data.list.map(resp => {
            if (resp.status == 0) {
              resp.status = '待付款'
            } else if (resp.status == 1) {
              resp.status = '已付款'
            } else if (resp.status == 2) {
              resp.status = '已确认'
            } else if (resp.status == 3) {
              resp.status = '已完成'
            } else if (resp.status == 4) {
              resp.status = '已取消'
            } else if (resp.status == 5) {
              resp.status = '退款中'
            } else if (resp.status == 6) {
              resp.status = '未付款'
            } else if (resp.status == 8) {
              resp.status = '不成团'
            }
            return resp
          })
          //console.log(lists)
          that.setData({
            order: lists,
            bodyShow: false
          })
        }
      }
    })
  },
  onLoad: function () { 
    // this.setData({
    //   order: order
    // })
    if (wx.getStorageSync('orderType_')) {
    } else {
      this.getData('null')
    }
    //this.getData('null')
    //console.log(wx.getStorageSync('orderType_'))
  },
  onShow: function () {
    if (wx.getStorageSync('orderType_')){
      this.getData(wx.getStorageSync('orderType_'))
      let cur = wx.getStorageSync('orderType_') == 'null' ? '-1' : wx.getStorageSync('orderType_')
      this.setData({
        currentTab: cur
      })
      wx.removeStorageSync('orderType_')
    } else {
      this.setData({
        currentTab: -1
      });
      this.getData('null')
    }
  }
})