let app = getApp();

Page({
  data: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    gridList: {}
  },
  onLoad(query) {
    this.loginSys();
    // 页面加载
  },
  loginSys() {
    if (app.globalData.userInfo.id == '') {
      dd.showLoading();
      //免登陆
      //dd.getAuthCode({
      //success: (res) => {
      //  console.log('My authCode', res.authCode);
      dd.httpRequest({
        url: app.globalData.host + 'api/services/app/Employee/GetDingDingUserByCodeAsync',
        method: 'Get',
        data: {
          code: '',//res.authCode,
        },
        dataType: 'json',
        success: (res) => {
          app.globalData.userInfo = res.data.result;
          this.setData({ userInfo: app.globalData.userInfo });
          this.getCategoryList();
        },
        fail: function(res) {
          dd.alert({ content: '获取用户信息异常' });
        },
        complete: function(res) {
          dd.hideLoading();
        }
      });
    } else {
      this.setData({ userInfo: app.globalData.userInfo });
      this.getCategoryList();
    }
  },

  handleFocus() {
    dd.navigateTo({
      // url: '/page/kownledge/category-detial/category-detial',
      url: './category-detial/category-detial',
    });
  },

  onItemClick: function(ev) {
    const curIndex = ev.detail.index;
    const curId = this.data.gridList[curIndex].id;
    dd.navigateTo({
      // url: '/page/kownledge/category-detial/category-detial?id=' + curId,
      url: './category-detial/category-detial?id=' + curId,
    });
  },

  getCategoryList() {
    dd.httpRequest({
      url: app.globalData.host + '/api/services/app/DocCategory/GetCategoryListAsync',
      method: 'Get',
      dataType: 'json',
      data: {
        host: app.globalData.host,
        userId: app.globalData.userInfo.id
      },
      success: (res) => {
        this.setData({ gridList: res.data.result });
      },
      fail: function(res) {
        dd.alert({ content: '获取数据失败，请重试' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  },
});
