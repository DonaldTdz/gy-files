let app = getApp();
Page({
    data: {
        id: null,
        input: '',
        docList: [],
        tabs: {},
        pageSize: 6,
        pageIndex: 1,
        pageSearchIndex: 1,
        tempTabIndex: 0,
        pullType: '',
      color:'#3296fa',
    },

    onLoad(query) {
        this.setData({ docList: [] });
        if (query.id) {
          if(query.id.indexOf(',') != -1){
            this.setData({ id: query.id.split(',')[1] });
            // console.log(this.data.id);
          }else{
            this.setData({ id: query.id });
          }
            this.getTabs();
        }
    },

    getSearch(curId) {
        dd.showLoading();
        if (!curId) {
            curId = this.data.id;
        }
        dd.httpRequest({
            url: app.globalData.host + 'api/services/app/Document/GetDocListByInputAsync',
            method: 'Get',
            dataType: 'json',
            data: {
                input: this.data.input,
                catId: curId,
                userId: app.globalData.userInfo.id,
                pageIndex: this.data.pageSearchIndex,
                pageSize: this.data.pageSize
            },
            success: (res) => {
                if (res.data.result.length < this.data.pageSize) {
                    this.setData({ pageSearchIndex: -1 });
                } else {
                    this.setData({ pageSearchIndex: this.data.pageSearchIndex + 1 });
                }
                var curList = res.data.result;
                var oriList = this.data.docList;
                if (curList.length > 0) {
                    for (var i in curList) {
                        oriList.push(curList[i]);
                    }
                    this.setData({ docList: oriList });
                }
                // this.setData({ docList: res.data.result });
            },
            fail: function(res) {
                dd.alert({ content: '获取数据失败，请重试' });
            },
            complete: function(res) {
                dd.hideLoading();
            }
        });
    },


    getTabs() {
        dd.showLoading();
        dd.httpRequest({
            url: app.globalData.host + 'api/services/app/DocCategory/GetTabChildListByIdAsync',
            method: 'Get',
            dataType: 'json',
            data: {
                id: this.data.id,
            },
            success: (res) => {
                this.setData({ tabs: res.data.result });
                dd.hideLoading();
                this.getDocList(this.data.tabs[0].id);
            },
            fail: function(res) {
                dd.alert({ content: '获取数据失败，请重试' });
            },
            complete: function(res) {
                dd.hideLoading();
            }
        });
    },
    handleClear(val) {
        this.setData({ pullType: '' });
    },
    // handleClear() {
    //   dd.alert({ content: '222' });

    //   this.setData({ pullType: '' });
    // },

    handleInput(e) {
        this.setData({ input: e });
        if (e.trim().length == 0) {
            this.setData({ pullType: '' });
        } else {
            this.setData({ pullType: 'search' });
        }
    },

    handleTabClick({ index }) {
        let curId = this.data.tabs[index].id;
        if (this.data.pullType == 'search') {
            if (this.data.tempTabIndex != index && this.data.input != null) {
                this.setData({ pageSearchIndex: 1 });
                this.setData({ tempTabIndex: index });
                this.setData({ id: this.data.tabs[this.data.tempTabIndex].id })
                this.setData({ docList: [] });
                this.getSearch(curId);
            }
        } else {
            if (this.data.tempTabIndex != index || (this.data.tempTabIndex != index && this.data.pageIndex == -1)) {
                this.setData({ pageIndex: 1 });
                this.setData({ tempTabIndex: index });
                this.setData({ docList: [] });
                this.getDocList(this.data.tabs[this.data.tempTabIndex].id);
            }
        }
        // this.setData({ pullType: '' });
        // if (this.data.tempTabIndex != index && this.data.pageIndex == -1) {
        //   this.setData({ pageIndex: 1 });
        //   this.setData({ tempTabIndex: index });
        //   this.setData({ docList: [] });
        //   this.getDocList(curId);
        // }
        // else if (this.data.tempTabIndex != index) {
        //   this.setData({ pageIndex: 1 });
        //   this.setData({ tempTabIndex: index });
        //   this.setData({ docList: [] });
        //   this.getDocList(curId);
        // }

        // if (this.data.pullType != 'search') {
        //   console.log('!=')
        // if (this.data.tempTabIndex != index || (this.data.tempTabIndex != index && this.data.pageIndex == -1)) {
        //   this.setData({ pageIndex: 1 });
        //   this.setData({ tempTabIndex: index });
        //   this.setData({ docList: [] });
        //   this.getDocList(curId);
        // }
        // } else {
        //   console.log('==')
        //   if (this.data.pageIndex != -1) {
        //     console.log('进')
        //     this.setData({ pageIndex: 1 });
        //     this.setData({ tempTabIndex: index });
        //     this.setData({ docList: [] });
        //     this.getDocList(curId);
        //   }
        // }
    },

    handleSubmit(val) {
        if (this.data.pullType != 'search') {
            this.setData({ docList: [] });
            this.setData({ pageSearchIndex: 1 })
            this.setData({ pullType: 'search' });
            if (this.data.pageSearchIndex != -1) {
                this.getSearch(this.data.tabs[this.data.tempTabIndex].id);
            }
        } else {
            if (val != null && val.trim().length != 0) {
                this.setData({ docList: [] });
                this.setData({ pageSearchIndex: 1 })
                this.setData({ pullType: 'search' });
                if (this.data.pageSearchIndex != -1) {
                    this.getSearch(this.data.tabs[this.data.tempTabIndex].id);
                }
            }
        }
    },

    handleClear() {
        this.setData({ input: '' });
    },

    getDocList(curId) {
        // var that = this;
        dd.showLoading();
        dd.httpRequest({
            url: app.globalData.host + 'api/services/app/Document/GetDocListByParentIdAsync',
            method: 'Get',
            dataType: 'json',
            data: {
                categoryCode: curId,
                userId: app.globalData.userInfo.id,
                pageIndex: this.data.pageIndex,
                pageSize: this.data.pageSize
            },
            success: (res) => {
                if (res.data.result.length < this.data.pageSize) {
                    this.setData({ pageIndex: -1 });
                } else {
                    this.setData({ pageIndex: this.data.pageIndex + 1 });
                }
                var curList = res.data.result;
                var oriList = this.data.docList;
                if (curList.length > 0) {
                    for (var i in curList) {
                        oriList.push(curList[i]);
                    }
                    this.setData({ docList: oriList });
                }
                dd.hideLoading();
            },
            fail: function(res) {
                dd.alert({ content: '获取数据失败，请重试' });
            },
            complete: function(res) {
                dd.hideLoading();
            }
        });
    },

    onCardClick(data) {
        dd.navigateTo({
            url: "./../doc-detial/doc-detial?id=" + data.info.id,
        });
    },

    onShareAppMessage() {
        // 返回自定义分享信息
    },

    onReachBottom() {
        if (this.data.pullType != 'search') {
            if (this.data.pageIndex != -1) {
                this.getDocList(this.data.tabs[this.data.tempTabIndex].id);
            }
        } else if (this.data.pullType == 'search') {
            if (this.data.pageSearchIndex != -1) {
                this.getSearch();
            }
        }
    },

    onUnload() {
        // dd.alert({content:'关闭了'})
        dd.redirectTo({
            url: '/page/kownledge/index',
        })
    },

});