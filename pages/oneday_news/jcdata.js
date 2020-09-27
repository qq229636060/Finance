// pages/oneday_news/jcdata.js
const zajax = require('../../utils/comm.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conts:"",
    id:"",
    typeid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  getdata:function(){
    var _this = this;
   
    var data = {
      basis_type : _this.data.id
    }
    zajax.requestAjax('/home/index/basis',data,'get','正在加载',function(res){
        if(res.code == 0){
            _this.setData({
              title:res.data.title,
              typeid:res.data.basis_type,
              time:res.data.create_time *1000,
              conts:res.data.content
            })
        }
    })
  },
  onLoad: function (options) {
    var titletxt = ''
    if(options.id == 1){
      titletxt = '基差数据'
    }else if(options.id == 2){
      titletxt = '每日一策'
    }else if(options.id == 3){
      titletxt = '独家报告'
    }
    this.setData({
      id:options.id
    })
    wx.setNavigationBarTitle({
      title: titletxt
    })
    this.getdata()
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