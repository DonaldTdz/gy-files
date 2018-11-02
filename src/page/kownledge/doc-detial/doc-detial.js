let app = getApp();
Page({
  data: {
    id: null,
    docInfo: {},
    hasPermission: false
  },

  onLoad(query) {
    if (query.id) {
      this.setData({ id: query.id });
      this.getDocHasPermission();
    }
  },
  getDocHasPermission() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Document/GetHasDocPermissionFromScanAsync',
      method: 'Get',
      dataType: 'json',
      data: {
        id: this.data.id,
        userId: app.globalData.userInfo.id
      },
      success: (res) => {
        dd.hideLoading();
        this.setData({ hasPermission: res.data.result });
        if (this.data.hasPermission) {
          this.getDocInfoByQrCode();
        }
      },
      fail: function(res) {
        dd.alert({ content: '获取数据失败，请重试' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
  getDocInfoByQrCode() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Document/GetDocInfoByScanAsync',
      method: 'Get',
      dataType: 'json',
      data: {
        id: this.data.id,
        host: app.globalData.host
      },
      success: (res) => {
        this.setData({ docInfo: res.data.result });
      },
      fail: function(res) {
        dd.alert({ content: '获取数据失败，请重试' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  onItemClick: function(ev) {
    const curIndex = ev.index;
    var curUrl = this.data.docInfo.fileList[curIndex].fileUrl;
    var curName = this.data.docInfo.fileList[curIndex].text;
    dd.saveFileToDingTalk({
      url: curUrl,
      name: curName,
      success: res => {
        // dd.showToast({
        //   type: 'success',
        //   duration: 3000,
        //   success: () => {
        //   },
        // });

        dd.previewFileInDingTalk({
          corpId: app.globalData.corpId,
          spaceId: res.data[0].spaceId,
          fileId: res.data[0].fileId,
          fileName: res.data[0].fileName,
          fileSize: res.data[0].fileSize,
          fileType: res.data[0].fileType,
        })
      }
    })
  },

  onShareAppMessage() {
    // 返回自定义分享信息
  },
});
