// pages/user/user.js// pages/device/device.js
const app = getApp()
const url = getApp().globalData.serverUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismodify: false,
    modify: 'disabled',
    allinputStyle: 'allinput',
    inputStyle: 'inputnormal',
    passwordText: '密码',
    oldpassword: '已设置',
    passwordType: 'text',
    modifyText: '修改资料',
    username: '',
    phone: '',
    email: '',
    nickname: '',
    newpassword: '',
    oldphone: '',
    oldemail: '',
    oldnickname: ''
  },

  switchToModify: function() {
    var that = this
    if (!that.data.ismodify) {
      that.setData({
        ismodify: true,
        modify: '',
        allinputStyle: 'allinputmodify',
        inputStyle: 'inputmodify',
        passwordText: '旧密码',
        passwordType: 'password',
        modifyText: '保存修改',
        oldphone: that.data.phone,
        oldemail: that.data.email,
        oldnickname: that.data.nickname,
        phone: '',
        email: '',
        nickname: '',
        newpassword: '',
        oldpassword: ''
      })
    } else {
      if (that.data.phone != '' || that.data.email != '' || that.data.nickname != '' || that.data.oldpassword != '' || that.data.newpassword != '') {
        wx.showLoading({
          title: '修改中...',
        })
        if (that.data.phone != '' || that.data.email != '' || that.data.nickname) {
          if (that.data.oldpassword != '' || that.data.newpassword != '') {
            if (that.data.newpassword != '' && that.data.newpassword != '') {
              wx.request({
                url: url + '/user/set_pass',
                method: 'GET',
                data: {
                  username: that.data.username,
                  oldpassword: that.data.oldpassword,
                  newpassword: that.data.newpassword
                },
                success (res) {
                  console.log(res.data)
                  if (res.data == 'success') {
                    var phone = ''
                    var email = ''
                    var nickname = ''
                    if (that.data.phone != '')
                      phone = that.data.phone
                    else
                      phone = that.data.oldphone
                    if (that.data.email != '')
                      email = that.data.email
                    else
                      email = that.data.oldemail
                    if (that.data.nickname != '')
                      nickname = that.data.nickname
                    else
                      nickname = that.data.oldnickname
                    wx.request({
                      url: url + '/user/set_info',
                      method: 'GET',
                      data: {
                        username: that.data.username,
                        phone: phone,
                        email: email,
                        nickname: nickname
                      },
                      success (res) {
                        console.log(res.data)
                        wx.request({
                          url: url + '/user/get_info',
                          method: 'GET',
                          data: {
                            username: that.data.username
                          },
                          success (res) {
                            console.log(res.data)
                            that.setData({
                              ismodify: false,
                              modify: 'disabled',
                              allinputStyle: 'allinput',
                              inputStyle: 'inputnormal',
                              passwordType: '',
                              modifyText: '修改资料',
                              passwordText: '密码',
                              oldpassword: '已设置',
                              phone: res.data.phone,
                              email: res.data.email,
                              nickname: res.data.nickname
                            })
                            wx.hideLoading()
                          },
                          fail (res) {
                            console.log(res.data)
                          }
                        })
                      },
                      fail (res) {
                        console.log(res.data)
                      }
                    })
                  }
                  else if (res.data == 'fail') {
                    wx.showToast({
                      title: '请检查旧密码！',
                      icon: 'none'
                    })
                  }
                },
                fail (res) {
                  console.log(res.data)
                }
              })
            } else {
              wx.showToast({
                title: '请输入旧密码及新密码！',
                icon: 'none'
              })
            }
          } else {
            var phone = ''
            var email = ''
            var nickname = ''
            if (that.data.phone != '')
              phone = that.data.phone
            else
              phone = that.data.oldphone
            if (that.data.email != '')
              email = that.data.email
            else
              email = that.data.oldemail
            if (that.data.nickname != '')
              nickname = that.data.nickname
            else
              nickname = that.data.oldnickname
            wx.request({
              url: url + '/user/set_info',
              method: 'GET',
              data: {
                username: that.data.username,
                phone: phone,
                email: email,
                nickname: nickname
              },
              success (res) {
                console.log(res.data)
                wx.request({
                  url: url + '/user/get_info',
                  method: 'GET',
                  data: {
                    username: that.data.username
                  },
                  success (res) {
                    console.log(res.data)
                    that.setData({
                      ismodify: false,
                      modify: 'disabled',
                      allinputStyle: 'allinput',
                      inputStyle: 'inputnormal',
                      passwordType: '',
                      modifyText: '修改资料',
                      passwordText: '密码',
                      oldpassword: '已设置',
                      phone: res.data.phone,
                      email: res.data.email,
                      nickname: res.data.nickname
                    })
                    wx.hideLoading()
                  },
                  fail (res) {
                    console.log(res.data)
                  }
                })
              },
              fail (res) {
                console.log(res.data)
              }
            })
          }
        } else {
          if (that.data.oldpassword != '' || that.data.newpassword != '') {
            if (that.data.newpassword != '' && that.data.newpassword != '') {
              wx.request({
                url: url + '/user/set_pass',
                method: 'GET',
                data: {
                  username: that.data.username,
                  oldpassword: that.data.oldpassword,
                  newpassword: that.data.newpassword
                },
                success (res) {
                  console.log(res.data)
                  if (res.data == 'success') {
                    wx.request({
                      url: url + '/user/get_info',
                      method: 'GET',
                      data: {
                        username: that.data.username
                      },
                      success (res) {
                        console.log(res.data)
                        that.setData({
                          ismodify: false,
                          modify: 'disabled',
                          allinputStyle: 'allinput',
                          inputStyle: 'inputnormal',
                          passwordType: '',
                          modifyText: '修改资料',
                          passwordText: '密码',
                          oldpassword: '已设置',
                          phone: res.data.phone,
                          email: res.data.email,
                          nickname: res.data.nickname
                        })
                        wx.hideLoading()
                      },
                      fail (res) {
                        console.log(res.data)
                      }
                    })
                  }
                  else if (res.data == 'fail') {
                    wx.showToast({
                      title: '请检查旧密码！',
                      icon: 'none'
                    })
                  }
                },
                fail (res) {
                  console.log(res.data)
                }
              })
            } else {
              wx.showToast({
                title: '请输入旧密码及新密码！',
                icon: 'none'
              })
            }
          }
        }
      } else {
        that.setData({
          ismodify: false,
          modify: 'disabled',
          allinputStyle: 'allinput',
          inputStyle: 'inputnormal',
          passwordType: '',
          modifyText: '修改资料',
          passwordText: '密码',
          oldpassword: '已设置',
          phone: that.data.oldphone,
          email: that.data.oldemail,
          nickname: that.data.oldnickname
        })
      }
    }
  },

  setLogoutClick: function() {
    wx.clearStorage({
      complete: (res) => {
        console.log(res)
        app.globalData.isSignedIn = false
        wx.reLaunch({
          url: '../login/login'
        })
      },
    })
  },

  oldpasswordInput: function (e) {
    this.setData({ oldpassword: e.detail.value })
  },
  phoneInput: function (e) {
    this.setData({ phone: e.detail.value })
  },
  emailInput: function (e) {
    this.setData({ email: e.detail.value })
  },
  nicknameInput: function (e) {
    this.setData({ nickname: e.detail.value })
  },
  newpasswordInput: function (e) {
    this.setData({ newpassword: e.detail.value })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: url + '/user/get_info',
      method: 'GET',
      data: {
        username: options.username
      },
      success (res) {
        console.log(res)
        that.setData({
          username: options.username,
          phone: res.data.phone,
          email: res.data.email,
          nickname: res.data.nickname
        })
      },
      fail (res) {
        console.log(res)
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