// pages/school/index.js
const zajax = require('../../utils/comm.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    types:2,
    pages:0,
    list:""
  },
  goto_vcont:function(e){
    wx.navigateTo({
      url:"vcont?id="+e.currentTarget.dataset.id
    });
  },
  goto_tcont:function(e){
    wx.navigateTo({
      url:"tcont?id="+e.currentTarget.dataset.id
    });
  },
  onChange:function(e){
      if(e.detail.index == 0){
          this.setData({
            types:2
          })
      }else{
         this.setData({
            types:1
         })
      }
      this.getdata()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '磐石学院'
    })
    this.getdata()
  },
  getdata:function(){
    var _this = this;
    var data = {
      type:this.data.types,
      pageNum:this.data.pages,
      pageSize:10
    }
    zajax.requestAjax('/home/course/list1',data,'get','正在加载',function(res){
        if(res.code == 0){
           _this.setData({
             list:res.data.list
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