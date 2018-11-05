App({
  globalData: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    host: 'http://gyapi.intcov.com/',
    //host: 'http://yangfan.vaiwan.com/',
    //host: 'http://127.0.0.1:21021/',
    corpId: ''
  },
  onLaunch(options) {
    // 第一次打开
    options.query == {number:1}
    // console.info('App onLaunch');
    // console.log('getSystemInfoSync', dd.getSystemInfoSync());
    // console.log('SDKVersion', dd.SDKVersion);
    // console.log('corpId', this.globalData.corpId);
      this.globalData.corpId = options.query.corpId;

  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
