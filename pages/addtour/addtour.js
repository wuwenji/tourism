// pages/addtour/addtour.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '成人',
    formFlg: false,
    contactId: [],
    inputValu: '',
    alertFlg: false,
    alertMsg: '请填写完整信息！',
    res: '',
    contacts: [],
    items: [
      { name: '成人', value: '成人', checked: 'true'},
      { name: '儿童', value: '儿童'}
    ]
  },
  radioChange: function (e) {
    this.setData({
      type: e.detail.value
    })
  },
  checkboxChange(e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      contactId: e.detail.value
    })
  },
  cancel: function() {
    wx.navigateBack()
  },
  alertWindow(string) {
    this.setData({
      alertMsg: string,
      alertFlg: true
    })
    setTimeout(resp => {
      this.setData({
        alertFlg: false
      })
    }, 1000)
  },
  formSubmit: function(e) {
    let that = this;
    var name = e.detail.value.name;
    var idCard = this.data.type == '成人' ? e.detail.value.number : '无';
    var type = this.data.type == '成人' ? 0 : 1;
    var phone = e.detail.value.phone
    var obj = {
      userId: app.globalData.openId,
      name,
      type,
      phone,
      idCard
    }
    if ( name == '') {
      that.alertWindow('请填写姓名！')
    } else if (idCard == '') {
      that.alertWindow('请填写身份证！')
    } else{
      //that.alertWindow('成功！')
      console.log(obj)
      wx.request({
        url: app.globalData.urlPage + 'travel/contact/save',
        method: 'POST',
        data: obj,
        success(resp) {
          //console.log(resp)
          if (resp.data.data.result == 1) {
            that.getContacts()
            that.noWindow()
          } else if (resp.data.data.result == -1) {
            that.setData({
              res: '身份证已存在'
            })
          } else {
            that.setData({
              res: '网络错误，请稍后再试！'
            })
          }
        }
      })
    }
  },
  submit() {
    let that = this;
    console.log(that.data.contactId)
    let attr = []
    that.data.contacts.map(resp => {
      let id = resp.id.toString()
      if (that.data.contactId.indexOf(id) > -1) {
        attr.push(resp)
      }
    })
    //console.log(attr)
    setTimeout(resp => {
      wx.setStorageSync('tour', attr)
      wx.navigateBack()
    }, 50)  
  },
  cancel() {
    wx.navigateBack()
  },
  /**打开窗口 */
  addContact () {
    this.setData({
      inputValu: '',
      formFlg: true
    })
  },
  /**关闭窗口 */
  noWindow () {
    this.setData({
      formFlg: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getContacts()
  },
  getContacts () {
    let that = this;
    wx.request({
      url: app.globalData.urlPage + 'travel/contact/list',
      method: 'POST',
      data: {
        userId: app.globalData.openId
      },
      success(resp) {
        if (resp.statusCode == 200) {
          let arrt = resp.data.data.map(resp => {
            resp.type = resp.type == 0 ? '成人': '儿童'
            return resp
          })
          that.setData({
            contacts: arrt
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
    wx.removeStorageSync('tour')
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