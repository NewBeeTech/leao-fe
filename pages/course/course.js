const app = getApp();
Page({
  data: {
    course: {
    },
    token: '',
  },
  onLoad(options) {
    if (!this.data.token) {
      this.setData({
        token: wx.getStorageSync('token'),
      });
    }
    const id = options.id
    this.getCourse(id);
  },
  /**
   * 获取课程信息
   * @param  {[type]} id 课程id
   * @return {[type]}    [description]
   */
  getCourse(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/info?courseId='+id,
      header: {
        token: this.data.token,
      },
      success: res => {
        console.log(res.data);
        if (res.data.code === '000') {
          const result = res.data.datas;
          if (result.signStatus === 0) {
            result.signStatusText = '已结束';
            result.signStatusClass = 'gray';
          } else if (result.signStatus === -2) {
            result.signStatusText = '已约满';
            result.signStatusClass = 'gray';
          } else if (result.signStatus === -3) {
            result.signStatusText = '购买课时';
            result.signStatusClass = 'light';
          } else if (result.signStatus === -1) {
            result.signStatusText = '已预约';
            result.signStatusClass = 'gray';
          } else if (result.signStatus === 1) {
            result.signStatusText = '立即预约';
            result.signStatusClass = 'light';
          }
          result.time = new Date(result.beginTime).Format('yyyy年MM月dd日 hh:mm')
          result.richTextArray = JSON.parse(result.descJson) || [];
          this.setData({
            course: result,
          });
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  /**
   * 导航到场馆
   * @return {[type]} [description]
   */
  navToGym() {
    const id = this.data.course.gymId;
    wx.navigateTo({
      url: '/pages/gym/gym?id='+id,
    });
  },
  /**
   * 底部按钮事件
   * @return {[type]} [description]
   */
  bottomBtnAction() {
    const signStatus = this.data.course.signStatus;
    const that = this;
    if (signStatus === 0) {
    } else if (signStatus === -2) {
    } else if (signStatus === -3) {
      // 购买课时
      wx.navigateTo({
        url: '/pages/shop/shop',
      });
    } else if (signStatus === -1) {
      // 已预约，点击取消预约
      wx.showModal({
        title: '您以成功预约',
        content: '课程开始前2小时内不可取消',
        showCancel: true,
        cancelText: '好的',
        cancelColor: '#98c379',
        confirmText: '取消报名',
        confirmColor: '#000',
        success: (res) => {
          if (res.confirm) {
            const courseId = this.data.course.id;
            wx.showLoading();
            wx.request({
              url: 'https://ssl.newbeestudio.com/api/course/cancelSignup?courseId='+courseId,
              header: {
                token: this.data.token,
              },
              success: (res) => {
                wx.hideLoading();
                if (res.data.code === '000') {
                  wx.showToast({
                    title: '取消成功',
                    icon: 'success',
                    duration: 2000
                  });
                  that.getCourse(this.data.course.id);
                } else {
                  wx.showToast({
                    title: res.data.message,
                    duration: 2000
                  });
                }
              }
            });
          }
        }
      });
    } else if (signStatus === 1) {
      // 立即预约
      const courseId = this.data.course.id;
      wx.showLoading();
      wx.request({
        url: 'https://ssl.newbeestudio.com/api/course/signup?courseId='+courseId,
        header: {
          token: this.data.token,
        },
        success: (res) => {
          wx.hideLoading();
          if (res.data.code === '000') {
            wx.showToast({
              title: '预约成功',
              icon: 'success',
              duration: 500
            });
            that.getCourse(this.data.course.id);
          } else if (res.data.code === '023') {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 500,
            });
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/userInfo/userInfo',
              });
            }, 500);
          }else {
            wx.showToast({
              title: res.data.message,
              icon: 'failure',
              duration: 500
            });
          }
        }
      });
    }
  },
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
});
