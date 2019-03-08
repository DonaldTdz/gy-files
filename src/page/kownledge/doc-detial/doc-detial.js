let app = getApp();
Page({
  data: {
    id: null,
    docInfo: {},
    hasPermission: false,
    loading:false
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
        host: app.globalData.host,
        uid: app.globalData.userInfo.id
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
  getCurrentFile(id) {
    let res = dd.getStorageSync({ key: 'doc_user_files' });
    let files = res.data;
    if (!files || files.length == 0) {
      return null;
    }

    for (var i in files) {
      if (files[i].id == id) {
        return files[i];
      }
    }
    return null;
  },
  setFile(file) {
    /*let res = dd.getStorageSync({ key: 'doc_user_files' });
    let files = res.data;
    if (!files) {
      files = [];
    }
    files.push(file);
    dd.setStorageSync({
      key: 'doc_user_files',
      data: files
    });*/
    dd.showLoading();
    var jsonData = JSON.stringify(file);
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Document/SaveDocDingTalkAsync',
      method: 'Post',
      headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },
      data: jsonData,
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        //console.info(res.data.result);
        var result = res.data;
        if (result.success) {
        
        } else {
          dd.alert({ content: result.error.message, buttonText: '确定' });
        }
      },
      fail: function(res) {
        dd.hideLoading();
        dd.alert({ content: '提交数据异常', buttonText: '确定' });
        console.info(res);
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });

  },
  onItemClick: function(ev) {
    const curIndex = ev.index;
    const file = this.data.docInfo.fileList[curIndex];
    var curUrl = file.fileUrl;
    var curName = file.text;
    var curId = file.id;
    //var file = this.getCurrentFile(curId);
    //dd.alert({
    //    content: JSON.stringify(res.data),
    //});
    if (file.spaceId) {//如果存在 直接预览
      dd.previewFileInDingTalk({
        corpId: app.globalData.corpId,
        spaceId: file.spaceId,
        fileId: file.fileId,
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileType: file.fileType,
        //success: res => {
        //  dd.alert({ content: JSON.stringify(res), buttonText: '确定' });
        //},
        //fail: res => {
        // dd.alert({ content: JSON.stringify(res), buttonText: '确定' });
        //}
      });
    } else {
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

          var newfile = {
            docAttId: curId,
            userId: app.globalData.userInfo.id,
            spaceId: res.data[0].spaceId,
            fileId: res.data[0].fileId,
            fileName: res.data[0].fileName,
            fileSize: res.data[0].fileSize,
            fileType: res.data[0].fileType
          };
          this.setFile(newfile);//添加

          this.data.docInfo.fileList[curIndex].spaceId = res.data[0].spaceId;
          this.data.docInfo.fileList[curIndex].fileId = res.data[0].fileId;
          this.data.docInfo.fileList[curIndex].fileName = res.data[0].fileName;
          this.data.docInfo.fileList[curIndex].fileSize = res.data[0].fileSize;
          this.data.docInfo.fileList[curIndex].fileType = res.data[0].fileType;

          dd.previewFileInDingTalk({
            corpId: app.globalData.corpId,
            spaceId: res.data[0].spaceId,
            fileId: res.data[0].fileId,
            fileName: res.data[0].fileName,
            fileSize: res.data[0].fileSize,
            fileType: res.data[0].fileType,
          });

         
        }
      });
    }
  },

  bindFormSubmit: function(e) {
    if(e.detail.value.textarea.replace(/(^s*)|(s*$)/g, "").length !=0){
    this.input.content= e.detail.value.textarea;
    this.input.documentId= this.data.id;
    this.input.employeeId = app.globalData.userInfo.id;
    this.input.employeeName = app.globalData.userInfo.name;
    var jsonData = JSON.stringify(this.input);
    this.setData({loading:true});
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Advise/CreateAdviseAsync',
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },

      data: jsonData,
  dataType: 'json',
  success: function(res) {
      dd.hideLoading();
      dd.showToast({
            type: 'success',
            content: '意见反馈成功',
            duration: 3000,
            success: () => {
            // this.setData({loading:false});
            dd.navigateBack();
                         },
          });
      // dd.alert({ content: '意见反馈成功', buttonText: '确定' });
      // e.detail.value.textarea ='';
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
