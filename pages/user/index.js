// pages/user/index.js
const zajax = require('../../utils/comm.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo_data:"",
    islogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },
  getdata(){
    var _this = this;
    zajax.requestAjax('/home/user/userinfo','','get','正在加载',function(res){
      if(res.code == 0){
         _this.setData({
            userinfo_data:res.data,
            islogin:true
         })
      }
    })
  },
  btn_sub:function(res){
    var _this =this;
    console.log(res)
    app.globalData.userInfo = res.detail.userInfo;
    app.globalData.usedata = res.detail;
    console.log(app.globalData)
    if (app.globalData.userInfo) {
      wx.login({
        success: res => {
          console.log(res)
          var data={
            code:res.code,
            // encryptedData:app.globalData.usedata.encryptedData,
            // iv:app.globalData.usedata.iv,
            // signature:app.globalData.usedata.signature,
            rawData:app.globalData.usedata.rawData
          }
          zajax.requestAjax('/home/wechat/login',data,'post','正在加载',function(res){
            if(res.code == 0){
              if(res.code == 0){
                if(!res.data.token){
                  wx.navigateTo({
                    url:"moblie?opid="+res.data.openid+'&skey='+res.data.session_key
                  });
                }else{
                  wx.setStorage({
                    key:"token_data",
                    data:res.data.token,
                    success(res){
                      _this.getdata()
                    }
                  })
                   
                }
                
              }
             //_this.gotomobile()
            }
         })
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