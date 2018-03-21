//index.js
//获取应用实例
const app = getApp()
const date = new Date();
import { getNextNDay } from '../../libs/moment';

Page({
  data: {
    token: '',
    selectedTab: 0,
    year: `${date.getFullYear()}`,
    month: `${date.getMonth()+1}`,
    date: date.getDate(),
    yearAndMonth: `${date.getFullYear()}-${date.getMonth()+1 > 10 ? date.getMonth() : '0' + (date.getMonth()+1)}`,
    // 未来8天
    nextDays: [],
    fetchingLocation: false,
    latitude: '',
    longitude: '',
    // 是否是未付费的新用户
    newUser: true,
    // 热门课程精选
    courseType: [],
    // 专业的运动教练
    hotCoach: [],
    userInfo: {
    },
    yi_wan_cheng: 0, // 已结束课数
    yi_yu_yue: 0, // 已预约课数
    isFetching: false,
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
  onLoad(options) {
    this.getToken(
      (token) => {
        // 获取首页信息
        this.getIndexData();
        this.getUserInfo();
      }
    );
    this.setData({
      nextDays: [0, 1, 2, 3, 4, 5, 6, 7].map(item => getNextNDay(item)),
      selectedTab: options.selectedTab,
    });
    // 地理位置
    this.setData({
      fetchingLocation: true,
    });
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        console.log(this.data.latitude);
      },
      complete: (res) => {
        this.setData({
          fetchingLocation: false,
        });
      }
    });
    // if (app.globalData.userInfo && app.globalData.userInfo.nickName) {
    //   console.log(app.globalData.userInfo);
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     console.log(app.globalData.userInfo);
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     });
    //   }
    // } else {
    //   // FIXME: 没有处理没有token的情况
    //   const that = this;
    //   let token = app.globalData.token || wx.getStorageSync('token');
    //   wx.request({
    //     url: 'https://ssl.newbeestudio.com/api/user/userinfo',
    //     header: {
    //       token,
    //     },
    //     success: (res) => {
    //       if (res.data.code == '000') { // 之前使用过运用
    //         console.log(res.data);
    //         const user = res.data.datas.user;
    //         user && this.setData({
    //           userInfo: {
    //             avatarUrl: user.portrait,
    //             nickName: user.nickName,
    //           }
    //         });
    //         app.globalData.userInfo = user && { nickName: user.nickName };
    //       }
    //     }
    //   });
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     console.log(app.globalData.userInfo);
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // });
    // }
  },
  // 获取token
  // FIXME: 处理token失效的情况
  getToken(successCallBack, failureCallBack) {
    let token = this.data.token || wx.getStorageSync('token');
    if(token) {
      this.setData({
        token,
      });
      successCallBack && successCallBack(token);
      return;
    }
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'https://ssl.newbeestudio.com/api/wx/login', //仅为示例，并非真实的接口地址
            data: {
              jsCode: res.code,
            },
            success: (res) => {
              if (res.data.code == '000' || res.data.code == '014') { // 获取token成功
                wx.setStorageSync('token', res.data.datas); // 持久化token
                this.setData({
                  token: res.data.datas,
                });
                successCallBack && successCallBack(res.data.datas); // 成功回调
              }
              if (res.data.code == '014') { // 之前没有使用过运用
                this.authSaveUserInfo(res.data.datas);
              }
            }
          });
        } else {
          failureCallBack && failureCallBack();
        }
      }
    });
  },
  // 授权获取用户信息
  authSaveUserInfo(token) {
    const that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: respond => {
              // this.globalData.userInfo = res.userInfo;
              wx.request({
                url: 'https://ssl.newbeestudio.com/api/user/edit', //仅为示例，并非真实的接口地址
                data: {
                  nickName: respond.userInfo.nickName,
                  gender: respond.userInfo.gender,
                  portrait: respond.userInfo.avatarUrl,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded', // 默认值
                  'token': token,
                },
                method: 'POST',
                success: function(res) {
                  if (res.data.code == '000') { // 保存用户信息
                    that.setData({
                      userInfo: {
                        nickName: respond.userInfo.nickName,
                        gender: respond.userInfo.gender,
                        portrait: respond.userInfo.avatarUrl,
                      }
                    });
                  }
                }
              });
            }
          });
        }
      }
    })
  },
  onShow() {
    // 解决用户基本信息编辑了昵称，返回之后的昵称同步问题
    try {
      if (app.globalData.userInfo.nickName !== this.data.userInfo.nickName) {
        this.setData({
          userInfo: { ...this.data.userInfo, nickName: app.globalData.userInfo.nickName },
        });
      }
    } catch(e) {
      console.warn(e);
    }

  },
  /**
   * 获取首页信息
   */
  getIndexData() {
    wx.showLoading()
    this.setData({
      isFetching: true,
    });
    const that = this;
    let token = this.data.token;
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/index', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json', // 默认值
        'token': token,
      },
      method: 'GET',
      success: function(res) {
        wx.hideLoading()
        if (res.data.code == '000') {
          that.setData({
            newUser: res.data.datas.newUser,
            courseType: res.data.datas.courseType,
            hotCoach: res.data.datas.hotCoach,
            isFetching: false,
          });
        }
      },
    });
  },
  getUserInfo() {
    const that = this;
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/user/userinfo', //仅为示例，并非真实的接口地址
      header: {
        'token': this.data.token,
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        if (res.data.code == '000') {
          that.setData({
            userInfo: res.data.datas.user || {},
            yi_wan_cheng: res.data.datas.yi_wan_cheng,
            yi_yu_yue: res.data.datas.yi_yu_yue,
          });
        }
      }
    })
  },
  changeDayAction(e) {
    this.setData({
      year: e.currentTarget.dataset.date.year,
      month: e.currentTarget.dataset.date.month,
      date: e.currentTarget.dataset.date.date,
    });
  },
  bindChangeMonth: function(e) {
    console.log(e.detail.value);
    this.setData({
      yearAndMonth: e.detail.value,
      year: new Date(e.detail.value).getFullYear(),
      month: new Date(e.detail.value).getMonth()+1,
    });
  },
  navAction: (e) => {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  }
})
