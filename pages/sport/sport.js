const app = getApp()
import { formatTime } from '../../libs/moment'
import { getStandard } from '../../libs/standard'

var numCount = 5;
var numSlot = 4;
var mW = 290;
var mH = 300;
var mCenter = mW / 2; //中心点
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenter -20; //半径(减去的值用于给绘制的文本留空间)
//获取Canvas
var radCtx = wx.createCanvasContext("radarCanvas")

Page({
  data: {
    female: '../../assets/female.svg',
    male: '../../assets/male.svg',
    testInfo: [],
    userInfo: {},
    isFetching: false,
    error: '',
    stepText:4,
    chanelArray:[["柔韧",0],["力量耐力",0],["爆发力",0],["速度",0],["稳定",0]],
    colorArr: ['rgba(0,204,0,0.2)', 'rgba(102,0,0,0.2)', 'rgba(0,255,153,0.2)', 'rgba(204,255,102.2)', 'rgba(204,153,204,0.2)', 'rgba(153,0,0,0.2)', 'rgba(102,102,153,0.2)', 'rgba(102,153,153,0.2)', 'rgba(153,51,204,0.2)'],
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //雷达图
    this.drawRadar()
  },
  onLoad: function (e) {
    const userId = e.userId
    this.setData({
      userId,
      userInfo: app.globalData.userInfo
    });
    this.getUserTextInfoAction();
  },
  inputChangeAction(e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    this.setData({
      [name]: value,
    });
  },
  // 获取
  getUserTextInfoAction(descJson) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const that = this;
    let token = app.globalData.token || wx.getStorageSync('token');
    wx.request({
      url: 'https://ssl.newbeestudio.com/api/course/phyInfo', //仅为示例，并非真实的接口地址
      data: {
        userId:that.data.userId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': token,
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == '000') { // 之前使用过运用
          const result = res.data.datas || [];
          result && result.map((item, index) => {
            item.jsonObj = JSON.parse(item.descJson);
            item.time = formatTime(item.updateTime, 'Y-M-D');
            let age = item.age
            if (item.age > 18) {
              age = 18
            }
            if (item.age <3) {
              age = 3
            }
            let standard1 = getStandard(age)[item.gender - 1].param1
            let standard2 = getStandard(age)[item.gender - 1].param2
            let standard3 = getStandard(age)[item.gender - 1].param3
            let standard4 = getStandard(age)[item.gender - 1].param4
            let standard5 = getStandard(age)[item.gender - 1].param5
            if (item.age >=3 && item.age <= 5) {
              standard4 = Number(item.jsonObj.param4) * 0.8
            }
            const param1 = Math.floor((Math.atan((Number(item.jsonObj.param1) - standard1))/(2 * Math.PI) + 0.5) * 100);
            const param2 = Math.floor((Math.atan((Number(item.jsonObj.param2) - standard2))/(2 * Math.PI) + 0.5) * 100);
            const param3 = Math.floor((Math.atan((Number(item.jsonObj.param3) - standard3))/(2 * Math.PI) + 0.5) * 100);
            const param4 = Math.floor((Math.atan((Number(item.jsonObj.param4) - standard4))/(2 * Math.PI) + 0.5) * 100);
            const param5 = Math.floor((Math.atan((Number(item.jsonObj.param5) - standard5))/(2 * Math.PI) + 0.5) * 100);
            item.radarData = [["柔韧",param5],["力量耐力",param4],["爆发力",param1],["速度",param2],["稳定",param3]]
            if(index == 0) {
              item.isSelected = true
            } else {
              item.isSelected = false
            }
            return item
          })
          that.setData({
            testInfo: result
          })
          this.drawRadar()
          wx.hideLoading();
        }
      }
    });
  },
  select(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const item = e.currentTarget.dataset.item;
    const testInfo = this.data.testInfo;
    testInfo[index]['isSelected'] = !testInfo[index]['isSelected'];
    this.setData({
      testInfo
    })
    this.drawRadar()
  },
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
  drawRadar: function() {
    var sourceData = this.data.chanelArray
    var testInfo = this.data.testInfo
    //调用
    this.drawEdge() //画五边形

    this.drawLinePoint()
    //设置数据
    testInfo.forEach((item, index) => {
      if (item.isSelected) {
        this.drawRegion(item.radarData, this.data.colorArr[index % 9])
        //设置节点
        this.drawCircle(item.radarData, this.data.colorArr[index % 9])
      }
    })
    //设置文本数据
    this.drawTextCans(sourceData)
    //开始绘制
    radCtx.draw()
  },
  // 绘制5条边
  drawEdge: function() {
    radCtx.setStrokeStyle("grey")
    radCtx.setLineWidth(1)  //设置线宽
    for (var i = 0; i < numSlot; i++) {
      //计算半径
      radCtx.beginPath()
      var rdius = mRadius / numSlot * (i + 1)
      //画5条线段
      for (var j = 0; j < numCount; j++) {
        //坐标
        var x = mCenter + rdius * Math.cos(mAngle * j);
        var y = mCenter + rdius * Math.sin(mAngle * j);
        radCtx.lineTo(x, y);
      }
      radCtx.closePath()
      radCtx.stroke()
    }
  },
  // 绘制连接点
  drawLinePoint: function() {
    radCtx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.cos(mAngle * k);
      var y = mCenter + mRadius * Math.sin(mAngle * k);

      radCtx.moveTo(mCenter, mCenter);
      radCtx.lineTo(x, y);
    }
    radCtx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function(mData,color) {
    radCtx.beginPath();
    for (var m = 0; m < numCount; m++){
    var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
    var y = mCenter + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;
    radCtx.lineTo(x, y);
    }
    radCtx.closePath();
    radCtx.setFillStyle(color)
    radCtx.fill();
  },

  //绘制文字
  drawTextCans: function(mData) {
    radCtx.setFillStyle("black")
    // radCtx.font = 'bold 17px cursive'  //设置字体
    for (var n = 0; n < numCount; n++) {
      var x = mCenter + mRadius * Math.cos(mAngle * n);
      var y = mCenter + mRadius * Math.sin(mAngle * n);
      // radCtx.fillText(mData[n][0], x, y);
      //通过不同的位置，调整文本的显示位置
      if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n][0], x+5, y+5);
      } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-7, y+5);
      } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-5, y);
      } else {
        radCtx.fillText(mData[n][0], x+7, y+2);
      }
    }
  },
  //画点
  drawCircle: function(mData,color) {
   var r = 3; //设置节点小圆点的半径
   for(var i = 0; i<numCount; i ++){
      var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * i) * mData[i][1] / 100;

      radCtx.beginPath();
      radCtx.arc(x, y, r, 0, Math.PI * 2);
      radCtx.fillStyle = color;
      radCtx.fill();
    }
  }
});
