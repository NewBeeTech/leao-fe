const app = getApp();

Page({
  date: {
    token: '',
    records: [],
  },
  onLoad() {
    // 设置token
    if (!this.data.token) {
      this.setData({
        token: wx.getStorageSync('token'),
      });
    }
    this.getPayRecord();
  },
  renderDate(date) {
    let time = date && date.replace(new RegExp('-', 'g'), '/');
    const dateObj = new Date(time);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();
    return `${month}月${day}日 ${hour}:${min}`;
  },
  getPayRecord() {
    const that = this;
    wx.showLoading()
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/payRecord/my',
      header: {
        token: this.data.token,
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === '000') {
          let result = res.data.datas;
          result = result && result.map(item => ({ ...item, createTime: that.renderDate(item.createTime)}));
          console.log(result);
          this.setData({
            records: result,
          });
        }
      }
    });
  }
})
