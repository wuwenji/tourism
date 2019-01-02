//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 查看是否授权
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.getUser()
          that.getLogin()
        } else {
          wx.redirectTo({
            url: '../login/login'
          })
          console.log('授权失败')
        }
      }
    })
  },
  getUser () {
    // 获取用户信息
    let that = this;
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        that.globalData.userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      }
    })
    console.log('获取信息成功')
  },
  getLogin () {
    //获取登录信息openID
    let that = this;
    if (wx.getStorageSync('_openId_')) {
      that.globalData.openId = wx.getStorageSync('_openId_')
    } else {
      wx.login({
        success(res) {
          if (res.code) {
            // console.log('code: ' + res.code)
            // 发起网络请求
            wx.request({
              url: that.globalData.urlPage + 'travel/login',
              method: 'POST',
              data: {
                code: res.code,
                nickName: that.globalData.userInfo.nickName,
                avatarUrl: that.globalData.userInfo.avatarUrl
              },
              success(resp) {
                //console.log('userID:' + resp.data.data.userId)
                that.globalData.openId = resp.data.data.userId
                wx.setStorageSync('_openId_', resp.data.data.userId)
                console.log('登录成功')
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    // urlPage: 'http://192.168.1.126:9091/jmqy/',
    urlPage: 'https://rent.easywalkie.com/jmqy/',
    city: '广州市',
    cityCode: '440100',
    openId: '',
    shoppingCar: "0"
  }
})