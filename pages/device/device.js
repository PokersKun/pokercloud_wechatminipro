// pages/device/device.js
import { base64src } from '../../utils/base64src.js'
const app = getApp()
const url = getApp().globalData.serverUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasDevice: false,
    userDevices: [],
    devices: [],
    isLaunched: false,
    isStoped: false,
    quickId: '',
    showModal: false,
    shareQRCode: ''
  },

  preventTouchMove: function() {},

  save: function() {
    base64src(this.data.shareQRCode, res => {
      console.log(res)
      wx.saveImageToPhotosAlbum({
        filePath: res,
        success () {
          wx.showToast({
            title: '保存成功！',
          })
        }
      })
    });
  },

  close: function() { 
    this.setData({
      showModal: false
    })
  },

  setAddButtonClick:function() {
    wx.scanCode({
      scanType: 'qrCode',
      success (res) {
        console.log(res)
        var date = Date.now()
        let result = JSON.parse(res.result)
        if (date - result.date > 60000) {
          wx.showToast({
            title: '该二维码已过期！',
            icon: 'none'
          })
        } else {
          wx.request({
            url: url + '/user_device/check',
            method: 'GET',
            data: {
              username: app.globalData.username,
              device_id: result.device_id
            },
            success(res) {
              console.log(res.data)
              if (res.data == 'success') {
                wx.showToast({
                  title: '该设备已存在！',
                  icon: 'none'
                })
              } else if (res.data == 'fail') {
                wx.request({
                  url: url + '/user_device/add',
                  method: 'GET',
                  data: {
                    username: app.globalData.username,
                    device_id: result.device_id
                  },
                  success(res) {
                    console.log(res.data)
                    if (res.data == 'success') {
                      wx.showToast({
                        title: '添加成功！',
                      })
                    }
                  },
                  fail(res) {
                    console.log(res.data)
                  }
                })
              }
            },
            fail(res) {
              console.log(res.data)
            }
          })
        }
      }
    })
  },

  setDeviceClick:function(e) {
    var that = this
    console.log(e)
    let item = ['删除设备', '分享设备']
    if (!e.currentTarget.dataset.isquick) {
      item.push('设为快捷方式')
    } else {
      item.push('取消快捷方式')
    }
    if (e.currentTarget.dataset.ismanager) {
      item.push('编辑设备')
    }
    wx.showActionSheet({
      itemList: item,
      success(res) {
        console.log(item[res.tapIndex])
        switch(item[res.tapIndex]) {
          case '删除设备':
            wx.showModal({
              title: '提示信息',
              content: '点击确定以删除当前设备',
              confirmColor: '#f00',
              success (res) {
                if (res.confirm) {
                  wx.request({
                    url: url + '/user_device/delete',
                    method: 'GET',
                    data: {
                      username: app.globalData.username,
                      device_id: e.currentTarget.dataset.id
                    },
                    success (res) {
                      console.log(res.data)
                      if (res.data == 'success') {
                        if (e.currentTarget.dataset.isquick) {
                          wx.request({
                            url: url + '/quick/delete',
                            method: 'GET',
                            data: {
                              username: app.globalData.username,
                              device_id: e.currentTarget.dataset.id
                            },
                            success (res) {
                              console.log(res.data)
                            },
                            fail (res) {
                              console.log(res.data)
                            }
                          })
                        }
                        wx.showToast({
                          title: '删除成功！',
                        })
                        that.getAllDevice()
                      }
                    },
                    fail (res) {
                      console.log(res.data)
                    }
                  })
                }
              }
            })
            break
          case '分享设备':
            var date = Date.now()
            let info = {
              date: date,
              device_id: e.currentTarget.dataset.id
            }
            wx.request({
              url: url + '/device/get_code',
              data: {
                content: info
              },
              method: 'GET',
              success (res) {
                console.log(res.data)
                that.setData({
                  shareQRCode: res.data,
                  showModal: true
                })
              },
              fail (res) {
                console.log(res.data)
              }
            })
            break
          case '取消快捷方式':
            wx.request({
              url: url + '/user_device/update_quick',
              method: 'GET',
              data: {
                username: app.globalData.username,
                device_id: e.currentTarget.dataset.id,
                is_quick: 0
              },
              success (res) {
                console.log(res.data)
                if (res.data == 'success') {
                  wx.request({
                    url: url + '/quick/delete',
                    method: 'GET',
                    data: {
                      username: app.globalData.username,
                      device_id: e.currentTarget.dataset.id
                    },
                    success (res) {
                      console.log(res.data)
                      if (res.data == 'success') {
                        that.getAllDevice()
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
              }
            })
            break
          case '设为快捷方式':
            wx.request({
              url: url + '/user_device/update_quick',
              method: 'GET',
              data: {
                username: app.globalData.username,
                device_id: e.currentTarget.dataset.id,
                is_quick: 1
              },
              success (res) {
                console.log(res.data)
                if (res.data == 'success') {
                  wx.request({
                    url: url + '/quick/add',
                    method: 'GET',
                    data: {
                      username: app.globalData.username,
                      device_id: e.currentTarget.dataset.id,
                    },
                    success (res) {
                      console.log(res.data)
                      if (res.data == 'success') {
                        if (that.data.quickId) {
                          wx.request({
                            url: url + '/user_device/update_quick',
                            method: 'GET',
                            data: {
                              username: app.globalData.username,
                              device_id: that.data.quickId,
                              is_quick: 0
                            },
                            success (res) {
                              console.log(res.data)
                              if (res.data == 'success') {
                                wx.request({
                                  url: url + '/quick/delete',
                                  method: 'GET',
                                  data: {
                                    username: app.globalData.username,
                                    device_id: that.data.quickId,
                                  },
                                  success (res) {
                                    console.log(res.data)
                                    if (res.data == 'success') {
                                      that.getAllDevice()
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
                            }
                          })
                        } else {
                          that.getAllDevice()
                        }
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
              }
            })
            break
          case '编辑设备':
            wx.navigateTo({
              url: '../edit/edit?deviceId=' + e.currentTarget.dataset.id + '&isquick=' + e.currentTarget.dataset.isquick
            })
            break
        }
      }
    })
  },

  getAllDevice: function() {
    var that = this
    wx.request({
      url: url + '/user_device/get',
      method: 'GET',
      data: {
        username: app.globalData.username
      },
      success (res) {
        console.log(res.data)
        that.setData({
          userDevices: res.data
        })
        if (that.data.userDevices[0]) {
          let temp = []
          for (let i = 0; i < that.data.userDevices.length; i++) {
            wx.request({
              url: url + '/device/get',
              method: 'GET',
              data: {
                device_id: that.data.userDevices[i].device_id
              },
              success (res) {
                console.log(res.data)
                var type = ''
                switch (res.data.type) {
                  case 'lock':
                    if (res.data.status) {
                      type = '../../resources/images/lock_online.png'
                    }
                    else {
                      type = '../../resources/images/lock.png'
                    }
                    break
                  case 'light':
                    if (res.data.status) {
                      type = '../../resources/images/light_online.png'
                    }
                    else {
                      type = '../../resources/images/light.png'
                    }
                    break
                }
                var isquick = that.data.userDevices[i].is_quick
                var ismanager = false
                var origin = ''
                if (res.data.manager == app.globalData.username) {
                  ismanager = true
                  origin = '../../resources/images/edit.png'
                }
                else {
                  origin = '../../resources/images/share.png'
                }
                let device = {
                  id: that.data.userDevices[i].device_id,
                  ismanager: ismanager,
                  type: type,
                  name: res.data.name,
                  location: res.data.location,
                  isquick: isquick,
                  origin: origin
                }
                temp.push(device)
                temp.reverse()
                that.setData({
                  devices: temp,
                  hasDevice: true
                })
              },
              fail (res) {
                console.log(res.data)
              }
            })
          }
        } else {
          that.setData({
            hasDevice: false
          })
        }
      },
      fail (res) {
          console.log(res.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.quickId) {
      that.setData({
        quickId: options.quickId
      })
    }
    if (!that.data.isLaunched) {
      that.getAllDevice()
      that.setData({ isLaunched: true })
    }
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
    var that = this
    if (that.data.isLaunched) {
      if (that.data.isStoped) {
        that.getAllDevice()
        that.setData({ isStoped: false })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    that.setData({ isStoped: true })
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