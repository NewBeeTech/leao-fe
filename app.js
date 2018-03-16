//app.js
App({
  onLaunch: function () {
    // 登录
    if (!this.globalData.token) { // 如果没有token，进行主动登录
      this.getToken(
        (token) => { console.log(token)},
        () => { console.log('授权失败') },
      );
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getToken: (success, failure) => {
    const token = wx.getStorageSync('token');
    if (token) {
      success(token);
    } else {
      // 主动授权获取接口
      wx.login({
        success: res => {
          success(res);
        },
        failure: failure,
      });
    }
  },
  globalData: {
    userInfo: null,
    token: '',
  }
})
