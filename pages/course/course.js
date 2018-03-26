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
          console.log(result.descJson);
          console.log(JSON.parse(result.descJson));
          this.setData({
            course: result,
          });
        }
      },
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
              duration: 2000
            });
            that.getCourse(this.data.course.id);
          } else {
            wx.showToast({
              title: '请稍后再试',
              icon: 'success',
              duration: 2000
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
