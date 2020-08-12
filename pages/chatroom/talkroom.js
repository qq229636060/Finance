// pages/chatroom/talkroom.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openright:true,
    teachshow:false,
    talkbtn:['../../img/talk.png','../../img/talk1.png'],
    showtalk:0,
    topwindow:0,
    rightwindow:0,
    techertopAnimation:{},
    techerrightAnimation:{}
  },
  animationend:function(){
    if(this.data.topwindow == 0){
      this.setData({
         topwindow:1
      })
    }else{
      this.setData({
         topwindow:0
     })
    }
  },
  animationend_rightbox:function(){
    if(this.data.rightwindow == 0){
      this.setData({
        rightwindow:1
      })
    }else{
      this.setData({
        rightwindow:0
     })
    }
  },
  topbtn:function(){
    if(this.data.topwindow == 0){
      this.animation.translateX(100+'%').step()
      this.setData({techertopAnimation: this.animation.export()})
    }else{
      this.animation.translateX(0).step()
      this.setData({techertopAnimation: this.animation.export()})
    }
  },
  rightbtn:function(){
    if(this.data.rightwindow == 0){
      this.animation.translateX(100+'%').step()
      this.setData({techerrightAnimation: this.animation.export()})
    }else{
      this.animation.translateX(0).step()
      this.setData({techerrightAnimation: this.animation.export()})
    }
  },
  switch:function(){
     if(this.data.showtalk == 0){
        this.setData({
          showtalk:1
        })
     }else{
      this.setData({
        showtalk:0
      })
     }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation()
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