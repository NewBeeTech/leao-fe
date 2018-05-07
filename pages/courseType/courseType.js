const app = getApp();
Page({
  data: {
    courseType: [],
    courseList: [],
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const id = options.id
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/courseType/info?typeId='+id,
      success: res => {

        console.log(res.data);
        let courseList = res.data.datas.courseList;
        courseList = courseList.map(course => {
          let beginTime = course.beginTime && course.beginTime.replace(new RegExp('-', 'g'), '/');
          beginTime = new Date(beginTime);
          const min = beginTime.getMinutes() || '00';
          const hour = beginTime.getHours() >= 10 ? beginTime.getHours() : '0'+beginTime.getHours();
          const month = beginTime.getMonth() + 1;
          const day = beginTime.getDate();
          return ({
            ...course,
            time: `${hour}:${min}`,
            date: `${month}月${day}日`,
          });
        });
        const courseType = res.data.datas.courseType;
        courseType.richTextArray = JSON.parse(courseType.descJson) || [];
        this.setData({
          courseType: res.data.datas.courseType,
          courseList: courseList,
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
  navToCourse: (e) => {
    console.log(e);
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/course/course?id='+id,
    });
  },
});
