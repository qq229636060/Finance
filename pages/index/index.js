//index.js
//获取应用实例
const zajax = require('../../utils/comm.js');
const app = getApp()
var datalist_arr = ""
// var uid =1
var t
var chat_id = 'index_stock_room';
var wxstindex;
var firstshow = true
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
    interval: 10000,
    duration: 500,
    current:-1,
    indicatorDots_pic: true,
    vertical_pic: false,
    autoplay_pic: true,
    interval_pic: 2000,
    duration_pic: 500,
    datalist:"",
    notice:"",
    autoplay_not:true,
    interval_not:5000,
    duration_not:500,
    wzlist:""
  },
  startConnect: function () {
    var _this = this
    //本地测试使用 ws协议 ,正式上线使用 wss 协议
    var url = 'wss://api.qihuozzb.com/wss';
    wxstindex = wx.connectSocket({
      url: url,
      method: "GET",
    });
    wxstindex.onOpen(res => {
      console.info('连接打开成功');
    });
    wxstindex.onError(res => {
      console.info('连接识别');
      console.error(res);
    });
    wxstindex.onMessage(res => {
      var data = JSON.parse(res.data)
      //var data = res.data;
      //console.log(data)
      switch (data['type']) {
        case chatType.login:
            console.log(chatType.indextype)
            this.sendToServer(chatType.indextype, '获取数据');
            break;
        case chatType.indextype:
          console.log(data)
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
          if(firstshow){
            _this.setData({
              current:0
            });
            firstshow = false
          }
         _this.setData({
           datalist:datalist_arr
         })
         break;
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
    if (wxstindex.readyState == wxstindex.OPEN) {
      wxstindex.send({
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
      if(wxstindex){
        wxstindex.close(() => {
          console.info('连接关闭');
        });
      }
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      // clearTimeout(t)
      console.log(wxstindex)
      if(wxstindex){
        wxstindex.close(() => {
          console.info('连接关闭');
        });
      }
     
    },
    onShow: function () {
      //this.getdata()
      this.getpagedata()
      this.startConnect()
      this.gettxt()

    },
  getpagedata:function(){
    var _this = this;
    zajax.requestAjax('/home/index/index1','','get','正在加载',function(res){
      if(res.code == 0){
         console.log(res.data.notice)
         _this.setData({
           notice:res.data.notice
         })
      }
    })
  },
  gettxt:function(){
    var _this = this;
    zajax.requestAjax('/home/article/list1?type=5','','get','正在加载',function(res){
      if(res.code == 0){
         _this.setData({
           wzlist:res.data.list
         })
      }
    })
  },
  gotocont:function(e){
    var ids = e.currentTarget.dataset.id
    wx.navigateTo({
      url:"../oneday_news/index?id="+ids
    });
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
  reset () {
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading();
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    setTimeout(() => {
      this.reset();
    }, 3000);
  },
  onLoad: function () {

  }
})
