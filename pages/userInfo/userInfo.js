const app = getApp()

Page({
  data: {
    genderArray: [
      '男',
      '女',
    ],
    genderSelect: -1,
    birthday: '',
  },
  onLoad: function () {
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
