const app = getApp()

Page({
  data: {
    addressIcon: '../../assets/address.svg',
    calenderIcon: '../../assets/calender.svg',
    feedbackIcon: '../../assets/feedback.svg',
    userIcon: '../../assets/user.svg',
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
    this.setData({
      userId: e.userId,
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
          const genderObj = {'1': '男', '2': '女'}
          const result = res.data.datas
          result.list.map((item) => {
            item.timeStr = new Date(item.time).Format('yyyy-MM-dd');
            if(item.type === 3 || item.type === 2) {
              item.object.jsonObj = JSON.parse(item.object.descJson);
            }
          })
          that.setData({
            history: result.list,
            userInfo: result.user,
            'userInfo.sex': genderObj[String(result.user.gender)]
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
