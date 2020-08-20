// pages/datalist/index.js
const zajax = require('../../utils/comm.js');
var datalist_arr = ""
var t
Page({

  /**
   * 页面的初始数据
   */
  data: {
      datalist:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.setNavigationBarTitle({
      title: '行情'
    })
    
  },
  getdata:function(){
    var _this = this
    zajax.requestAjax('/home/stock/allstock','','get','正在加载',function(res){
      if(res.code == 0){
           datalist_arr = Object.values(res.data);
           datalist_arr.forEach(function(item,index){
              if(item.yes_settle == null ){
                item.yes_settle = 0.00
              }
              if(item.newest == null ){
                item.newest = 0.00
              }
              item.zf = _this.floatSub(item.yes_settle,item.newest)
              if(item.zf == 0 && item.yes_settle == 0){
                item.zf1 = 0
              }else{
                var temp = String(_this.floatDiv(item.zf,item.yes_settle)).replace(/^(.*\..{4}).*$/,"$1")
                item.zf1 = _this.floatMul(Number(temp),100)+'%'
              }
           })
          _this.setData({
            datalist:datalist_arr
          })
          t = setTimeout(function(){_this.getdata()},1000)
      }
   })
  },
  floatAdd:function(a,b){
    var _this = this;
    var c, d, e;
    if(undefined==a||null==a||""==a||isNaN(a)){a=0;}
    if(undefined==b||null==b||""==b||isNaN(b)){b=0;}
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return  (_this.floatMul(a, e) + _this.floatMul(b, e)) / e;
  },
  floatSub:function(a,b){
    var c, d, e;
    var _this = this;
    if(undefined==a||null==a||""==a||isNaN(a)){a=0;}
    if(undefined==b||null==b||""==b||isNaN(b)){b=0;}
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return (_this.floatMul(a, e) - _this.floatMul(b, e)) / e;
  },
  floatMul:function(a,b){
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  },
  floatDiv:function(a,b){
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.floatMul(c / d, Math.pow(10, f - e));
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
    this.getdata()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(t)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(t)
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