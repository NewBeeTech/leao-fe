const app = getApp()

Page({
  data: {
    clearIcon: '../../assets/clear.svg',
    age: '',
    userId: '',
    courseId: '',
    count: '',
    name: '',
    gender: '',
    content: '',
    isFetching: false,
    error: '',
    imgList: []
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
  },
  inputChangeAction(e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    this.setData({
      [name]: value,
    });
  },
  // 保存用户信息
  checkInfo() {
    const {
      content,
      imgList
    } = this.data;
    if (content) { // 基本信息必填
      const descJson = JSON.stringify({
        content,
        imgList
      });
      wx.showModal({
        title: '提交训练返回',
        content: '确认您已完成所有信息的录入',
        cancelText: '取消',
        confirmText: '提交',
        success: function(res) {
          if (res.confirm) {
            this.saveUserInfoAction(descJson)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showToast({
        title: '请填写反馈内容',
        icon: 'none',
        duration: 2000
      })
    }
  },
  saveUserInfoAction(descJson) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/addFeedBack',
      data: {
        courseId:that.data.courseId,
        userId:that.data.userId,
        descJson
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': token,
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == '000') { // 之前使用过运用
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1000);
        }
      }
    });
  },
  choosePic() {
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            'user': 'test'
          },
          success: function(res){
            var data = res.data
            //do something
          }
        })
      }
    })
  },
  remove(e) {
    const index = e.currentTarget.dataset.index
    const list = this.data.imgList
    list.splice(index, 1)
    this.setData({
      imgList: list
    })
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
