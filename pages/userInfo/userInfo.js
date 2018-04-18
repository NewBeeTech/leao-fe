const app = getApp()

Page({
  data: {
    genderArray: [
      '未选择',
      '男',
      '女',
    ],
    nickName: '',
    gender: -1,
    birthday: '',
    realName: '',
    school: '',
    workUnit: '',
    address: '',
    isFetching: false,
    error: '',
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/user/userinfo',
      header: {
        token,
      },
      success: (res) => {
        if (res.data.code === '000') {
          const user = res.data.datas.user || {};
          wx.hideLoading();
          this.setData({
            ...user,
          });
        }
      }
    });
  },
  inputChangeAction(e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    this.setData({
      [name]: value,
    });
  },
  changeGender(e) {
    console.log(e);
    this.setData({
      genderSelect: e.detail.value,
    });
  },
  changeBirthday(e) {
    this.setData({
      birthday: e.detail.value,
    });
  },
  // 保存用户信息
  saveUserInfoAction() {
    const {
      nickName,
      gender,
      birthday,
      realName,
      school,
      workUnit,
      address,
    } = this.data;
    if (nickName && gender && birthday) { // 基本信息必填
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      const that = this;
      let token = app.globalData.token || wx.getStorageSync('token');
      wx.request({
        url: 'https://ssl.newbeestudio.com/api/user/edit', //仅为示例，并非真实的接口地址
        data: {
          // ...that.data,
          nickName: nickName || '',
          gender: gender || '',
          birthday: birthday || '',
          realName: realName || '',
          school: school || '',
          workUnit: workUnit || '',
          address: address || '',
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'token': token,
        },
        method: 'POST',
        success: (res) => {
          if (res.data.code == '000') { // 之前使用过运用
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            });
            app.globalData.userInfo.nickName = nickName;
            // console.warn(app.globalData);
            setTimeout(function () {
              wx.navigateBack();
            }, 1000);
          }
        }
      });
    } else {
      wx.showToast({
        title: '请完善基本信息',
        icon: 'none',
        duration: 2000
      })
    }

  }
});
