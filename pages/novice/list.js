// pages/novice/list.js
const zajax = require('../../utils/comm.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      nav_now:0,
      type:1,
      wzlist:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata()
  },
  getdata:function(){
    var _this = this;
    zajax.requestAjax('home/noob/list1?type='+_this.data.type,'','get','正在加载',function(res){
      if(res.code == 0){
        _this.setData({
          wzlist:res.data.list
        })
      }
    })
  },
  nav:function(e){
      this.setData({
         nav_now:e.currentTarget.dataset.id,
         type:parseInt(e.currentTarget.dataset.id)+1
      })
      this.getdata();
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