// pages/school/tcont.js
const zajax = require('../../utils/comm.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     cont_id:"",
     zj_list:"",
     number:"",
     fm_img:""
  },
  goto_textcont:function(e){
    var ids = e.currentTarget.dataset.id
    wx.navigateTo({
      url:"text_cont?id="+ids
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       cont_id:options.id,
       fm_img:options.img
     })
     this.getlistdata()
  },
  getlistdata(){
    var _this = this
    var data = {
      pid:this.data.cont_id
    }
    zajax.requestAjax('/home/course/chapter',data,'get','正在加载',function(res){
        if(res.code == 0){
          _this.setData({
            zj_list:res.data.list,
            number:res.data.list.length
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