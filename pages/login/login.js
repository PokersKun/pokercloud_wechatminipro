//login.js
//获取应用实例
const app = getApp()
const url = getApp().globalData.serverUrl

Page({
  data: {
    logoStyle: 'logo',
    btnLoginStyle: 'btnlogin_normal',
    btnSignupStyle: 'btnsignup_normal',
    btnLoginHoverStyle: 'btnlogin_pressed',
    btnSignupHoverStyle: 'btnsignup_pressed',
    btnLoginText: '登录',
    editPanelStyle: 'editpanel',
    isSignup: false,
    username: '',
    password: '',
    phone: '',
    email: '',
    nickname: '',
    repassword: ''
  },
  setBtnSignupClick: function () {
    var that = this
    if (!that.data.isSignup) {
      that.setData({ 
        isSignup: true, 
        logoStyle: 'logo_signup',
        btnLoginText: '×',
        btnLoginStyle: 'btnback_normal',
        btnSignupStyle: 'btnsignup_signup_normal',
        btnLoginHoverStyle: 'btnback_pressed',
        btnSignupHoverStyle: 'btnsignup_signup_pressed',
        editPanelStyle: 'editpanel_signup',
        username: '',
        password: '',
        phone: '',
        email: '',
        nickname: '',
        repassword: ''
      })
    }
    else {
      if (that.data.username != '' && that.data.password != '' && that.data.phone != '' && that.data.email != '' && that.data.nickname != '' && that.data.repassword != '') {
        if (that.data.password == that.data.repassword) {
          wx.showLoading({
            title: '注册中...',
          })
          wx.request({
            url: url + '/user/check',
            method: 'GET',
            data: {
              username: that.data.username,
            },
            success (res) {
              console.log(res.data)
              if (res.data == 'success') {
                wx.showToast({
                  title: '该用户已存在！',
                  icon: 'none'
                })
              } else if (res.data == 'fail') {
                wx.request({
                  url: url + '/user/add',
                  method: 'GET',
                  data: {
                    username: that.data.username,
                    password: that.data.password,
                    phone: that.data.phone,
                    email: that.data.email,
                    nickname: that.data.nickname
                  },
                  success (res) {
                    console.log(res.data)
                    if (res.data == 'success') {
                      wx.hideLoading()
                      that.setData({ 
                        isSignup: false, 
                        logoStyle: 'logo',
                        btnLoginText: '登录',
                        btnLoginStyle: 'btnlogin_normal',
                        btnSignupStyle: 'btnsignup_normal' ,
                        btnLoginHoverStyle: 'btnlogin_pressed',
                        btnSignupHoverStyle: 'btnsignup_pressed',
                        editPanelStyle: 'editpanel',
                        username: '',
                        password: '',
                      })
                    } else if (res.data == 'fail') {
                      wx.showToast({
                        title: '注册失败！',
                        icon: 'none'
                      })
                    }
                  },
                  fail (res) {
                    console.log(res.data)
                  }
                })
              }
            },
            fail (res) {
              console.log(res.data)
              wx.showToast({
                title: '服务器连接超时！',
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: '两次输入的密码不一致！',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '请输入注册信息！',
          icon: 'none'
        })
      }
    }
  },
  setBtnLoginClick: function () {
    var that = this
    if (that.data.isSignup) {
      that.setData({ 
        isSignup: false, 
        logoStyle: 'logo',
        btnLoginText: '登录',
        btnLoginStyle: 'btnlogin_normal',
        btnSignupStyle: 'btnsignup_normal' ,
        btnLoginHoverStyle: 'btnlogin_pressed',
        btnSignupHoverStyle: 'btnsignup_pressed',
        editPanelStyle: 'editpanel',
        username: '',
        password: '',
      })
    }
    else {
      if (that.data.username != '' && that.data.password != '') {
        wx.showLoading({
          title: '登录中...',
        })
        wx.request({
          url: url + '/user/login',
          method: 'GET',
          data: {
            username: that.data.username,
            password: that.data.password
          },
          success (res) {
            console.log(res.data)
            if (res.data == 'success') {
              wx.hideLoading()
              wx.setStorage({
                data: {
                  username: that.data.username
                },
                key: 'userinfo',
              })
              app.globalData.isSignedIn = true
              app.globalData.username = that.data.username
              wx.reLaunch({
                url: '../index/index',
              })
            } else if (res.data == 'fail') {
              wx.showToast({
                title: '用户名或密码错误！',
                icon: 'none'
              })
            }
          },
          fail (res) {
            console.log(res.data)
            wx.showToast({
              title: '服务器连接超时！',
              icon: 'none'
            })
          }
        })
      } else {
        wx.showToast({
          title: '请输入登录信息！',
          icon: 'none'
        })
      }
    }
  },
  usernameInput: function (e) {
    this.setData({ username: e.detail.value })
  },
  passwordInput: function (e) {
    this.setData({ password: e.detail.value })
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
  repasswordInput: function (e) {
    this.setData({ repassword: e.detail.value })
  },
  onLoad: function () {
    wx.showToast({
      title: '请先登录！',
      icon: 'none'
    })
  },
})
