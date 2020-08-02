//index.js
//获取应用实例
const app = getApp()

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
  gotonav:function(e){
     var e_id = e.currentTarget.dataset.id;
     switch(e_id){
      case '2':
        wx.navigateTo({
          url:"../school/index"
        });
        break;
     }  
  },
  onLoad: function () {

  }
})
