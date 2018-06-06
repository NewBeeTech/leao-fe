Page({
  data: {
    id: '',
    lat: '',
    long: '',
    name: '',
    markers: [],
  },
  onLoad(options) {
    const lat = options.lat;
    const long = options.long;
    const name = options.name;
    const id = options.id;
    console.log(lat,long,name,id);
    this.setData({
      lat,
      long,
      name,
      id,
      markers: [{
        id: 0,
        latitude: lat,
        longitude: long,
        title: name,
        callout: {
          content: name,
          color: '#353535',
          fontSize: '18rpx',
          padding: 4,
          borderRadius: 10,
          textAlign: 'center',
          bgColor: '#ffd225',
          display: 'ALWAYS',
        }
      }],
    });
  },
  // 分享好友或群聊
onShareAppMessage: function () {
  const self = this;
  return {
    title: `乐傲运动·${self.data.name}`,
    // path: `/pages/gymMap/gymMap?lat=${self.data.lat}&long=${self.data.long}&name=${self.data.name}`,
    path: `/pages/gym/gym?id=${self.data.id}`,
    success: function(res) {
      // 转发成功
      wx.showToast({
        title: '转发成功',
        duration: 2000
      });
    },
    fail: function(res) {
      // 转发失败
      wx.showToast({
        title: '转发失败',
        duration: 2000
      });
    }
  }
},
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
});
