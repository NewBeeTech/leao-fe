const app = getApp()

Page({
  data: {
    age: '',
    gender: 0,
    genderArr:['请选择', '男', '女'],
    param1: '',
    param2: '',
    param3: '',
    param4: '',
    param5: '',
    avator: '',
    avatorUrl: '',
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
  bindPickerChange(e) {
    this.setData({ gender: e.detail.value })
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
    var that = this
    const {
      age,
      gender,
      param1,
      param2,
      param3,
      param4,
      param5,
      avatorUrl,
    } = that.data;
    if (age && gender && param1 && param2 && param3 && param4 && param5 && avatorUrl) { // 基本信息必填
      const descJson = JSON.stringify({
        param1,
        param2,
        param3,
        param4,
        param5,
        avator: avatorUrl,
      });
      wx.showModal({
        title: '提交体能测试数据',
        content: '确认您已完成所有信息的录入',
        cancelText: '取消',
        confirmText: '提交',
        success: function(res) {
          if (res.confirm) {
            that.saveUserInfoAction({ descJson, age, gender})
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
  saveUserInfoAction(data) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/addPhyTest', //仅为示例，并非真实的接口地址
      data: {
        courseId: that.data.courseId,
        userId: that.data.userId,
        age: data.age,
        gender: data.gender,
        descJson: data.descJson
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
  uploadFileToOSS:function (params){
    var that = this
    const localName = `${Math.random().toString(36).substr(7)}-phytest.png`;
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/oss/web/sign', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        // 'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data);
        if(res.data.code == "000") {
          const signature = res.data.datas;
          wx.uploadFile({
            url: 'https://ssl.newbeestudio.com',
            filePath: params.tempFilePath,
            name: 'file',
            formData:{
              name: localName,
              key: `${signature.dir}${localName}`,
              policy: signature.policy,
              OSSAccessKeyId: signature.accessid,
              success_action_status: '200',
              signature: signature.signature,
            },
            success: function(res){
              console.log(res);
              if(res.statusCode == '200') {
                that.setData({
                  avatorUrl: `https://ssl.newbeestudio.com/${signature.dir}${localName}`,
                  avator: params.tempFilePath,
                })
              } else {
                wx.showToast({
                  title: '上传失败',
                  // image: '/images/fail.png'
                })
              }
            },
            fail: function(res){
              console.log('fail', res);
            }
          })
        } else {
          wx.showToast({
            title: '上传失败',
          })
        }
      }
    })
  },
  choosePic() {
    var that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        that.uploadFileToOSS({
          tempFilePath: tempFilePaths[0],
        });
      }
    })
  }
});
