// comm.js 文件
// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
//其他参数可以自定义传入
var loctoken = "";
const requestAjax = function (url, postData, types,message, success, fail) {
  // console.log(data)
  // wx.getStorage({
  //   key: 'token_data',
  //   success (res) {
  //     console.log(res)
  //     loctoken = res.data
  //   }
  // })
  
  try {
    var value = wx.getStorageSync('token_data')
    if(value) {
      loctoken = value
    }
  }catch (e) {
    loctoken = ""
  }
  if(url != '/home/stock/allstock'){
    wx.showNavigationBarLoading()
    if (message != "") {
      wx.showLoading({
        title: message,
      })
    }
  }
  wx.request({
  //可以写上请求的域名  后期改测试服正式服 改一个地方就可以 前缀写上后期上线改地址好改
    url: 'https://api.qihuozzb.com/'+url,
    data: postData,
    header: {
      //'Content-Type': 'application/json' 默认
      'content-type': 'application/x-www-form-urlencoded',
      'Token':loctoken,//根据自己的接口写header的传参
      //'Logintime': logintime
    },
    method: types,//方法也可以改成变量 传入
    success: function (res) {
      //console.log(res.data)
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if(res.data.code == "-1"){
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
      if(res.data.code == "-301"){
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length-1] //获取当前页面的对象
        var url = currentPage.route
        console.log(url)
        if(url !='pages/user/loginpg'){
          wx.showModal({
            title: '提示',
            content: '你还未授权',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../user/loginpg'
                })
              }
            }
          })
          
         
        }
        return false
      }
      if (res.statusCode == 200) {
        success(res.data)
      } else {
        fail()
      }

    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
       console.log(res)
    },
    complete: function (res) {

    },
  })
}
module.exports = {
  requestAjax: requestAjax
}