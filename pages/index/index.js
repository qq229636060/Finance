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
    wzlist:"",
    setInter:"",
    bannerdata:"",
    roleid:"",
    index:""
  },
  gotoh5:function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url:"../oneday_news/h5?url="+url
    });
  },
  gotoall:function(){
    wx.switchTab({
      url: '../datalist/index'
    })
  },
  startSetInter: function(){
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
        function () {
          that.sendToServer(chatType.ping, "");
        }
  ,55000);   
},
  startConnect: function () {
    var _this = this
    //本地测试使用 ws协议 ,正式上线使用 wss 协议
    var url = 'wss://api.qihuozzb.com/wss:7372';
    wxstindex = wx.connectSocket({
      url: url,
      method: "GET",
    });
    wxstindex.onOpen(res => {
      console.info('连接打开成功');
    });
    wxstindex.onError(res => {
      console.info('连接识别');
      clearInterval(this.data.setInter)
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
      role: -1,
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
        wxstindex.close(() => {
          console.info('连接关闭');
        });
        clearInterval(this.data.setInter)
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
      console.log(wxstindex)
      if(wxstindex){
      wxstindex.close(function(res) {
        console.log('WebSocket 已关闭！')
      })}
      clearInterval(this.data.setInter)
      // if(wxstindex){
      //   wxstindex.close((res) => {
      //     console.log(res)
      //     console.info('连接关闭');
      //     clearInterval(this.data.setInter)
      //   });
      // }
      
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      
      if(wxstindex){
        wxstindex.close(function(res) {
          console.log('WebSocket 已关闭！')
        })}
      clearInterval(this.data.setInter)
      // console.log(wxstindex)
      // wx.onSocketClose(function(res) {
      //   console.log('WebSocket 已关闭！')
      // })
      // clearTimeout(t)
      // wx.closeSocket({

      // })
      // console.log(wxstindex)
      //   wxstindex.close((res) => {
      //     console.log(res)
      //     console.info('连接关闭');
          
      //   });
        clearInterval(this.data.setInter)
     
    },
    onShow: function () {
      //this.getdata()
      this.getpagedata()
      //this.startConnect()
      this.gettxt()
      this.startSetInter()
      this.getuserinfo()

    },
  getpagedata:function(){
    var _this = this;
    zajax.requestAjax('/home/index/index1','','get','正在加载',function(res){
      if(res.code == 0){
         console.log(res.data.notice)
         _this.setData({
           notice:res.data.notice,
           bannerdata:res.data.banner,
           index:res.data.index
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
          url:"../chatroom/list?chatid=1"
        });
        break;
      case '2':
        wx.navigateTo({
          url:"../school/index"
        });
        break;
        case '3':
        wx.navigateTo({
          url:"../chatroom/list?chatid=2"
        });
        break;
      case '4':
          wx.navigateTo({
            url:"../oneday_news/otherlist?id=7"
          });
          break;
      case '5':
            
            wx.navigateTo({
              url:"../oneday_news/otherlist?id=3"
            });
            break;
      case '6':
              if(this.data.index.indexOf(1) == -1){
                wx.showModal({
                  title: '提示',
                  content: '您没权限访问,请开通！',
                  showCancel:false
                })
              }else{
                wx.navigateTo({
                  // url:"../oneday_news/list"
                  url:"../oneday_news/otherlist?id=6"
                });
              }
             
              break;
      case '7':
        if(this.data.index.indexOf(2) == -1){
          wx.showModal({
            title: '提示',
            content: '您没权限访问,请开通！',
            showCancel:false
          })
        }else{
          wx.navigateTo({
            url:"../boduan/index"
          });
        }
        break;
      case '8':
                wx.navigateTo({
                  url:"../oneday_news/otherlist?id=8"
                });
                break;
                // wx.navigateTo({
                //     url:"../Economic/index"
                // });
                  break;
     case '9':
                wx.navigateTo({
                      url:"../novice/list"
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
  getuserinfo:function(){
    var _this = this;
    zajax.requestAjax('/home/user/userinfo','','get','正在加载',function(res){
      if(res.code == 0){
        console.log(res.data.avatar)
        _this.setData({
          roleid:res.data.role,
        })
        _this.startConnect()
      }
    })
  },
  onLoad: function () {

  }
})
