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
    dayIndex: 0,
    fetchingLocation: false,
    latitude: '',
    longitude: '',
    // 是否是未付费的新用户
    newUser: true,
    // 热门课程精选
    courseType: [],
    // 专业的运动教练
    hotCoach: [],
    recommendCourse: [],
    // 我的预约课程
    myCourse: [],
    calendarCourses: [],
    userInfo: {
    },
    yi_wan_cheng: 0, // 已结束课数
    yi_yu_yue: 0, // 已预约课数
    hour: 0, // 可用课时，进度是100
    gyms: [], // 场馆
    feedbackCount: 0, // 反馈未读红点数
    phyCount: 0, // 体侧未读红点数
    shareUserId: '', // 分享人userId
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
        this.getGyms();
        this.getCourses(getNextNDay(0).dateObj,getNextNDay(7).dateObj);
      }
    );
    this.setData({
      nextDays: [0, 1, 2, 3, 4, 5, 6, 7].map(item => getNextNDay(item)),
      selectedTab: options.selectedTab,
      shareUserId: options.userId || '',
    });
    // 地理位置
    this.setData({
      fetchingLocation: true,
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
        // if (res.authSetting['scope.userInfo']) {
        if (res.errMsg === 'getSetting:ok') {
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
            },
            fail: res => {
              console.log(res);
            }
          });
        }
      }
    })
  },
  onShow() {
    this.getIndexData();
    this.getUserInfo();
    // this.getGyms();
    this.getCourses(getNextNDay(0).dateObj,getNextNDay(7).dateObj);
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
          if (res.data.datas.myCourse) {
            let result = res.data.datas;
            result.myCourse = result.myCourse.map(item => {
              let beginTime = item.beginTime;
              if (beginTime) {
                beginTime = beginTime.replace(new RegExp('-', 'g'), '/');
                beginTime = new Date(beginTime);
                const month = beginTime.getMonth() + 1;
                const date = beginTime.getDate();
                const min = beginTime.getMinutes() || '00';
                const hour = beginTime.getHours() >= 10 ? beginTime.getHours() : '0'+beginTime.getHours();
                return ({
                  ...item,
                  dateText: `${month}月${date}日`,
                  timeText: `${hour}:${min}`,
                });
              }
            });
            that.setData({
              newUser: result.newUser,
              courseType: result.courseType,
              hotCoach: result.hotCoach,
              myCourse: result.myCourse,
              recommendCourse: result.recommendCourse,
            });
          } else {
            if (res.data.datas.recommendCourse) {
              let result = res.data.datas;
              result.recommendCourse = result.recommendCourse.map(item => {
                let beginTime = item.beginTime;
                if (beginTime) {
                  beginTime = beginTime.replace(new RegExp('-', 'g'), '/');
                  beginTime = new Date(beginTime);
                  const month = beginTime.getMonth() + 1;
                  const date = beginTime.getDate();
                  const min = beginTime.getMinutes() || '00';
                  const hour = beginTime.getHours() >= 10 ? beginTime.getHours() : '0'+beginTime.getHours();
                  return ({
                    ...item,
                    dateText: `${month}月${date}日`,
                    timeText: `${hour}:${min}`,
                  });
                }
              });
              that.setData({
                newUser: result.newUser,
                courseType: result.courseType,
                hotCoach: result.hotCoach,
                myCourse: [],
                recommendCourse: result.recommendCourse,
              });
            } else {
              that.setData({
                newUser: res.data.datas.newUser,
                courseType: res.data.datas.courseType,
                hotCoach: res.data.datas.hotCoach,
                myCourse: res.data.datas.myCourse,
                recommendCourse: res.data.datas.recommendCourse,
              });
            }
          }
        }
      },
    });
  },
  getGyms() {
    const that = this;
    const token = this.data.token;
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        wx.request({
          url: 'https://ssl.newbeestudio.com/api/index/gymList',
          header: {
            token,
          },
          data: {
            lang: res.longitude,
            lat: res.latitude,
          },
          success: (res) => {
            if(res.data.code === '000') {
              let gyms = res.data.datas;
              gyms = gyms && gyms.map(item => ({ ...item, distance: item.distance && item.distance.toFixed(1)}));
              this.setData({
                gyms: gyms,
              });
            }
          }
        });
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
          if (res.data.datas.user) {
            that.setData({
              userInfo: res.data.datas.user || {},
              yi_wan_cheng: res.data.datas.yi_wan_cheng,
              yi_yu_yue: res.data.datas.yi_yu_yue,
              hour: res.data.datas.hour,
            });
            that.getCount();
            that.handShareUser();
            app.globalData.userInfo = res.data.datas.user;
          } else {
            that.authSaveUserInfo(that.data.token);
          }

        }
      }
    })
  },
  getCourses(begin, end) {
    const that = this;
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/calendar', //仅为示例，并非真实的接口地址
      header: {
        'token': this.data.token,
      },
      data: {
        begin: begin.getTime(),
        end: end.getTime(),
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        if (res.data.code == '000') {
          let result = res.data.datas;
          result = result.map(item => {
            return item.map(course => {
              if (course) {
                let beginTime = course.beginTime;
                beginTime = beginTime.replace(new RegExp('-', 'g'), '/');
                beginTime = new Date(beginTime);
                const month = beginTime.getMonth() + 1;
                const date = beginTime.getDate();
                const min = beginTime.getMinutes() || '00';
                const hour = beginTime.getHours() >= 10 ? beginTime.getHours() : '0'+beginTime.getHours();
                course.dateText = `${month}月${date}日`;
                course.timeText = `${hour}:${min}`;
                if (beginTime < new Date()) {
                  course.showText = '已结束';
                  course.showColor = '#b3b5b2';
                } else if (course.signStatus === 1) {
                  course.showText = '已预约';
                  course.showColor = '#09bb07';
                } else if (course.count === course.maxCount) {
                  course.showText = `${course.count}/${course.maxCount}`;
                  course.showColor = '#b3b5b2';
                } else if (course.count < course.maxCount) {
                  course.showText = `${course.count}/${course.maxCount}`;
                  course.showColor = '#fc6621';
                }
              }
              console.log(course);
              return course;
            });
          });
          that.setData({
            calendarCourses: res.data.datas,
          });
        }
      }
    })
  },
  getCount() {
    const that = this;
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/hotCount', //仅为示例，并非真实的接口地址
      header: {
        'token': that.data.token,
      },
      data: {
        userId: that.data.userInfo.id,
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        if (res.data.code == '000') {
          let result = res.data.datas;
          that.setData({
            feedbackCount: res.data.datas.feedbackCount,
            phyCount: res.data.datas.phyCount,
          });
        }
      }
    })
  },
  handShareUser() {
    const that = this;
    console.log(that.data.userInfo.id);
    console.log(that.data.shareUserId);
    if(that.data.shareUserId && that.data.userInfo.id && (that.data.userInfo.id !== that.data.shareUserId)) {
      wx.request({
        url: 'https://ssl.newbeestudio.com/api/user/handShareUser', //仅为示例，并非真实的接口地址
        header: {
          'token': that.data.token,
        },
        data: {
          shareUserId: that.data.shareUserId,
        },
        method: 'GET',
        success: function(res) {
          console.log(res.data);
        }
      })
    }
  },
  changeDayAction(e) {
    this.setData({
      year: e.currentTarget.dataset.date.year,
      month: e.currentTarget.dataset.date.month,
      date: e.currentTarget.dataset.date.date,
      dayIndex: e.currentTarget.dataset.dayindex,
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
  /**
   * 跳转任意页面路径
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  navAction(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?userId=' + this.data.userInfo.id,
    });
  },
  /**
   * 改变首页tab
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  changeTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      selectedTab: tab,
    });
  },
  /**
   * 跳转到课程类型页面
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  navToCourseType: (e) => {
    console.log(e);
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/courseType/courseType?id='+id,
    });
  },
  /**
   * 跳转到课程页面
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  navToCourse(e) {
    const id = e.currentTarget.dataset.id;
    const userId = this.data.userInfo.id;
    const type = this.data.userInfo.type;
    if(type === 1) {
      wx.navigateTo({
        url: '/pages/course/course?id='+id,
      });
    }
    if(type === 2) {
      wx.navigateTo({
        url: '/pages/coachCourse/coachCourse?id='+id+'&userId='+userId,
      });
    }
  },
  navToCoach: (e) => {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/coach/coach?id='+id,
    });
  },
  navToGym: (e) => {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/gym/gym?id='+id,
    });
  },
  routeToShare: () => {
    wx.navigateTo({
      url: '/pages/invitation/invitation?userId='+this.data.userInfo.id,
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '乐傲运动',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})
