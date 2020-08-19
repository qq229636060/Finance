// pages/user/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  btn_sub:function(res){
    var _this =this;
    console.log(res)
    app.globalData.userInfo = res.detail.userInfo;
    app.globalData.usedata = res.detail;
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      wx.login({
        success: res => {
          console.log(res);
          var data={
            code:res.code,
            encryptedData:app.globalData.usedata.encryptedData,
            iv:app.globalData.usedata.iv,
            signature:app.globalData.usedata.signature,
            rawData:app.globalData.usedata.rawData
          }
          console.log("aaa")
        }
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
         console.log(1)
      }
    } else {
      console.log(2)
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
        }
      })
    }
  }
})