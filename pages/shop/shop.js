const app = getApp()

Page({
  data: {
    isFetching: false,
    newUser: false,
    goods: [{
      type: 'one',
      hour: 1,
      price: 29800,
      text: '298.00',
    }, {
      type: 'ten',
      hour: 20,
      price: 516000,
      discount: '258/单次',
      text: '5,160.00',
    }, {
      type: 'twentyFive',
      hour: 40,
      price: 912000,
      discount: '228/单次',
      text: '9,120.00',
    }, {
      type: 'fifty',
      hour: 80,
      price: 1584000,
      discount: '198/单次',
      text: '15,840.00',
    }],
    select: 0,
    token: '',
  },
  onLoad: function () {
    // 设置token
    if (!this.data.token) {
      this.setData({
        token: wx.getStorageSync('token'),
      });
    }
    this.getGoodsList();
  },
  getGoodsList() {
    wx.showLoading();
    const token = this.data.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/goods/list',
      header: {
        token,
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === '000') {
          console.log(Object.keys(res.data.datas).map(key => ({ [key]: res.data.datas[key]})));
          this.setData({
            newUser: !!res.data.datas.newUser,
          });
        }
      }
    });
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
    const newUser = this.data.newUser;
    let price = this.data.goods[this.data.select].price;
    let type = this.data.goods[this.data.select].type;
    if (newUser && this.data.select === 0) {
      price = 1990;
      type = 'newUser';
    }
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
        body: `${hour}课时`,
        type,
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
