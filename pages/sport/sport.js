const app = getApp()

Page({
  data: {
    testInfo: {},
    userInfo: {},
    isFetching: false,
    error: '',
  },
  onLoad: function (e) {
    const userId = e.userId
    this.setData({
      userId,
      userInfo: app.globalData.userInfo
    });
    this.getUserTextInfoAction();
  },
  inputChangeAction(e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    this.setData({
      [name]: value,
    });
  },
  // 获取
  getUserTextInfoAction(descJson) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/phyInfo', //仅为示例，并非真实的接口地址
      data: {
        userId:that.data.userId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': token,
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == '000') { // 之前使用过运用
          const result = res.data.datas;
          if(result) {
            result.jsonObj = JSON.parse(result.descJson);
            result.time = new Date(result.updateTime).Format('yyyy.MM.dd');
          }
          that.setData({
            testInfo: result,
          })
          wx.hideLoading();
        }
      }
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '乐傲运动',
      path: '/page/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
});
