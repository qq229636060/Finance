// pages/school/text_cont.js
const zajax = require('../../utils/comm.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:"",
      conts:"",
      c_cont:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id:options.id
      })
      this.getcont()
  },
  getcont:function(){
    var _this = this;
    var data = {
      id:this.data.id
    }
    zajax.requestAjax('/home/course/detail',data,'get','正在加载',function(res){
       if(res.code == 0){
          var cont = res.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
          _this.setData({
            conts:res.data,
            c_cont:cont
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