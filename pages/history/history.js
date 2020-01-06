// pages/history/history.js
const app = getApp()
const url = getApp().globalData.serverUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasHistory: false,
    historys: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: url + '/user_device/get',
      method: 'GET',
      data: {
        username: app.globalData.username
      },
      success (res) {
        console.log(res.data)
        if (res.data[0]) {
          for (let i = 0; i < res.data.length; i++) {
            let temp = []
            wx.request({
              url: url + '/history/get',
              method: 'GET',
              data: {
                device_id: res.data[i].device_id
              },
              success (res) {
                console.log(res.data)
                if (res.data[0]) {
                  for (let i = 0; i < res.data.length; i++) {
                    var name = ''
                    var type = ''
                    wx.request({
                      url: url + '/device/get',
                      method: 'GET',
                      data: {
                        device_id: res.data[i].device_id
                      },
                      success (resdev) {
                        console.log(resdev.data)
                        switch (resdev.data.type) {
                          case 'lock':
                            type = '../../resources/images/lock.png'
                            break
                          case 'light':
                            type = '../../resources/images/light.png'
                            break
                        }
                        name = resdev.data.name
                        var username = ''
                        wx.request({
                          url: url + '/user/get_info',
                          method: 'GET',
                          data: {
                            username: res.data[i].username
                          },
                          success (resusr) {
                            console.log(res.data)
                            username = resusr.data.nickname
                            var id = res.data[i].id
                            var date = res.data[i].date
                            var datatype = ''
                            switch (res.data[i].data_type) {
                              case 'out':
                                datatype = '../../resources/images/out.png'
                                break
                              case 'in':
                                datatype = '../../resources/images/in.png'
                                break
                            }
                            var data = res.data[i].data
                            let history = {
                              id: id,
                              name: name,
                              type: type,
                              username: username,
                              date: date,
                              datatype: datatype,
                              data: data
                            }
                            temp.push(history)
                            temp.sort((a, b) => {
                              return b.id - a.id
                            })
                            that.setData({
                              historys: temp,
                              hasHistory: true
                            })
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
                }
              },
              fail (res) {
                console.log(res.data)
              }
            })
          }
        } else {
          that.setData({
            hasHistory: false
          })
        }
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