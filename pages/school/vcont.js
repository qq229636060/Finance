// pages/school/vcont.js
const zajax = require('../../utils/comm.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      cont_id:"",
      contdata:"",
      contlist:"",
      nowid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        cont_id:options.id,
      })
      this.getcont_list();
  },
  // getdata:function(){
  //   var _this = this;
  //   var data={
  //     id:this.data.cont_id
  //   }
  //   zajax.requestAjax('/home/course/detail',data,'get','正在加载',function(res){
  //       if(res.code == 0){
  //          _this.setData({
  //            contdata:res.data
  //          })
  //          _this.getcont_list();
  //       }
  //   })
  // },
  getcont_list:function(){
    var _this = this;
    var data = {
      pid:this.data.cont_id
    }
    zajax.requestAjax('/home/course/chapter',data,'get','正在加载',function(res){
        if(res.code == 0){
           if(res.data.count != 0){
            _this.setData({
              contlist:res.data.list,
              contdata:res.data.list[0],
              nowid:res.data.list[0].id
            })
          }else{
            
          }
        }
    })
  },
  qiehuan:function(e){
      var ids = e.currentTarget.dataset.id
      this.data.contlist.forEach(items => {
             if(items.id == ids){
                this.setData({
                   contdata:items,
                   nowid:ids
                })
             }
      });
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