const app = getApp();
import { formatTime } from '../../libs/moment'

Page({
  data: {
    richTextArray: [{
      type: 3,
      content: 'https://newbeestudio.oss-cn-beijing.aliyuncs.com/leao/leaotitle.png'
    }, {
      type: 2,
      content: '乐傲运动是一家由海外留学精英、互联网公司顶尖人才、及北京体育大学专业人士共同创立的互联网教育培训公司。乐傲运动致力于让中国的少年儿童在快乐中爱上运动！'
    }, {
      type:2,
      content: '我们面对的是3-18岁的少年儿童及家长群体。与市面上的体育培训机构不同的是，我们的培训是以体能训练为基石，专项训练为拓展，结合有趣又新颖的亲子课程，让您和您的孩子在运动中体会到酣畅淋漓的快乐！'
    }, {
      type: 1,
      content: '为什么体能训练非常非常重要?'
    }, {
      type: 2,
      content: '体能训练对于人的整体运动能力的提升极其重要。简单来说，英语对于在异国求学的人有多重要，体能对于参加运动训练的人就有多重要。英语不好，任何学科都很难学得通彻; 体能水平不过关，任何运动都无法精进。'
    }, {
      type: 2,
      content: '那么体能到底是什么呢?'
    }, {
      type: 2,
      content: '专业上来说，体能是通过力量、速度、耐力、协调、柔韧、灵敏等运动素质表现出来的人体基本的运动能力，是所有运动竞技能力的基石。'
    }, {
      type: 2,
      content: '按照美国MJP课程的分类，身体运动能力共分6大要素:速度(Speed)，策略(Strategy)，力量(Strength)，技能(Skill)，耐力(Stamina)，韧度(Suppleness)。'
    }, {
      type: 3,
      content: 'https://newbeestudio.oss-cn-beijing.aliyuncs.com/leao/fitchart.png'
    }, {
      type: 2,
      content: '而通俗来说，体能指的就是身体的综合运动能力。在青少年时期较早地进行体能训练可以保证运动能力的最优化、促进健康并减少运动损伤风险。'
    }, {
      type: 2,
      content: '一个人的身体运动能力越强，体能素质越好，就越愿意坚持运动，坚持一种健康积极的生活方式。体能训练，真的可以受益终生。'
    }, {
      type: 1,
      content: '为什么选择乐傲运动?'
    }, {
      type: 2,
      content: '给您更多样的选择'
    }, {
      type: 2,
      content: '乐傲运动为您提供的不仅仅是专业的课程与训练，更是一种舒心的选择方式。'
    }, {
      type: 2,
      content: '(1)自由：课程自由、时间自由、地点自由、教练自由'
    }, {
      type: 2,
      content: '(2)数据：生物数据、运动表现'
    }, {
      type: 2,
      content: '(3)科学：体能为基石、专项为拓展'
    }, {
      type: 2,
      content: '(4)反馈：课后文字反馈、视频图文分享'
    }, {
      type: 2,
      content: '(5)趣味：训练结合游戏、让运动更快乐'
    }, {
      type: 2,
      content: '(6)亲子：让运动更快乐，更专业，更有爱'
    }, {
      type: 2,
      content: '给您更贴心的服务'
    }, {
      type: 2,
      content: '在这里，我们为您和您的孩子提供全流程专业训练和课后服务！'
    }, {
      type: 2,
      content: '1.报名前：为您提供免费运动能力测试+专属课程方案'
    }, {
      type: 2,
      content: "2.课程前：小程序'乐傲运动'为您提供线上购课、约课服务"
    }, {
      type: 2,
      content :'3. 课程中：'
    }, {
      type: 2,
      content:'(1)为您把控运动风险，用科学的方法提高锻炼效果'
    }, {
      type: 2,
      content: '(2)为您提供专业的身体数据跟踪库，记录孩子成长中身体各方面的变化'
    }, {
      type: 2,
      content:'4. 课程后：'
    }, {
      type: 2,
      content: '(1)由我们的课程顾问和助教为您填写在线训练反馈+图文视频分享'
    }, {
      type: 2,
      content:'(2) "乐傲运动"公众号和小程序上为您定期推送健身锻炼知识+合理饮食搭配'
    }, {
      type: 1,
      content: '快快点击购课，获得我们的小狮子会员卡吧！一卡在手，选择多多！加入我们的小狮子联盟，给孩子新鲜尝试的机会，体验不同运动的魅力，发现自己的兴趣所在！'
    }],
    portrait: ''
  },
  onLoad(e) {
    console.log(e.portrait);
    this.setData({ portrait: e.portrait })
  },
  /**
   * 成为小狮子会员
   * @return {[type]} [description]
   */
  routeToPay() {
    wx.navigateTo({
      url: '/pages/shop/shop',
    });
  },
  /**
   * 点击成为小狮子会员，微信用户信息授权并跳转
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  navUserAction(e) {
    if (this.data.portrait) { // 有头像直接跳转
      this.routeToPay()
    } else {
      const that = this;
      const token = that.data.token;
      if (e.detail.userInfo) { // 有授权用户信息进行上传
        wx.showLoading();
        wx.request({
          url: 'https://ssl.newbeestudio.com/api/user/edit', //仅为示例，并非真实的接口地址
            data: {
              nickName: e.detail.userInfo.nickName,
              gender: e.detail.userInfo.gender,
              portrait: e.detail.userInfo.avatarUrl,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded', // 默认值
              'token': token,
            },
            method: 'POST',
            success: function(res) {
              wx.hideLoading();
              if (res.data.code == '000') { // 保存用户信息
                that.setData({
                  userInfo: {
                    nickName: e.detail.userInfo.nickName,
                    gender: e.detail.userInfo.gender,
                    portrait: e.detail.userInfo.avatarUrl,
                  }
                });
                wx.navigateTo({
                  url: e.currentTarget.dataset.url + '?userId=' + that.data.userInfo.id,
                });
              }
            }
          });
      } else {
        // 无授权用户信息，跳转
        wx.navigateTo({
          url: e.currentTarget.dataset.url + '?userId=' + that.data.userInfo.id,
        });
      }
    }
  },
  topNavAction: (e) => {
    wx.reLaunch({
      url: `/pages/index/index?selectedTab=${e.currentTarget.dataset.selectedtab}`
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '乐傲运动',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
});
