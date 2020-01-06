//app.js
App({
  onLaunch: function () {
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success (res) {
        that.globalData.isSignedIn = true
        that.globalData.username = res.data.username
      },
      fail (res) {
        that.globalData.isSignedIn = false
      }
    })
  },
  globalData: {
    serverUrl: 'http://192.168.0.250:8080',
    isSignedIn: false,
    username: ''
  }
})