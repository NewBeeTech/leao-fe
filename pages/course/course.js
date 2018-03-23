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
          this.setData({
            course: result,
          });
        }
      },
    });
  }
});
