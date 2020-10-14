// pages/chatroom/talkroom.js
// var chat_id = 1;
// var uid =1
const { emojis, emojiToPath, textToEmoji,emojisina } = require('../../utils/emojis');

const zajax = require('../../utils/comm.js');
const app = getApp();

let windowHeight;
const inputHeight = 51;
const emojiHeight = 171;
const timeouts = [];

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
  pong:6,
  record_history: 8,
  delete: 9,//
  logout: 10,//登出
  allow: 11,//审核通过
  refuse: 12,//审核通过
  teach_talk:19//老师频道
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
    sendcont:"",
    roomid:"",
    techerbox:"",
    myuid:"",
    showEmojis:false,
    emojiList:"",
    setInter:'',
    emojibox_h:'',
    footall_h:"",
    loctoken:"",
    roleid:"",
    selfface:""
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
  emojibox_h:function(){
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.emojis_box').boundingClientRect(function (rect) {
      that.setData({
        emojibox_h: rect.height + 'px',
        footall_h: rect.height + 30 + 'px'
      })
    }).exec();
  },
  hideemoji:function(){
    this.setData({
      showEmojis:false,
      emojibox_h:0,
      footall_h:0
    })
  },
  toggleEmojis: function () {
      if (this.data.showEmojis) {
        this.hideemoji()
      } else {
        this.setData({
          showEmojis:true
        });
        this.emojibox_h()
        this.pageScrollToBottom()
      }
  },
  // 滚动聊天
  goBottom: function (n = 0) {
    timeouts.push(setTimeout(() => {
      this.setData({
        scrollTop: 9999
      })
    }, n))
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
        this.teacherbox()
        this.hideemoji()
        this.setData({
          showtalk:1
        })
     }else{
      this.setData({
        showtalk:0
      })
     }
     wxst.close(() => {
      console.info('连接关闭');
      });
     this.startConnect()
  },
  startConnect: function () {
    wx.showLoading({
      title: '加载中..',
    })
    //本地测试使用 ws协议 ,正式上线使用 wss 协议
    var url = 'wss://api.qihuozzb.com/wss';
    wxst = wx.connectSocket({
      url: url,
      method: "GET",
      data:{
        toekn:this.data.loctoken,
        client:1
      }
    });
    wxst.onOpen(res => {
      console.info('连接打开成功');
    });
    wxst.onError(res => {
      wx.hideLoading()
      console.info('连接识别');
      console.error(res);
    });
    wxst.onMessage(res => {
      wx.hideLoading();
      var data = JSON.parse(res.data)
      console.info(data);
      if (data.from_user != undefined && data.from_user) {
        from_user = data.from_user;
      }
      switch (data['type']) {
        case chatType.login:
            if(this.data.showtalk == 1){
              this.sendToServer(chatType.teach_talk, 'I am login');
            }else{
              this.sendToServer(chatType.login, 'I am login');
            }
            break;
        case chatType.teach_talk:
          data.msg.forEach((item,index)=>{
            var tmpconts = ''
            textToEmoji(item.msg).forEach((items,index)=>{
              if(items.msgType == "text"){
                const regex = new RegExp('<img', 'gi');
                items.msgCont = items.msgCont.replace(regex, `<img style="width:80%;display:block;margin:0 auto;"`);
                tmpconts += "<span class='smpic'>"+items.msgCont+"</span>"
              }else if(items.msgType == "emoji"){
                tmpconts += "<img src="+items.msgImage+" class='pp'></img>"
              }
            }) 
            item.msg = tmpconts
          })
          this.setData({
            talklist:data
          })
          this.pageScrollToBottom();
          break;
        case chatType.ping:
            console.log(1111111111)
            //维持心跳
            this.sendToServer(chatType.pong, "");
            break;
        case chatType.say:
          
        case chatType.say_in_room:
          console.log(data['client'])
    if (this.data.myuid != data['from_id'] || (data['from_id'] == this.data.myuid && data['client'] == 2))
              {
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
            
            if(data){
              data['myuid'] = this.data.myuid;
              data.msg.forEach((item,index)=>{
                var tmpconts = ''
                textToEmoji(item.msg).forEach((items,index)=>{
                  if(items.msgType == "text"){
                    const regex = new RegExp('<img', 'gi');
                    items.msgCont = items.msgCont.replace(regex, `<img style="width:80%;display:block;margin:0 auto;"`);
                    tmpconts += "<span class='smpic'>"+items.msgCont+"</span>"
                  }else if(items.msgType == "emoji"){
                    tmpconts += "<img src="+items.msgImage+" class='pp'></img>"
                  }
                }) 
                item.msg = tmpconts
              })
            }
            this.setData({
              talklist:data
            })
            this.pageScrollToBottom();
            break;

        case chatType.logout:
            if (!data['msg']) {
                return;
            }
        //用户下线出路
    }
      
    });
   
  },
  
sendToServer: function (type, msg) {
  var _this = this
  var data = {
    type: type,
    msg: msg,
    chat_id: this.data.roomid,
    token: _this.data.loctoken,
    role: this.data.roleid,
    client:1
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
      clearInterval(_this.data.setInter)
      console.error('连接已经关闭');
    }
  },
  send:function(){
    if (this.data.sendcont == '') {
      return;
    }
    var time = this.gettime();
    this.sendToServer(chatType.say_in_room, this.data.sendcont);
    console.log(this.data.selfface)
    var sayData = {
      chat_id: this.data.roomid,
      role: this.data.roleid,
      token: this.data.loctoken,
      msg: this.data.sendcont,
      time: time,
      from_id: this.data.myuid,
      from_user:{avatar:this.data.selfface},
      uid:this.data.myuid,
      client:1
    }
    var tmpcont=''
    textToEmoji(sayData.msg).forEach((item,index)=>{
        if(item.msgType == "text"){
          const regex = new RegExp('<img', 'gi');
          item.msgCont = item.msgCont.replace(regex, `<img style="width:80%;display:block;margin:0 auto;"`);
          tmpcont += "<span class='smpic'>"+item.msgCont+"</span>"
        }else if(item.msgType == "emoji"){
          tmpcont += "<img src="+item.msgImage+" class='pp'></img>"
        }
    })
    sayData.msg = tmpcont
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
    if (!data) return;
        console.log(data)
        var tmparr
        if(this.data.talklist == ''){
          tmparr = {}
          tmparr.msg =[]
        }else{
          tmparr = this.data.talklist
        }
        if(data){
          tmparr.msg.push(data);
          this.setData({
              talklist:tmparr,
              sendcont:""
          })
        }
        
    

    this.pageScrollToBottom();
  },
  liseninputcont:function(event){
      this.setData({
        sendcont:event.detail.value
      })
  },
  teacherbox:function(){
    var _this = this;
    var data = { id: this.data.roomid}
    zajax.requestAjax('/home/chat/detail',data,'get','正在加载',function(res){
        _this.setData({
          techerbox:res.data
        })
    })
  },
  getuserinfo:function(){
    var _this = this;
    zajax.requestAjax('/home/user/userinfo','','get','正在加载',function(res){
      if(res.code == 0){
        console.log(res.data.avatar)
        _this.setData({
          myuid:res.data.id,
          roleid:res.data.role,
          selfface:res.data.avatar
        })
        _this.startConnect()
      }
    })
  },
  // 点击表情
  clickEmoji: function (e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ sendcont: this.data.sendcont + key });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const sysInfo = wx.getSystemInfoSync()
    windowHeight = sysInfo.windowHeight
    const scrollHeight = `${windowHeight - inputHeight}px`
    //获取表情包
  
    
    
    // const emojiList = Object.keys(emojis).map(key => ({
    //   key: key,
    //   img: emojiToPath(key)
    // }))
     this.setData({
       roomid:options.id,
      //  emojiList:emojiList
       emojiList:emojisina.emoji_sina
     })
     this.getuserinfo()
    
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
  onShow: function (e) {
    try {
      var value = wx.getStorageSync('token_data')
      if(value) {
        this.setData({
          loctoken:value
        })
      }
    }catch (e) {
      this.setData({
        loctoken:''
      })
    }
    this.startSetInter()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var _this = this
    wxst.close(() => {
      console.info('连接关闭');
      });
    clearInterval(_this.data.setInter)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var _this = this
    wxst.close(() => {
      console.info('连接关闭');
    });
    clearInterval(_this.data.setInter)
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