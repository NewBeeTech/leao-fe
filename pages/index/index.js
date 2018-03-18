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
    this.getIndexData();
    this.setData({
      nextDays: [0, 1, 2, 3, 4, 5, 6, 7].map(item => getNextNDay(item)),
      token: app.globalData.token,
    });
    this.setData({
      selectedTab: options.selectedTab,
    })
    // 获取地理位置
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
      // FIXME: 没有处理没有token的情况
      const that = this;
      let token = app.globalData.token || wx.getStorageSync('token');
      wx.request({
        url: 'https://ssl.newbeestudio.com/api/user/userinfo',
        header: {
          token,
        },
        success: (res) => {
          if (res.data.code == '000') { // 之前使用过运用
            console.log(res.data);
            const user = res.data.datas.user;
            user && this.setData({
              userInfo: {
                avatarUrl: user.portrait,
                nickName: user.nickName,
              }
            });
            app.globalData.userInfo = user && { nickName: user.nickName };
          }
        }
      })
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
    }
  },
  onShow() {
    // 解决用户基本信息编辑了昵称，返回之后的昵称同步问题
    try {
      console.log(app.globalData.userInfo, this.data.userInfo)
      if (app.globalData.userInfo.nickName !== this.data.userInfo.nickName) {
        this.setData({
          userInfo: { ...this.data.userInfo, nickName: app.globalData.userInfo.nickName },
        });
      }
    } catch(e) {
      console.warn(e);
    }

  },
  getIndexData() {
    this.setData({
      isFetching: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    if(!token) {
      app.getTokenCallBack = res => {
        token = res;
        console.warn('token: ', res);
        wx.request({
          url: 'https://ssl.newbeestudio.com/api/index', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json', // 默认值
            'token': token,
          },
          method: 'GET',
          success: function(res) {
            console.log(res.data);
            if (res.data.code == '000') {
              that.setData({
                newUser: res.data.datas.newUser,
                courseType: res.data.datas.courseType,
                hotCoach: res.data.datas.hotCoach,
                isFetching: false,
              });
            }
          }
        });
      }
    } else {
      wx.request({
        url: 'https://ssl.newbeestudio.com/api/index', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json', // 默认值
          'token': token,
        },
        method: 'GET',
        success: function(res) {
          console.log(res.data);
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
    }
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
  getUserInfo: function(e) {
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
