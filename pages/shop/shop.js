const app = getApp()

Page({
  data: {
    items: [{
      name: '1',
      value: 1,
      price: 1,
    }, {
      name: '2',
      value: 2,
      price: 2,
    }]
  },
  onLoad: function () {
  },
  radioChange(e) {
    console.log(e);
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
});
