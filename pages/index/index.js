//index.js
//获取应用实例
const zajax = require('../../utils/comm.js');
const app = getApp()
var datalist_arr = ""
var uid =1
var t
var chat_id = 'index_stock_room';
var wxst
var chatType = {
  login: 2,//登录
  ping: "ping",
  indextype:14//获取数据
};
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 6000,
    duration: 500,
    indicatorDots_pic: true,
    vertical_pic: false,
    autoplay_pic: true,
    interval_pic: 2000,
    duration_pic: 500
  },
  startConnect: function () {
    var _this = this
    //本地测试使用 ws协议 ,正式上线使用 wss 协议
    var url = 'ws://47.111.253.245:7272';
    wxst = wx.connectSocket({
      url: url,
      method: "GET",
    });
    wxst.onOpen(res => {
      console.log(res)
      console.info('连接打开成功');
      console.log(res)
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
            console.log(chatType.indextype)
            this.sendToServer(chatType.indextype, '获取数据');
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
      uid: uid,
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
    onShow: function () {
      //this.getdata()
      this.startConnect()
    },
  gotonav:function(e){
     var e_id = e.currentTarget.dataset.id;
     switch(e_id){
      case '1':
        wx.navigateTo({
          url:"../chatroom/list"
        });
        break;
      case '2':
        wx.navigateTo({
          url:"../school/index"
        });
        break;
      case '4':
          wx.navigateTo({
            url:"../datalist/index"
          });
          break;
      case '5':
            wx.navigateTo({
              url:"../oneday_news/index?nav=5"
            });
            break;
      case '6':
              wx.navigateTo({
                url:"../oneday_news/index?nav=6"
              });
              break;
      case '7':
                wx.navigateTo({
                  url:"../boduan/index"
                });
                break;
      case '8':
                wx.navigateTo({
                    url:"../Economic/index"
                });
                  break;
     case '9':
                wx.navigateTo({
                      url:"../novice/index"
                });
                break;
     case '10':
                wx.navigateTo({
                            url:"../user/joinus"
                });
                break;
     }  
  },
  onLoad: function () {

  }
})
