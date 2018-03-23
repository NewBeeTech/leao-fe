const app = getApp();
Page({
  onLoad(options) {
    const id = options.id
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/coach/info?typeId='+id,
      success: res => {
        console.log(res.data);
      },
    });
  },
});
