const app = getApp()
import { formatTime } from '../../libs/moment'

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
    });
  },
  onShow() {
    this.getUserTextInfoAction();
    this.getUserInfo();
  },
  getUserInfo() {
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/user/userinfo', //仅为示例，并非真实的接口地址
      header: {
        'token': token,
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        if (res.data.code == '000') {
          if (res.data.datas.user) {
            that.setData({
              userInfo: res.data.datas.user || {},
              'userInfo.resMoney': res.data.datas.user.money ? (res.data.datas.user.money/100).toLocaleString('en-US').toFixed(2) : 0,
              'userInfo.resTotalMoney': res.data.datas.user.totalMoney ? (res.data.datas.user.totalMoney/100).toLocaleString('en-US').toFixed(2) : 0,
            });
          }
        }
      }
    })
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
            result.time = formatTime(result.updateTime, 'Y.M.D');
          }
          that.setData({
            testInfo: result,
          })
          wx.hideLoading();
        }
      }
    });
  }
});
