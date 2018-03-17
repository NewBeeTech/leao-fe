//app.js
const app = getApp()
App({
  onLaunch() {
    // 登录
    if (!this.globalData.token) { // 如果没有token，进行主动登录
      this.getToken(
        (token) => { },
        () => { console.log('授权失败') },
      );
    }
  },
  authSaveUserInfo(token) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;

              wx.request({
                url: 'https://ssl.newbeestudio.com/api/user/edit', //仅为示例，并非真实的接口地址
                data: {
                  nickName: res.userInfo.nickName,
                  gender: res.userInfo.gender,
                  portrait: res.userInfo.avatarUrl,
                },
                header: {
                  'content-type': 'application/json', // 默认值
                  'token': token,
                },
                method: 'POST',
                success: function(res) {
                  console.log('保存用户信息');
                  if (res.data.code == '000') { // 之前使用过运用

                  } else if (res.data.code == '014') { // 之前没有使用过运用
                    // TODO: 保存用户信息
                  }
                }
              });
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          });
        }
      }
    })
  },
  getToken(success, failure) {
    console.log(this);
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'https://ssl.newbeestudio.com/api/wx/login', //仅为示例，并非真实的接口地址
            data: {
              jsCode: res.code,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: (res) => {
              if (res.data.code == '000') { // 之前使用过运用
                wx.setStorageSync('token', res.data.datas);
              } else if (res.data.code == '014') { // 之前没有使用过运用
                // TODO: 保存用户信息
                this.authSaveUserInfo(res.data.datas);
              }
            }
          });
        } else {
          failure && failure();
        }
      }
    });
  },
  requestLogin(success, failure) {
    wx.login({
      success: res => {
      },
      failure: failure,
    });

  },
  globalData: {
    userInfo: null,
    token: wx.getStorageSync('token'),
  }
})
