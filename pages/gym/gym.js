Page({
  data: {
    token: '',
    gym: {
    },
    courseList:[],
    id: '',
  },
  onLoad(options) {
    if (!this.data.token) {
      this.setData({
        token: wx.getStorageSync('token'),
        id: options.id,
      });
    }
    const id = options.id;
    this.getCoachInfo(id);
  },
  // 分享好友或群聊
onShareAppMessage: function () {
  const self = this;
  return {
    title: `乐傲运动·${self.data.gym.name}`,
    path: `/pages/gym/gym?id=${self.data.id}`,
    success: function(res) {
      // 转发成功
      wx.showToast({
        title: '转发成功',
        duration: 2000
      });
    },
    fail: function(res) {
      // 转发失败
      wx.showToast({
        title: '转发失败',
        duration: 2000
      });
    }
  }
},
  getCoachInfo(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/gym/info',
      data: {
        gymId: id,
      },
      header: {
        token: this.data.token,
      },
      success: (res) => {
        const that = this;
        if (res.data.code === '000') {
          let courseList = res.data.datas.courseList;
          courseList = courseList.map(course => {
            let beginTime = course.beginTime && course.beginTime.replace(new RegExp('-', 'g'), '/');
            beginTime = new Date(beginTime);
            const min = beginTime.getMinutes() || '00';
            const hour = beginTime.getHours() >= 10 ? beginTime.getHours() : '0'+beginTime.getHours();
            const month = beginTime.getMonth() + 1;
            const day = beginTime.getDate();
            return ({
              ...course,
              time: `${hour}:${min}`,
              date: `${month}月${day}日`,
            });
          });
          let gym = res.data.datas.gym;
          gym.imgs = gym.imgs && gym.imgs.split(',');
          that.setData({
            gym: gym,
            courseList: courseList,
          });
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
  navToGymMap() {
    const {
      name,
      long,
      lat,
    } = this.data.gym;
    wx.navigateTo({
      url: `/pages/gymMap/gymMap?name=${name}&long=${long}&lat=${lat}&id=${this.data.id}`,
    });
  },
  navToCourse: (e) => {
    console.log(e);
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/course/course?id='+id,
    });
  },
})
