// pages/oneday_news/index.js
const zajax = require('../../utils/comm.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      title:"",
      conts:"",
      ids:"",
      time:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ids:options.id
    })
    var text = "";
    if(options.nav == 5){
      text = '每日一策'
    }else if(options.nav == 6){
      text = '独家报告'
    }
    wx.setNavigationBarTitle({
      title: text
    })
    this.getcont()
  },
  getcont:function(){
    var _this = this;
    var data={
      id:_this.data.ids
    }
    zajax.requestAjax('/home/article/detail',data,'get','正在加载',function(res){
      if(res.code == 0){
         var cont = res.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
         var times =  new Date(res.data.create_time *1000)
         console.log(times)
         
         _this.setData({
            title:res.data.title,
            conts:cont,
            time:res.data.create_time *1000
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