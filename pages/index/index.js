//index.js
//获取应用实例
const app = getApp()
const date = new Date();

Page({
  data: {
    selectedTab: 0,
    year: `${date.getFullYear()}`,
    month: `${date.getMonth()+1}`,
    yearAndMonth: `${date.getFullYear()}-${date.getMonth()+1 > 10 ? date.getMonth() : '0' + (date.getMonth()+1)}`,
    emergencyList: [

    ],
    studayList: [

    ],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindSelectedTab(e) {
    this.setData({
      selectedTab: Number(e.currentTarget.dataset.tab),
    });
  },
  change(e) {
    this.setData({
      selectedTab: Number(e.detail.current),
    });
  },
  call: (e) => {
    wx.makePhoneCall({
      phoneNumber: '15088682347' //仅为示例，并非真实的电话号码
    });
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(app.globalData.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log(app.globalData.userInfo);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  bindChangeMonth: function(e) {
    console.log(e.detail.value);
    this.setData({
      yearAndMonth: e.detail.value,
      year: new Date(e.detail.value).getFullYear(),
      month: new Date(e.detail.value).getMonth()+1,
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  navAction: (e) => {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  }
})
