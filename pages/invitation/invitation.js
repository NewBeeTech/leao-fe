const app = getApp()
import { formatTime } from '../../libs/moment'

Page({
  data: {
    shareList: [],
    userInfo: {},
    isFetching: false,
    error: '',
    amount: '',
    selectedBar: 1,
    showModal: false
  },
  onLoad: function (e) {
    const userId = e.userId
    this.setData({
      userId
    });
    this.getToken(
      (token) => {
        // 获取用户信息
        this.getUserInfo();
      }
    );
  },
  getToken(successCallBack, failureCallBack) {
    let token = this.data.token || wx.getStorageSync('token');
    if(token) {
      this.setData({
        token,
      });
      successCallBack && successCallBack(token);
      return;
    }
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'https://ssl.newbeestudio.com/api/wx/login', //仅为示例，并非真实的接口地址
            data: {
              jsCode: res.code,
            },
            success: (res) => {
              if (res.data.code == '000' || res.data.code == '014') { // 获取token成功
                wx.setStorageSync('token', res.data.datas); // 持久化token
                this.setData({
                  token: res.data.datas,
                });
                successCallBack && successCallBack(res.data.datas); // 成功回调
              }
              if (res.data.code == '014') { // 之前没有使用过运用
                this.authSaveUserInfo(res.data.datas);
              }
            }
          });
        } else {
          failureCallBack && failureCallBack();
        }
      }
    });
  },
  authSaveUserInfo(token) {
    const that = this;
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
        if (res.errMsg === 'getSetting:ok') {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: respond => {
              // this.globalData.userInfo = res.userInfo;
              wx.request({
                url: 'https://ssl.newbeestudio.com/api/user/edit', //仅为示例，并非真实的接口地址
                data: {
                  nickName: respond.userInfo.nickName,
                  gender: respond.userInfo.gender,
                  portrait: respond.userInfo.avatarUrl,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded', // 默认值
                  'token': token,
                },
                method: 'POST',
                success: function(res) {
                  if (res.data.code == '000') { // 保存用户信息
                    that.setData({
                      userInfo: {
                        nickName: respond.userInfo.nickName,
                        gender: respond.userInfo.gender,
                        portrait: respond.userInfo.avatarUrl,
                      }
                    });
                  }
                }
              });
            },
            fail: res => {
              console.log(res);
            }
          });
        }
      }
    })
  },
  getUserInfo() {
    const that = this;
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/user/userinfo', //仅为示例，并非真实的接口地址
      header: {
        'token': this.data.token,
      },
      method: 'GET',
      success: function(res) {
        console.log('getUserInfo===>', res);
        if (res.data.code == '000') {
          if (res.data.datas.user) {
            that.setData({
              userInfo: res.data.datas.user || {},
            });
            app.globalData.userInfo = res.data.datas.user;
            that.getShareListAction(that.data.selectedBar);
          } else {
            that.authSaveUserInfo(that.data.token);
          }

        }
      }
    })
  },
  onShow () {
    // this.getShareListAction(this.data.selectedBar);
  },
  inputChangeAction(e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    this.setData({
      [name]: value,
    });
  },

  // 获取
  getShareListAction(type) {
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true,
    // });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    console.log(token);
    console.log(that.data.userId || (that.data.userInfo ? that.data.userInfo.id : ''));
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/moneyRecord', //仅为示例，并非真实的接口地址
      data: {
        userId:that.data.userId || (that.data.userInfo ? that.data.userInfo.id : ''),
        type
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': token,
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == '000') { // 之前使用过运用
          const result = res.data.datas;
          result.map(item => {
            item.timeStr = formatTime(item.time, 'Y.M.D')
            item.hour = item.type === 2 ? item.object.shareCoachMoney / 100 : item.object.shareUserMoney / 100
          });
          let count = 0;
          console.log('sharelist',result);
          if(result.length) {
            result.reduce((accumulator, currentValue, currentIndex, array) => {
              count += ((accumulator.hour || 0) + (currentValue.hour || 0));
              return count;
            });
          }
          that.setData({
            shareList: result,
            count,
          })
          wx.hideLoading();
        }
      }
    });
  },
  changeBar(e) {
    this.setData({
      selectedBar: Number(e.currentTarget.dataset.index)
    });
    this.getShareListAction(e.currentTarget.dataset.index)
  },
  // 跳转体现页面
  goReflect() {
    wx.navigateTo ({
      url: `/pages/reflect/reflect?userId=${userId}`
    })
  },
  /**
   * 显示模态对话框
   */
  showModal: function () {
    this.setData({
      showModal: true
    });
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },
  onShareAppMessage (res) {
    console.warn('userId', this.data.userId)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '乐傲运动·专业、有爱、有趣的青少年运动训练',
        path: `/pages/index/index?userId=${this.data.userId}`,
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '乐傲运动·专业、有爱、有趣的青少年运动训练',
      path: `/pages/invitation/invitation`,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
});
