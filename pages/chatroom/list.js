// pages/chatroom/list.js
const zajax = require('../../utils/comm.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:"",
      chatid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var titletxt;
    if(options.chatid == 1){
       titletxt = '磐石服务'
    }else if(options.chatid == 2){
       titletxt = '赢在大户室'
    }
    this.setData({
      chatid:options.chatid
    })
    wx.setNavigationBarTitle({
      title:titletxt
    })
    this.getlist()
  },
  gototalk:function(e){
    console.log(e)
    this.getuserinfo(e.currentTarget.dataset.access,e.currentTarget.dataset.id);
   
  },
  getlist:function(){
    var _this = this;
    var data ={
      type:this.data.chatid
    }
    zajax.requestAjax('/home/chat/index',data,'get','正在加载',function(res){
        if(res.code == 0){
          _this.setData({
            list:res.data
          })
        }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getuserinfo:function(pow,powid){
    var _this = this;
    zajax.requestAjax('/home/user/userinfo','','get','正在加载',function(res){
       if(res.code == 0){
        if(pow){
          wx.navigateTo({
            url:"../chatroom/talkroom?id="+powid
          });
        }else{
          wx.showModal({
            title: '提示',
            content: '您没权限访问,请开通！',
            showCancel:false
          })
        }
       }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.getuserinfo()
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