//index.js
//获取应用实例
const app = getApp()
const url = getApp().globalData.serverUrl

Page({
  data: {
    nickname: '未登录',
    userImage: '../../resources/images/user.png',
    hasQuick: false,
    switcherStyle: 'switcher',
    switcherImageUrl: '../../resources/images/add.png',
    deviceAction: '暂无快捷方式，点击设置',
    deviceType: '',
    deviceTypeImageUrl: '', 
    deviceId: '',
    deviceName: '',
    deviceLocation: '',
    isOnline: false,
    isSwitching: false,
    isLaunched: false,
    isStoped: false,
    statusInterval: '',
    isOpened: false,
  },
  setUserNormal: function() {
    var that = this
    that.setData({userImage: '../../resources/images/user.png'})
  },
  setUserPressed: function() {
    var that = this
    that.setData({userImage: '../../resources/images/user_pressed.png'})
  },
  addHistory: function(datatype, data) {
    var that = this
    wx.request({
      url: url + '/history/add',
      method: 'GET',
      data: {
        device_id: that.data.deviceId,
        username: app.globalData.username,
        data_type: datatype,
        data: data
      },
      success (res) {
        console.log(res.data)
      },
      fail (res) {
        console.log(res.data)
      }
    })
  },
  setSwitcherClick: function() {
    var that = this
    if (that.data.hasQuick) {
      if (that.data.isOnline) {
        switch (that.data.deviceType) {
          case 'lock':
            if (!that.data.isSwitching) {
              wx.request({
                url: url + '/device/control',
                method: 'GET',
                data: {
                  device_id: that.data.deviceId,
                  type: that.data.deviceType,
                  code: 1
                },
                success (res) {
                  console.log(res.data)
                  if (res.data == 'success') {
                    that.addHistory('out','开门')
                    that.setData({
                      isSwitching: true,
                      switcherStyle: 'switcher_active'
                    })
                  }
                },
                fail (res) {
                  console.log(res.data)
                }
              })
            } else {
              wx.showToast({
                title: '请勿重复操作',
                icon: 'none'
              })
            }
            break
          case 'light':
            if (!that.data.isOpened) {
              wx.request({
                url: url + '/device/control',
                method: 'GET',
                data: {
                  device_id: that.data.deviceId,
                  type: that.data.deviceType,
                  code: 1
                },
                success (res) {
                  console.log(res.data)
                  if (res.data == 'success') {
                    that.addHistory('out','开启')
                    that.setData({
                      isOpened: true,
                      switcherStyle: 'switcher_active'
                    })
                  }
                },
                fail (res) {
                  console.log(res.data)
                }
              })
            } else {
              wx.request({
                url: url + '/device/control',
                method: 'GET',
                data: {
                  device_id: that.data.deviceId,
                  type: that.data.deviceType,
                  code: 0
                },
                success (res) {
                  console.log(res.data)
                  if (res.data == 'success') {
                    that.addHistory('out','关闭')
                    that.setData({
                      isOpened: false,
                      switcherStyle: 'switcher'
                    })
                  }
                },
                fail (res) {
                  console.log(res.data)
                }
              })
            }
            break
        }
      } else {
        wx.showToast({
          title: '设备已离线，请检查网络',
          icon: 'none'
        })
      }
    } else {
      wx.navigateTo({
        url: '../device/device'
      })
    }
  },
  setHistoryClick: function() {
    wx.navigateTo({
      url: '../history/history'
    })
  },
  setDeviceListClick: function() {
    var that = this
    if (!that.data.hasQuick) {
      wx.navigateTo({
        url: '../device/device'
      })
    } else {
      wx.navigateTo({
        url: '../device/device?quickId=' + that.data.deviceId
      })
    }
  },
  setUserClick: function() {
    wx.navigateTo({
      url: '../user/user?username=' + app.globalData.username
    })
  },
  getAllData: function() {
    var that = this
    if (!app.globalData.isSignedIn) {
      wx.reLaunch({
        url: '../login/login'
      })
    }
    else {
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: url + '/user/get_info',
        method: 'GET',
        data: {
          username: app.globalData.username
        },
        success (res) {
          console.log(res.data)
          that.setData({
            nickname: res.data.nickname
          })
          wx.request({
            url: url + '/quick/get',
            method: 'GET',
            data: {
              username: app.globalData.username
            },
            success (res) {
              console.log(res.data)
              if (res.data) {
                that.setData({
                  deviceId: res.data
                })
                wx.hideLoading()
                that.data.statusInterval = setInterval(function(){
                  wx.request({
                    url: url + '/device/get',
                    method: 'GET',
                    data: {
                      device_id: that.data.deviceId
                    },
                    success (res) {
                      console.log(res.data)
                      switch (res.data.type) {
                        case 'lock':
                          that.setData({
                            deviceType: 'lock',
                            deviceTypeImageUrl: '../../resources/images/lock.png'
                          })
                          if (res.data.status) {
                            that.setData({
                              switcherImageUrl: '../../resources/images/switcher_online.png',
                              isOnline: true
                            })
                          } else {
                            that.setData({
                              switcherImageUrl: '../../resources/images/switcher.png',
                              isOnline: false
                            })
                          }
                          switch (res.data.action) {
                            case 0:
                              that.setData({
                                deviceAction: '拉住握把并按下开关',
                                isSwitching: false,
                                switcherStyle: 'switcher'
                              })
                              break
                            case 1:
                              that.setData({
                                deviceAction: '开门中，请稍后...'
                              })
                              break
                            case 2:
                              that.setData({
                                deviceAction: '开门成功，请松开握把'
                              })
                              break
                            case 3:
                              that.setData({
                                deviceAction: '开门完成，请手动关门'
                              })
                              break
                          }
                          break
                          case 'light':
                            that.setData({
                              deviceType: 'light',
                              deviceTypeImageUrl: '../../resources/images/light.png'
                            })
                            if (res.data.status) {
                              that.setData({
                                switcherImageUrl: '../../resources/images/switcher_online.png',
                                isOnline: true
                              })
                            } else {
                              that.setData({
                                switcherImageUrl: '../../resources/images/switcher.png',
                                isOnline: false
                              })
                            }
                            switch (res.data.action) {
                              case 0:
                                that.setData({
                                  deviceAction: '设备已关闭，点击打开',
                                  isOpened: false,
                                  switcherStyle: 'switcher'
                                })
                                break
                              case 1:
                                that.setData({
                                  deviceAction: '设备已打开，点击关闭',
                                  isOpened: true,
                                  switcherStyle: 'switcher_active'
                                })
                                break
                            }
                            break
                      }
                      that.setData({
                        hasQuick: true,
                        deviceName: res.data.name,
                        deviceLocation: res.data.location
                      })
                    },
                    fail (res) {
                      console.log(res.data)
                    }
                  })
                }, 1000)
              } else {
                wx.hideLoading()
                that.setData({
                  hasQuick: false,
                  switcherImageUrl: '../../resources/images/add.png',
                  deviceAction: '暂无快捷方式，点击设置'
                })
              }
            },
            fail (res) {
              console.log(res.data)
            }
          })
        },
        fail (res) {
          console.log(res.data)
          wx.navigateTo({
            url: '../login/login'
          })
        }
      })
    }
  },
  onLoad: function () {
    var that = this
    if (!that.data.isLaunched) {
      that.getAllData()
      that.setData({ isLaunched: true })
    }
  },
  onHide: function() {
    var that = this
    if (that.data.statusInterval != '') {
      clearInterval(that.data.statusInterval)
    }
    that.setData({ isStoped: true })
  },
  onShow: function() {
    var that = this
    if (that.data.isLaunched) {
      if (that.data.isStoped) {
        console.log('restore')
        that.getAllData()
        that.setData({ isStoped: false })
      }
    }
  }
})
