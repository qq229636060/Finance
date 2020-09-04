//index.js
//获取应用实例
const app = getApp()
Component({
  properties: {
    talklist: {            // 属性名
      type: null,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function (newVal, oldVal) { 
        this.setData({
          talklist : newVal
        })
      }
    }
  },
  data:{},
  methods: {}
})
