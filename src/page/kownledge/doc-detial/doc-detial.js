let app = getApp();
Page({
  data: {
    id: null,
    docInfo: {},
    hasPermission: false
  },
    input: {
    documentId: null,
    employeeId: null,
    content: '',
    employeeName: null
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

  bindFormSubmit: function(e) {
    if(e.detail.value.textarea.replace(/(^s*)|(s*$)/g, "").length !=0){
    this.input.content= e.detail.value.textarea;
    this.input.documentId= this.data.id;
    this.input.employeeId = app.globalData.userInfo.id;
    this.input.employeeName = app.globalData.userInfo.name;
    var jsonData = JSON.stringify(this.input);
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Advise/CreateAdviseAsync',
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },

      data: jsonData,
  dataType: 'json',
  success: function(res) {
      dd.hideLoading();
      dd.alert({ content: '意见反馈成功', buttonText: '确定' });
      e.detail.value.textarea ='';
  },
  fail: function(res) {
       dd.hideLoading();
        dd.alert({ content: '提交数据异常', buttonText: '确定' });
        console.info(res); 
         },
});
    }else{
        dd.alert({ content: '内容不能为空', buttonText: '确定' });
    }
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  },
});
