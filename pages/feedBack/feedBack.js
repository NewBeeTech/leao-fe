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
    imgList: [],
    imgUrlList: []
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
    var that = this
    const {
      content,
      imgUrlList
    } = that.data;
    if (content) { // 基本信息必填
      const descJson = JSON.stringify({
        content,
        imgList: imgUrlList
      });
      wx.showModal({
        title: '提交训练返回',
        content: '确认您已完成所有信息的录入',
        cancelText: '取消',
        confirmText: '提交',
        success: function(res) {
          if (res.confirm) {
            that.saveUserInfoAction(descJson)
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
  uploadFileToOSS:function (params){
    console.log(params);
    const tempFilePaths = params.tempFilePaths
    var that = this
    tempFilePaths.map((item, index) => {
      const localName = `${Math.random().toString(36).substr(7)}-phytest.png`;
      wx.request({
        url: 'https://ssl.newbeestudio.com/api/oss/web/sign', //仅为示例，并非真实的接口地址
        success: function(res) {
          console.log(res.data);
          if(res.data.code == "000") {
            const signature = res.data.datas;
            wx.uploadFile({
              url: signature.host,
              filePath: item,
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
                if(res.statusCode == '200') {
                  var imgIndex = "imgList[" + index + "]";
                  var imgUrlIndex = "imgUrlList[" + index + "]";
                  that.setData({
                    [imgUrlIndex]: `https://ssl.newbeestudio.com/${signature.dir}${localName}`,
                    [imgIndex]: item,
                  })
                // } else {
                //   wx.showToast({
                //     title: '上传失败',
                //   })
                }
              },
              fail: function(res){
                console.log('fail', res);
              }
            })
          // } else {
          //   wx.showToast({
          //     title: '上传失败',
          //   })
          }
        }
      })
    })
    // const localName = `${Math.random().toString(36).substr(7)}-phytest.png`;
    // wx.request({
    //   url: 'https://ssl.newbeestudio.com/api/oss/web/sign', //仅为示例，并非真实的接口地址
    //   success: function(res) {
    //     console.log(res.data);
    //     if(res.data.code == "000") {
    //       const signature = res.data.datas;
    //       wx.uploadFile({
    //         url: signature.host,
    //         filePath: params.tempFilePath,
    //         name: 'file',
    //         formData:{
    //           name: localName,
    //           key: `${signature.dir}${localName}`,
    //           policy: signature.policy,
    //           OSSAccessKeyId: signature.accessid,
    //           success_action_status: '200',
    //           signature: signature.signature,
    //         },
    //         success: function(res){
    //           console.log(res);
    //           if(res.statusCode == '200') {
    //             that.setData({
    //               avatorUrl: `${signature.host}/${signature.dir}${localName}`,
    //               avator: params.tempFilePath,
    //             })
    //           } else {
    //             wx.showToast({
    //               title: '上传失败',
    //             })
    //           }
    //         },
    //         fail: function(res){
    //           console.log('fail', res);
    //         }
    //       })
    //     } else {
    //       wx.showToast({
    //         title: '上传失败',
    //       })
    //     }
    //   }
    // })
  },
  choosePic() {
    var that = this
    wx.chooseImage({
      count: 9,
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        that.uploadFileToOSS({
          tempFilePaths,
        });
      }
    })
  },
  remove(e) {
    const index = e.currentTarget.dataset.index
    const list = this.data.imgList
    const urlList = this.data.imgUrlList
    list.splice(index, 1)
    urlList.splice(index, 1)
    this.setData({
      imgList: list,
      imgUrlList: urlList
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '乐傲运动',
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
