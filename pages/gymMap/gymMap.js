Page({
  data: {
    lat: '',
    long: '',
    name: '',
    markers: [],
  },
  onLoad(options) {
    const lat = options.lat;
    const long = options.long;
    const name = options.name;
    console.log(lat,long,name);
    this.setData({
      lat,
      long,
      name,
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
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
});
