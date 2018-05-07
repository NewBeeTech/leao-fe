Page({
  data: {
    myCourse: [],
    token: '',
  },
  onLoad() {
    // 设置token
    if (!this.data.token) {
      this.setData({
        token: wx.getStorageSync('token'),
      });
    }
    this.getMyCourse();
  },
  getMyCourse() {
    const that = this;
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/courseList_yiyuyue',
      header: {
        token: that.data.token,
      },
      success: (res) => {
        console.log(res);
        if (res.data.code === '000') {
          let result = res.data.datas;
          result = result.map(item => {
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
            myCourse: result,
          });
        }
      }
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
  changeTab: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
});
