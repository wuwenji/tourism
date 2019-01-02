// pages/book/book.js
var WxParse = require('../../utils/wxParse/wxParse.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOk: true,
    aniStyle: false,
    insurancesDetailFlg: false,
    errorFlg: false,
    contractDetail: '<h4>合同</h4><p>一、严格遵守合同</p><p>二、严格遵守合同第一条</p><p>三、严格遵守合同第二条</p>',
    bodyShow: true,
    insurancesDetail: '这是保险详情',
    shoppingCar: 1,
    total: 0,
    getTotal: 0,
    newData: '',
    childNum: 0,
    adultNum: 0,
    error: '',
    planItemList:[
      {
        id: '',
        planId: '',
        name: '',
        price: '',
        remark: ''
      }
    ],
    allData:{
      planId: '',
      addressId: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      remarks: '',
      amout: [
        {
          id: '',
          name: '',
          phone: '',
          idCard: '',
          type: 0,
          insuranceIds: ''
        }
      ]
    },
    selectInsur:{
      1: [],
      2: [],
      3: []
    },
    names: [],
    insurances: []
  },
  bxShow () {
    this.setData({
      aniStyle: true
    })
  },
  bxHide() {
    this.setData({
      aniStyle: false
    })
  },
  next: function () {
   let insur =  this.data.selectInsur;
  //   var num = Object.getOwnPropertyNames(insur).length
  //  for (var val in insur) {
  //    if (insur[val].length == 0) {
  //      this.alertWin('请选择保险！')
  //    } else {
  //      num--
  //    } 
  //  }
    // if (num == 0) {
      //console.log(this.data.allData)
      let data = this.data
      var selsur = data.selectInsur
      var newSelsur = {}
      var touristList = []
      for (var val in data.selectInsur){
        newSelsur[val] = selsur[val].join(',')
      }
      touristList = data.names.map(resp => {
        resp.insuranceIds = newSelsur[resp.id]
        resp.type = resp.type == '成人' ? 0: 1
        delete resp.userId
        return resp
      })
      // let s = 1230;
      // let sdb = parseFloat(s)
      let insuranceAmount = data.total - data.getTotal
    console.log(insuranceAmount)
      var sentDa = {
        userId: app.globalData.openId,
        planId: parseInt(data.newData.planId),
        addressId: data.newData.addressId,
        contactName: data.newData.contact.name,
        contactPhone: data.newData.contact.phone,
        contactEmail: data.newData.contact.email,
        amount: data.total,
        childNum: data.childNum,
        adultNum: data.adultNum,
        remarks: data.newData.remarks,
        touristList,
        insuranceAmount
      }
      //console.log(sentDa);
      let that = this;
      wx.request({
        url: app.globalData.urlPage + 'travel/order/save',
        method: 'POST',
        data: sentDa,
        success(resp) {
          console.log('提交成功')
          //console.log(resp)
          if (resp.statusCode == 200){
            let data = resp.data.data.result
            if (data != 0) {
              wx.navigateTo({
                url: '../bookthree/bookthree?orderNumber=' + data
              })
            } else {
              that.alertWin('网络错误，请重试！')
            }
            
          }
        },
        fail(resp) {
          console.log('提交失败')
        }
      })   
    // }
  },
  addCar () {
    let insur = this.data.selectInsur;
    let data = this.data
    var selsur = data.selectInsur
    var newSelsur = {}
    var touristList = []
    for (var val in data.selectInsur) {
      newSelsur[val] = selsur[val].join(',')
    }
    touristList = data.names.map(resp => {
      resp.insuranceIds = newSelsur[resp.id]
      resp.type = resp.type == '成人' ? 0 : 1
      delete resp.userId
      return resp
    })
    let insuranceAmount = data.total - data.getTotal
    var sentDa = {
      userId: app.globalData.openId,
      planId: parseInt(data.newData.planId),
      addressId: data.newData.addressId,
      contactName: data.newData.contact.name,
      contactPhone: data.newData.contact.phone,
      contactEmail: data.newData.contact.email,
      amount: data.total,
      childNum: data.childNum,
      adultNum: data.adultNum,
      remarks: data.newData.remarks,
      touristList,
      insuranceAmount
    }
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/cart/save',
      method: 'POST',
      data: sentDa,
      success(resp) {
        if (resp.statusCode == 200) {
          //let data = resp.data.data.result
          if (resp.data.data.result == 1) {
            that.alertWin('添加成功！')
            setTimeout(resp => {
              wx.navigateTo({
                url: '../shoppingcart/shoppingcart',
              })
            }, 1000)   
          } else {
            that.alertWin(resp.data.data.msg)
          }
        }
      },
      fail(resp) {
        console.log('提交失败')
      }
    })   
  },
  alertWin(string) {
    this.setData({
      errorFlg: true,
      error: string
    })
    setTimeout(resp => {
      this.setData({
        errorFlg: false,
        error: '请选择保险类型！'
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let setData = JSON.parse(options.setData)
    this.getData(setData.planId)
    //this.getData(22)
    this.setData({
      names: setData.tourId,
      newData: setData
    })
    this.getSelectInsur()
    console.log(this.data.newData)
  },
  getSelectInsur() {
    let attrs = this.data.names
    let obj = {}
    for(var i = 0; i < attrs.length; i++) {
      obj[attrs[i].id] = []
    }
    this.setData({
      selectInsur: obj,
      bodyShow: false
    })
    //console.log(obj)
  },
  clickFun (e) {
    //console.log(e.target.dataset.key, e.target.dataset.name)
    let flg = this.data.selectInsur[e.target.dataset.name].indexOf(e.target.dataset.key)
    let money = e.target.dataset.money
    if (flg > - 1) {
      this.data.selectInsur[e.target.dataset.name].splice(flg, 1)
      this.setData({
        total: this.data.total - money
      })
    } else {
      this.data.selectInsur[e.target.dataset.name].push(e.target.dataset.key)
      this.setData({
        total: this.data.total + money
      })
    }
    //console.log(this.data.selectInsur)
  },
  checkboxChange (e) {
    //console.log(e)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**查看保险详情合同 */
  seeDetail (e) {
    //console.log(e.currentTarget.dataset.detail)
    let features = e.currentTarget.dataset.detail
    WxParse.wxParse('article', 'html', features, this, 0)
    this.setData({
      insurancesDetailFlg: true
    })
  },
  insurEnt () {
    this.setData({
      insurancesDetailFlg: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      shoppingCar: app.globalData.shoppingCar
    })
  },
  getData(id) {
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/productPlan/getProtocolInfos',
      method: 'POST',
      data: {
        id: id
      },
      success(resp) {
        console.log(resp)
        if (resp.statusCode == 200) {
          let childrens = 0;
          let adults = 0;
          let listPrice = 0;
          that.data.names.map(resp => {
            if (resp.type == '成人') {
              adults++
            } else {
              childrens++
            }
          })
          resp.data.data.planItemList.map(resp => {
            listPrice += resp.price
          })
          //console.log('成人：' + adults + '儿童：' + childrens + '附加价：' + listPrice)
          let allPrice = resp.data.data.adultPrice * adults +resp.data.data.childPrice * childrens + listPrice
          //console.log(resp.data.data.insuranceList)
          that.setData({
            insurances: resp.data.data.insuranceList,
            planItemList: resp.data.data.planItemList,
            childNum: childrens,
            adultNum: adults,
            total: allPrice,
            getTotal: allPrice
          }) 
        }
      }
    })
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