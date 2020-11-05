//index.js
//获取应用实例
const app = getApp()
Component({
  properties: {
    scollbt:{
      type: null,
      observer:function(newVal, oldVal){
        console.log(newVal)
        this.setData({
          scollbt: newVal
        })
      }
    },
    talklist: {            // 属性名
      type: null,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function (newVal, oldVal) { 
        if(newVal){
          this.setData({
            talklist : newVal
          })
        }
       
      }
    }
  },
  data:{
    last_len:""
  },
  methods: {
    clickimg:function(e){
     console.log(e)
     var t =  e.target.dataset.img;
     if (t.indexOf("src=") != '-1' ){
          t.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
          console.log(capture);
          wx.previewImage({
            current: capture, // 当前显示图片的http链接
            urls: [capture] // 需要预览的图片http链接列表
          })
        })
     }
    }
  },
  
})
