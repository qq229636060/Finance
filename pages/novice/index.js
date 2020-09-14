// pages/novice/index.js
const zajax = require('../../utils/comm.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wzlist:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '新手必读'
    })
    this.getdata()
  },
  getdata:function(){
    var _this = this;
    zajax.requestAjax('/home/article/list1?type=4','','get','正在加载',function(res){
      if(res.code == 0){
        _this.setData({
          wzlist:res.data.list
        })
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