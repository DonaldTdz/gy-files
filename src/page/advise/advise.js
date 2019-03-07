let app = getApp();
Page({
  data: {
    id: null,
    info: {},
  },

  onLoad(query) {
    if (query.id) {
      this.getAdvise(query.id);
    }
  },
  getAdvise(id) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Advise/GetDDAdviseByIdAsync',
      method: 'Get',
      dataType: 'json',
      data: {
        id: id,
      },
      success: (res) => {
        this.setData({ info: res.data.result });
      },
      fail: function(res) {
        dd.alert({ content: '获取数据失败，请重试' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  onShareAppMessage() {
    // 返回自定义分享信息
  },
});
