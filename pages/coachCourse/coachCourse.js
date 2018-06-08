const app = getApp();
import { formatTime } from '../../libs/moment'

Page({
  data: {
    course: {},
    token: '',
    female: '../../assets/female.svg',
    male: '../../assets/male.svg',
    id: '',
    userId: '',
    arrivedObj: {}
  },
  onLoad(options) {
    // arrivedStorage: [{
    //   courseId: 1,
    //   arrivedList: [1, 2, 3]
    // }]
    const id = options.id
    const userId = options.userId
    const arrivedStorage = wx.getStorageSync('arrivedStorage') || [{
      courseId: id,
      arrivedList: [],
    }]
    const filterArr = arrivedStorage.filter(item => item.courseId == id)
    const arrivedObj = {
      courseId: id,
      arrivedList: filterArr.length ? filterArr[0]['arrivedList'] : [],
    }
    this.setData({
      id,
      userId,
      arrivedObj,
    });
    if (!this.data.token) {
      this.setData({
        token: wx.getStorageSync('token'),
      });
    }
  },
  onShow() {
    this.getCourse();
  },
  prevImg(e) {
    const imgURL = e.currentTarget.dataset.url;
    if (imgURL) {
      wx.previewImage({
        current: imgURL, // 当前显示图片的http链接
        urls: [imgURL],
      });
    }
  },
  switchChange(e) {
    const index = e.currentTarget.dataset.index
    const list = this.data.course.list
    const key = 'course.list[' + index + ']isArrived'
    this.setData({
      [key]: e.detail.value
    })
    const arrivedList = list.filter(item => item.isArrived).map(item => item.id)
    const arrivedStorage = (wx.getStorageSync('arrivedStorage') || [{courseId: this.data.id,arrivedList: []}]).map(item => {
      if(item.courseId == this.data.id) {
        item.arrivedList = arrivedList
      }
      return item;
    })
    wx.setStorageSync('arrivedStorage', arrivedStorage)
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
          result.time = formatTime(result.beginTime, 'Y年M月D日 h:m')
          result.richTextArray = JSON.parse(result.descJson) || [];
          result.list.map(item => {
            console.log(this.data.arrivedObj.arrivedList, this.data.arrivedObj.arrivedList.indexOf(item.id), item.id);
            if (this.data.arrivedObj.arrivedList.indexOf(item.id) > -1) {
              item.isArrived = true
            } else {
              item.isArrived = false
            }
          })
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
     const userId = e.currentTarget.dataset.userid;
     if (userId) {
       wx.navigateTo({
         url: `/pages/physicalTest/physicalTest?userId=${userId}&courseId=${this.data.id}`
       });
     }

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
       title: `乐傲运动·${self.data.course.courseType}`,
       path: '/pages/index/index',
       success: function(res) {
         // 转发成功
       },
       fail: function(res) {
         // 转发失败
       }
     }
   }
});
