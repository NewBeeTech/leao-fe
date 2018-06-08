const app = getApp()
import { formatTime } from '../../libs/moment'

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
    userInfo: {},
    history: []
  },
  onLoad: function (e) {
    const genderObj = {'1': '男', '2': '女'}
    this.setData({
      userId: e.userId,
      userInfo: app.globalData.userInfo,
      'userInfo.sex': genderObj[String(app.globalData.userInfo.gender)]
    })

    this.getfeedbackList()
  },
  // 请求历史记录
  getfeedbackList() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/feedBackList',
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
          const result = res.data.datas
          result.map((item) => {
            item.timeStr = formatTime(item.createTime, 'Y-M-D');
            item.jsonObj = JSON.parse(item.descJson);
          })
          that.setData({
            history: result,
          })
          wx.hideLoading();
        }
      }
    });
  },
  previewImg(e) {
    const index = e.currentTarget.dataset.index;
    const cindex = e.currentTarget.dataset.cindex;
    const urls = this.data.history[index].jsonObj.imgList;
    wx.previewImage({
      current: urls[cindex], // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  }
});
