// pages/datalist/index.js
const zajax = require('../../utils/comm.js');
var datalist_arr = ""
// var uid =1

var chat_id = 'all_stock_room';
var wxst
var chatType = {
  login: 2,//登录
  ping: "ping",
  listtype:13//获取数据
};
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
  startConnect: function () {
    var _this = this
    //本地测试使用 ws协议 ,正式上线使用 wss 协议
    var url = 'wss://api.qihuozzb.com/wss';
    wxst = wx.connectSocket({
      url: url,
      method: "GET",
    });
    wxst.onOpen(res => {
      console.info('连接打开成功');
    });
    wxst.onError(res => {
      console.info('连接识别');
      console.error(res);
    });
    wxst.onMessage(res => {
      var data = JSON.parse(res.data)
      //var data = res.data;
      console.log(data)
      switch (data['type']) {
        case chatType.login:
            this.sendToServer(chatType.listtype, '获取数据');
            break;
        case chatType.listtype:
          datalist_arr = Object.values(data.msg);
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
          
        }
       
    });
   
  },
  sendToServer: function (type, msg) {
    var data = {
      type: type,
      msg: msg,
      chat_id: chat_id,
      token: 1,
      role: 1,
    };
    if (wxst.readyState == wxst.OPEN) {
      wxst.send({
        data:JSON.stringify(data),
        success: (res) => {
          console.info('客户端发送成功');
          //this.pageScrollToBottom()
        }
       });
      } else {
        console.error('连接已经关闭');
      }
    },
  // getdata:function(){
  //   var _this = this
  //   zajax.requestAjax('/home/stock/allstock','','get','正在加载',function(res){
  //     if(res.code == 0){
  //          datalist_arr = Object.values(res.data);
  //          datalist_arr.forEach(function(item,index){
  //             if(item.yes_settle == null ){
  //               item.yes_settle = 0.00
  //             }
  //             if(item.newest == null ){
  //               item.newest = 0.00
  //             }
  //             item.zf = _this.floatSub(item.yes_settle,item.newest)
  //             if(item.zf == 0 && item.yes_settle == 0){
  //               item.zf1 = 0
  //             }else{
  //               var temp = String(_this.floatDiv(item.zf,item.yes_settle)).replace(/^(.*\..{4}).*$/,"$1")
  //               item.zf1 = _this.floatMul(Number(temp),100)+'%'
  //             }
  //          })
  //         _this.setData({
  //           datalist:datalist_arr
  //         })
  //         t = setTimeout(function(){_this.getdata()},1000)
  //     }
  //  })
  // },
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
    //this.getdata()
    this.startConnect()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wxst.close(() => {
      console.info('连接关闭');
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // clearTimeout(t)
    wxst.close(() => {
      console.info('连接关闭');
    });
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