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
