// pages/edit/edit.js
const app = getApp()
const url = getApp().globalData.serverUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isQuick: '',
    types: ['门锁', '灯光'],
    deviceId: '',
    deviceName: '',
    deviceType: '',
    deviceLocation: '',
    oldDeviceName: '',
    oldDeviceType: '',
    oldDeviceLocation: ''
  },

  destroy: function() {
    var that = this
    wx.showModal({
      title: '提示信息',
      content: '本操作将从平台上完全删除该设备\n请通过 PC 端配置工具再次进行添加',
      confirmColor: '#f00',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: url + '/user_device/delete_all',
            method: 'GET',
            data: {
              device_id: that.data.deviceId
            },
            success (res) {
              console.log(res.data)
            },
            fail (res) {
              console.log(res.data)
            }
          })
          if (that.data.isQuick) {
            wx.request({
              url: url + '/quick/delete',
              method: 'GET',
              data: {
                username: app.globalData.username,
                device_id: that.data.deviceId
              },
              success (res) {
                console.log(res.data)
              },
              fail (res) {
                console.log(res.data)
              }
            })
          }
          wx.request({
            url: url + '/device/delete',
            method: 'GET',
            data: {
              device_id: that.data.deviceId
            },
            success (res) {
              console.log(res.data)
              if (res.data == 'success') {
                wx.showToast({
                  title: '清除成功！将返回设备列表',
                  icon: 'none',
                  success () {
                    setTimeout(function(){
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000)
                  }
                })
              }
            },
            fail (res) {
              console.log(res.data)
            }
          })
        }
      }
    })
  },

  save: function() {
    var that = this
    if (that.data.deviceName == that.data.oldDeviceName && that.data.deviceLocation == that.data.oldDeviceLocation && that.data.deviceType == that.data.oldDeviceType || that.data.deviceName == '' && that.data.deviceLocation == '') {
      wx.showToast({
        title: '未修改！将返回设备列表',
        icon: 'none',
        success () {
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      })
    } else {
      var name = ''
      var type = ''
      var location = ''
      if (that.data.deviceName != '')
        name = that.data.deviceName
      else
        name = that.data.oldDeviceName
      if (that.data.deviceType != '')
        type = that.data.deviceType
      else
        type = that.data.oldDeviceType
      if (that.data.deviceLocation != '')
        location = that.data.deviceLocation
      else
        location = that.data.oldDeviceLocation
      switch (type) {
        case 0:
          type = 'lock'
          break
        case 1:
          type = 'light'
          break
      }
      wx.request({
        url: url + '/device/set_info',
        method: 'GET',
        data: {
          device_id: that.data.deviceId,
          name: name,
          type: type,
          location: location
        },
        success (res) {
          console.log(res.data)
          if (res.data == 'success') {
            wx.showToast({
              title: '修改成功！将返回设备列表',
              icon: 'none',
              success () {
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            })
          }
        },
        fail (res) {
          console.log(res.data)
        }
      })
    }
  },

  bindPickerChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      deviceType: e.detail.value
    })
  },

  locationInput: function (e) {
    this.setData({ deviceLocation: e.detail.value })
  },

  nameInput: function (e) {
    this.setData({ deviceName: e.detail.value })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: url + '/device/get',
      method: 'GET',
      data: {
        device_id: options.deviceId
      },
      success (res) {
        console.log(res.data)
        var type = ''
        switch (res.data.type) {
          case 'lock':
            type = 0
            break
          case 'light':
            type = 1
            break
        }
        that.setData({
          isQuick: options.isquick,
          deviceId: res.data.device_id,
          deviceName: res.data.name,
          deviceType: type,
          deviceLocation: res.data.location,
          oldDeviceName: res.data.name,
          oldDeviceType: type,
          oldDeviceLocation: res.data.location
        })
      },
      fail (res) {
        console.log(res.data)
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