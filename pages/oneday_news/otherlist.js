// pages/oneday_news/otherlist.js
const zajax = require('../../utils/comm.js');
Page({

  /**
   * 页面的初始数据
   */

  data: {
      listdata:"",
      id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getdata:function(){
    var _this = this
    zajax.requestAjax('/home/article/list1?type='+_this.data.id,'','get','正在加载',function(res){
        if(res.code == 0){
           _this.setData({
              listdata: res.data.list
           })
        }
    })
  },
  gotocont:function(e){
    var ids = e.currentTarget.dataset.id
    if(this.data.id == 7){
      wx.navigateTo({
        url:"../oneday_news/jcdata?id="+ids
      });
    }else{
      wx.navigateTo({
        url:"../oneday_news/index?id="+ids
      });
    }
   
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    var text = '';
    
    if(options.id == '7'){
      console.log("hahah ")
      text = '基差数据'
    }else if(options.id == 3){
      text = '每日一策'
    }else if(options.id == 6){
      text = '独家报告'
    }
    wx.setNavigationBarTitle({
      title: text
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