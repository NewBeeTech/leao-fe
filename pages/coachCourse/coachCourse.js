const app = getApp();
Page({
  data: {
    course: {},
    token: '',
    female: '../../assets/female.svg',
    male: '../../assets/male.svg',
    id: '',
    userId: ''
  },
  onLoad(options) {
    const id = options.id
    const userId = options.userId
    this.setData({
      id,
      userId,
    });
    if (!this.data.token) {
      this.setData({
        token: wx.getStorageSync('token'),
      });
    }
    this.getCourse();
  },
  /**
   * 获取课程信息
   * @param  {[type]} id 课程id
   * @return {[type]}    [description]
   */
  getCourse() {
    const id = this.data.id
    const userId = this.data.userId
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/info?courseId='+id+'&userId='+userId,
      header: {
        token: this.data.token,
      },
      success: res => {
        console.log(res.data);
        if (res.data.code === '000') {
          const result = res.data.datas;
          result.time = new Date(result.beginTime).Format('yyyy年MM月dd日 hh:mm')+'/'+new Date(result.endTime).Format('hh:mm')
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
   * 跳转
   * @return {[type]} [description]
   */
   navToPhyTest(e) {
     const userId = e.currentTarget.dataset.userId
     wx.navigateTo({
       url: `/pages/physicalTest/physicalTest?userId=${userId}&courseId=${this.data.id}`
     });
   },
   navToFeedBack(e) {
     const item = e.currentTarget.dataset.item
     const {
       id,
       count,
       age,
       gender,
       nickName,
       realName,
     } = item
     wx.navigateTo({
       url: `/pages/feedBack/feedBack?userId=${id}&courseId=${this.data.id}&age=${age}&count=${count}&gender=${gender}&name=${realName||nickName}`
     });
   },
   navToHistory(e) {
     const userId = e.currentTarget.dataset.userid
     wx.navigateTo({
       url: `/pages/history/history?userId=${userId}`
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
