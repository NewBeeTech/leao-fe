const app = getApp()

Page({
  data: {
    isFetching: false,
    goods: [{
      hour: 1,
      price: 1,
    }, {
      hour: 10,
      price: 2700,
    }, {
      hour: 25,
      price: 6000,
    }, {
      hour: 50,
      price: 2700,
    }],
    select: 0,
  },
  onLoad: function () {
  },
  radioChange(e) {
    this.setData({
      select: e.detail.value,
    })
  },
  pay() {
    this.setData({
      isFetching: true,
    });
    const price = this.data.goods[this.data.select].price;
    const hour = this.data.goods[this.data.select].hour;
    let token = app.globalData.token || wx.getStorageSync('token');
    console.log(price);
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/wx/pay',
      header: {
        token,
      },
      data: {
        total_fee: price,
        body: `${hour}课时`
      },
      success: (res) => {
        this.setData({
          isFetching: false,
        });
        wx.requestPayment({
          timeStamp: res.data.datas.timeStamp,
          nonceStr: res.data.datas.nonce_str,
          paySign: res.data.datas.paySign,
          package: res.data.datas.prepay_id,
          signType: res.data.datas.signType,
          success: () => {
            console.log('支付成功');
            wx.navigateBack();
          },
          failure: (res) => {
            console.log('支付失败: ', res);
          }
        })
      }
    });
  }
});
