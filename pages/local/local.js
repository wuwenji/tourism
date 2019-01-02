var app = getApp();

Page({
  data: {
    currentTab: 0, //预设当前项的值
    date: '选择日期',
    dayu: '>',
    xiaoyu: '<',
    productLabelList: '',
    type: '',
    screenShow: false,
    screenProducts: [],
    screenType: 0,
    selectValue: {},
    products: [],
    sxFlg: true,
    bodyShow: true
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  swichNav (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.index,
      sxFlg: true
    })
    this.getProduct(this.data.type, e.currentTarget.dataset.index)
  },
  shuiXun (e) {
    let that = this;
    this.setData({
      currentTab: e.currentTarget.dataset.index,
      sxFlg: false,
      screenType: 0
    })
    wx.request({
      url: app.globalData.urlPage + 'travel/index/productLabelList',
      method: 'GET',
      data:{},
      success(resp) {
        //console.log(resp)
        if(resp.statusCode == 200) {  
          that.setData({
            productLabelList: resp.data
          })
          console.log(that.data.productLabelList)
        }
      }
    })
  },
  formSubmit (e) {
    //console.log(e)
    let that = this;
    that.setData({
      screenShow: true
    })
    let label = []
    let travelDays = []
    let stock = []
    for (var val in that.data.selectValue) {
      if (that.data.selectValue[val]) {
        if (val.indexOf('天') > -1) {
          if (val == '>5天'){
            travelDays.push(5)
          } else {
            travelDays.push(val.replace('天', ''))
          }  
        } else if (val.indexOf('>10') > -1 || val.indexOf('<10') > -1) {
          stock.push(val)
        } else {
          label.push(val)
        }
      }
    }
    if (stock.length > 1 || stock.length == 0) {
      stock = 3
    } else {
      if(stock[0].indexOf('>10')) {
        stock = 1
      } else {
        stock = 2
      }
    }
    label = label.join(',')
    travelDays = travelDays.join(',')
    let date = that.data.date == '选择日期' ? '' : that.data.date;
    let minP = e.detail.value.minPrice == '' ? 0 : e.detail.value.minPrice;
    let maxP = e.detail.value.maxPrice == '' ? 1000000 : e.detail.value.maxPrice
    let setData = {
      cityId: app.globalData.cityCode,
      minPrice: parseInt(minP),
      maxPrice: parseInt(maxP),
      date,
      label,
      travelDays,
      stock
    }

    wx.request({
      url: app.globalData.urlPage + 'travel/product/productList',
      method: 'POST',
      data: setData,
      success(resp) {
        console.log(resp)
        if (resp.statusCode == 200) {
          that.setData({
            screenShow: false
          })
          if (resp.data.data.length == 0) {
            that.setData({
              screenType: 2
            })
          } else {
            that.setData({
              screenProducts: resp.data.data,
              screenType: 1
            })
          }
        }
      }
    })
  },
  goDetail: function (e) {
    //console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/detail?productID=' + e.currentTarget.dataset.id,
    })
  },
  quxiao: function () {
    this.setData({
      currentTab: 0,
      sxFlg: true
    })
    this.getProduct(this.data.type, 1)
  },
  selectfun: function (e) {
    var val = e.currentTarget.dataset.value
    const selectValue = this.data.selectValue;
    if (this.data.selectValue[val]) {
      this.setData({
        ['selectValue.' + val]: false
      })
    } else {
      this.setData({
        ['selectValue.' + val]: true
      })
    }
    //console.log(this.data.selectValue)
  },
  getProduct (type, sort) {
    let that = this;
    let data = {}
    if (type == 2) {
      data = {
        city: app.globalData.cityCode,
        type: type,
        sort: sort
      }
    } else {
      data = {
        type: type,
        sort: sort
      }
    }
    wx.request({
      url: app.globalData.urlPage + 'travel/product/productList',
      method: 'POST',
      data: data,
      success(resp) {
        if (resp.statusCode == 200) {
          that.setData({
            products: resp.data.data,
            bodyShow: false
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // this.setData({
    //   products: prods1
    // })
    this.getProduct(options.type, 1)
    this.setData({
      type: options.type
    })
    let title = ''
    if (options.type == 1) {
      title = '周边游'
    } else if (options.type == 2) {
      title = '本地游'
    } else if (options.type == 3) {
      title = '国内游'
    } else if (options.type == 4) {
      title = '出镜游'
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },
})