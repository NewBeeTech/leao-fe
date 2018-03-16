const app = getApp()

Page({
  data: {
  },
  onLoad: function () {
  },
  routeTo(e) {
    wx.reLaunch({
      url: e.currentTarget.dataset.url,
    });
  }
});
