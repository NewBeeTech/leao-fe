const app = getApp();
import { formatTime } from '../../libs/moment'

Page({
  data: {
    richTextArray: [],
    portrait: ''
  },
  onLoad(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    console.log(e.portrait);
    this.setData({ portrait: e.portrait, token: wx.getStorageSync('token'), });
    const that = this;
    wx.request({
      url: 'https://ssl.newbeestudio.com/about_us/about_us.json',
      success: (res) => {
        console.log(res);
        try {
          const data = res.data;
          const richTextArray = data || [];
          that.setData({
            richTextArray,
          });
        } catch(e) {
          console.warn(e);
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  /**
   * 成为小狮子会员
   * @return {[type]} [description]
   */
  routeToPay() {
    wx.navigateTo({
      url: '/pages/shop/shop',
    });
  },
  /**
   * 点击成为小狮子会员，微信用户信息授权并跳转
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  navUserAction(e) {
    if (this.data.portrait) { // 有头像直接跳转
      this.routeToPay()
    } else {
      const that = this;
      const token = that.data.token;
      if (e.detail.userInfo) { // 有授权用户信息进行上传
        wx.showLoading();
        wx.request({
          url: 'https://ssl.newbeestudio.com/api/user/edit', //仅为示例，并非真实的接口地址
            data: {
              nickName: e.detail.userInfo.nickName,
              gender: e.detail.userInfo.gender,
              portrait: e.detail.userInfo.avatarUrl,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded', // 默认值
              'token': token,
            },
            method: 'POST',
            success: function(res) {
              wx.hideLoading();
              if (res.data.code == '000') { // 保存用户信息
                that.setData({
                  userInfo: {
                    nickName: e.detail.userInfo.nickName,
                    gender: e.detail.userInfo.gender,
                    portrait: e.detail.userInfo.avatarUrl,
                  }
                });
                wx.navigateTo({
                  url: e.currentTarget.dataset.url + '?userId=' + that.data.userInfo.id,
                });
              }
            }
          });
      } else {
        // 无授权用户信息，跳转
        wx.navigateTo({
          url: e.currentTarget.dataset.url + '?userId=' + that.data.userInfo.id,
        });
      }
    }
  },
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '乐傲运动·专业、有爱、有趣的青少年运动训练',
      path: '/pages/aboutUs/aboutUs',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
});
