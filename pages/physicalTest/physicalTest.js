const app = getApp()

Page({
  data: {
    param1: '',
    param2: '',
    param3: '',
    param4: '',
    param5: '',
    param6: '',
    avator: '',
    isFetching: false,
    error: '',
  },
  onLoad: function (e) {
    const courseId = e.courseId
    const userId = e.userId
    this.setData({
      courseId,
      userId,
    })
  },
  inputChangeAction(e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    this.setData({
      [name]: value,
    });
  },
  // 提交信息前check
  checkInfo() {
    const {
      param1,
      param2,
      param3,
      param4,
      param5,
      param6,
      avator,
    } = this.data;
    if (param1 && param2 && param3 && param4 && param5 && param6 && avator) { // 基本信息必填
      const descJson = JSON.stringify({
        param1,
        param2,
        param3,
        param4,
        param5,
        param6,
        avator,
      });
      wx.showModal({
        title: '提交体能测试数据',
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
        title: '请完善体能测试数据',
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
      url: 'https://ssl.newbeestudio.com/api/course/addPhyTest', //仅为示例，并非真实的接口地址
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
