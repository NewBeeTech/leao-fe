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
      userId,
      userInfo: app.globalData.userInfo
    });
    this.getShareListAction(1);
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
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/moneyRecord', //仅为示例，并非真实的接口地址
      data: {
        userId:that.data.userId,
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
          const type = that.data.userInfo.type;
          console.log(type, type === 2);
          result.map(item => {
            item.timeStr = formatTime(item.time, 'Y.M.D')
            item.hour = type === 2 ? item.object.shareCoachMoney / 100 : item.object.shareUserMoney / 100
          });
          let count = 0;
          console.log(result);
          if(result.length) {
            result.reduce((accumulator, currentValue, currentIndex, array) => {
              console.log(accumulator, currentValue);
              count = accumulator.hour || 0 + currentValue.hour || 0;
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '乐傲运动',
      path: `/pages/index/index?userId=${this.data.userId}`,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
});
