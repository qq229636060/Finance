// pages/chatroom/talkroom.js
var chat_id = 1;
var uid =1
var wxst;
var from_user = {}
var chatType = {
  bind: 1,//绑定
  login: 2,//登录
  say_in_room: 3,//群聊
  say: 4,//单聊
  chat_list: 5,//获取人
  connect: 7,
  ping: "ping",
  record_history: 8,
  delete: 9,//
  logout: 10,//登出
  allow: 11,//审核通过
  refuse: 12,//审核通过
};
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
    techerrightAnimation:{},
    talklist:"",
    sendcont:""
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
  startConnect: function () {
    //本地测试使用 ws协议 ,正式上线使用 wss 协议
    var url = 'ws://47.111.253.245:7272';
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
      console.info(data);
      if (data.from_user != undefined && data.from_user) {
        from_user = data.from_user;
      }
      switch (data['type']) {
        case chatType.login:
            this.sendToServer(chatType.login, 'I am login');
            break;
        case chatType.ping:
            console.log(1111111111)
            //维持心跳
            this.sendToServer(chatType.pong, "");
            break;
        case chatType.say:
          
        case chatType.say_in_room:
          console.log(uid && data['uid'] && uid != data['uid'])
            if (uid && data['uid'] && uid != data['uid']) {
                
                this.sayContent(data)
                this.pageScrollToBottom();
            }
            return;
        case chatType.chat_list:
            console.log("a")
            break;

        case chatType.delete:
          console.log("b")
            break;
        case chatType.record_history:
            this.setData({
              talklist:data
            })
            this.pageScrollToBottom();
            break;

        case chatType.logout:
            if (!data['msg'] && uid) {
                return;
            }
        //用户下线出路
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
  send:function(){
    if (this.data.sendcont == '') {
      return;
    }
    var time = this.gettime();
    this.sendToServer(chatType.say_in_room, this.data.sendcont);
    var sayData = {
      chat_id: chat_id,
      role: 1,
      uid: uid,
      msg: this.data.sendcont,
      time: time,
      from_id: uid,
      from_user: from_user
    }
    this.sayContent(sayData);
  },
  gettime:function() {
      var date = new Date();
      var currentdate = date.toLocaleTimeString();
      return currentdate;
  },
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('.iner').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom+ 5000
      })
    }).exec()
  },
  sayContent:function(data){
    if (!uid || !data) return;
    // if (data.from_id == uid) {
        var tmparr = this.data.talklist;
        tmparr.msg.push(data);
        this.setData({
            talklist:tmparr,
            sendcont:""
        })
    // }

    this.pageScrollToBottom();
  },
  liseninputcont:function(event){
      console.log(event)
      this.setData({
        sendcont:event.detail.value
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.startConnect()
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
    console.log("guanbi")
    wxst.onClose(() => {
      console.info('连接关闭');
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(wxst)
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