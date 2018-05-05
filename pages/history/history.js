const app = getApp()

Page({
  data: {
    addressIcon: '../../assets/address.svg',
    calenderIcon: '../../assets/calender.svg',
    feedbackIcon: '../../assets/feedback.svg',
    age: '',
    userId: '',
    courseId: '',
    count: '',
    name: '',
    gender: '',
    content: '',
    isFetching: false,
    error: '',
    imgList: [
      '../../assets/address.svg',
      '../../assets/address.svg',
      '../../assets/address.svg',
      '../../assets/address.svg',
      '../../assets/address.svg',
      '../../assets/address.svg',
    ],
    history: []
  },
  onLoad: function (e) {
    const genderObj = {'1': '男', '2': '女'}
    this.setData({
      courseId: e.courseId,
      userId: e.userId,
      age: e.age,
      count: e.count,
      name: e.name,
      gender: genderObj[String(e.gender)]
    })
    this.getHistoryList()
  },
  // 请求历史记录
  getHistoryList() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/history',
      data: {
        userId:that.data.userId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': token,
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == '000') {
          that.setData({
            history: res.data.datas
          })
          wx.hideLoading();
        }
      }
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '乐傲运动',
      path: '/page/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
});
