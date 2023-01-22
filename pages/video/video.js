// pages/video/video.js

import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoLableList:[],
    navId:'',
    videoPlayList:[],
    videoId:"",    //点击的视频的id
    videoTimeUpdate:[], //记录某个视频的暂停时间
    isTriggered:Boolean //是否刷新
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getvideoLableList()
  
  },
  //获取视频标签
  async getvideoLableList(){
    let videoLableListData=await request('/video/group/list')
    this.setData({
      videoLableList:videoLableListData.data.slice(0,15),
      navId:videoLableListData.data[0].id
    })
    this.getVideoPlayList(this.data.navId)
  },
  //获取视频
  async getVideoPlayList(navId){
    let VideoPlayListData=await request('/video/group',{id:navId})
    wx.hideLoading()  //关闭加载框
    let index=0;
    let videoPlayList=VideoPlayListData.datas.map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      videoPlayList,
      isTriggered:false  //关闭刷新提示框
    })
  },
  handlerNavItem(event){
    let navId=event.currentTarget.id  //通过id向event传参。如果是Number会自动转换成string
    this.setData({
      navId:navId*1,
      videoPlayList:[]
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoPlayList(this.data.navId)
  },
  //点击播放，暂停上一个播放
  handlerPlay(event){
    let vid=event.currentTarget.id
    this.vid!==vid&&this.VideoContext&&this.VideoContext.stop()
    this.vid=vid
    this.setData({
      videoId:vid
    })
    this.VideoContext=wx.createVideoContext(vid)
    //判断当前的视频是否有播放记录 ---有跳转暂停处   ---无重新播放
    let videoItem=this.data.videoTimeUpdate.find(item=>item.vid===vid)
    if(videoItem){
      this.VideoContext.seek(videoItem.currentTime)
    }
    this.VideoContext.play()
  },
  //再次点击跳到原来视频暂停处
  handlerTimeUpdate(event){
    let timeObj={currentTime:event.detail.currentTime, vid:event.currentTarget.id}
    let {videoTimeUpdate}=this.data
    let videoItem=videoTimeUpdate.find(item=>item.vid==timeObj.vid)
    if(videoItem){
      videoItem.currentTime=event.detail.currentTime
    }else{
      videoTimeUpdate.push(timeObj)
    }
    this.setData({
      videoTimeUpdate
    })
    
  },
  //视频结束则重新播放，即删除播放记录
  handlerEnded(event){
    let {videoTimeUpdate}=this.data
   let index= videoTimeUpdate.findIndex(item=>item.vid===event.target.id)
   videoTimeUpdate.splice(index,1)
   this.setData({
     videoTimeUpdate
   })
  },
  //下拉刷新视频数据
  handlerRefresher(){
    this.getVideoPlayList(this.data.navId)
  },
  //上拉触底加载视频数据
  async handlerscrolltolower(navId){
    //数据分页  1.前端分页 2.后端分页
    let newVideoList1=await request('/video/group',{id:navId,offset:10})
    console.log(newVideoList1)
    let newVideoList= [{
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
      "alg": "onlineHotGroup",
      "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
      "threadId": "R_VI_62_52090F8B3729073ADDC72A3A88839249",
      "coverUrl": "https://p1.music.126.net/-hE-oOoisc9UMh6g1o7dqQ==/109951164956319707.jpg",
      "height": 360,
      "width": 640,
      "title": "【时代少年团】NCT127《Intro》+《英雄；Kick It》Cover",
      "description": null,
      "commentCount": 320,
      "shareCount": 819,
      "resolutions": [
      {
      "resolution": 720,
      "size": 148948207
      },
      {
      "resolution": 480,
      "size": 93322000
      },
      {
      "resolution": 240,
      "size": 74095132
      }
      ],
      "creator": {
      "defaultAvatar": false,
      "province": 350000,
      "authStatus": 0,
      "followed": false,
      "avatarUrl": "http://p1.music.126.net/JOUAgwRhAP2a1CR1LzIUnw==/109951168209098229.jpg",
      "accountStatus": 0,
      "gender": 2,
      "city": 350500,
      "birthday": 955987200000,
      "userId": 119104534,
      "userType": 207,
      "nickname": "黄小帽欸",
      "signature": "不欢迎没礼貌的人",
      "description": "",
      "detailDescription": "",
      "avatarImgId": 109951168209098220,
      "backgroundImgId": 109951166581768590,
      "backgroundUrl": "http://p1.music.126.net/42lrV93zeSIlo5_6xbRajQ==/109951166581768593.jpg",
      "authority": 0,
      "mutual": false,
      "expertTags": null,
      "experts": null,
      "djStatus": 10,
      "vipType": 11,
      "remarkName": null,
      "avatarImgIdStr": "109951168209098229",
      "backgroundImgIdStr": "109951166581768593"
      },
      "urlInfo": null,
      "videoGroup": [
      {
      "id": 1101,
      "name": "舞蹈",
      "alg": null
      },
      {
      "id": 60105,
      "name": "翻跳",
      "alg": null
      },
      {
      "id": 58116,
      "name": "韩舞",
      "alg": null
      }
      ],
      "previewUrl": null,
      "previewDurationms": 0,
      "hasRelatedGameAd": false,
      "markTypes": null,
      "relateSong": [
      {
      "name": "英雄 (Kick It, 영웅)（翻自 NCT 127） ",
      "id": 1428891065,
      "pst": 0,
      "t": 0,
      "ar": [
      {
      "id": 12287611,
      "name": "野生三十",
      "tns": [],
      "alias": []
      }
      ],
      "alia": [],
      "pop": 75,
      "st": 0,
      "rt": "",
      "fee": 0,
      "v": 7,
      "crbt": null,
      "cf": "",
      "al": {
      "id": 86132338,
      "name": "英雄 (Kick It)",
      "picUrl": "http://p4.music.126.net/obqpzYP_UzicBM-TnSXneA==/109951164777364723.jpg",
      "tns": [],
      "pic_str": "109951164777364723",
      "pic": 109951164777364720
      },
      "dt": 233934,
      "h": {
      "br": 320000,
      "fid": 0,
      "size": 9360240,
      "vd": -71021
      },
      "m": {
      "br": 192000,
      "fid": 0,
      "size": 5616161,
      "vd": -68482
      },
      "l": {
      "br": 128000,
      "fid": 0,
      "size": 3744122,
      "vd": -66959
      },
      "a": null,
      "cd": "01",
      "no": 1,
      "rtUrl": null,
      "ftype": 0,
      "rtUrls": [],
      "djId": 0,
      "copyright": 0,
      "s_id": 0,
      "mst": 9,
      "rtype": 0,
      "rurl": null,
      "cp": 0,
      "mv": 0,
      "publishTime": 0,
      "privilege": {
      "id": 1428891065,
      "fee": 0,
      "payed": 0,
      "st": 0,
      "pl": 320000,
      "dl": 999000,
      "sp": 7,
      "cp": 1,
      "subp": 1,
      "cs": false,
      "maxbr": 999000,
      "fl": 320000,
      "toast": false,
      "flag": 128,
      "preSell": false
      }
      }
      ],
      "relatedInfo": null,
      "videoUserLiveInfo": null,
      "vid": "52090F8B3729073ADDC72A3A88839249",
      "durationms": 345003,
      "playTime": 341692,
      "praisedCount": 6246,
      "praised": false,
      "subscribed": false
      }
      },
      {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
      "alg": "onlineHotGroup",
      "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
      "threadId": "R_VI_62_A677E958FE2A220F15DDB23DC6E5E113",
      "coverUrl": "https://p1.music.126.net/eW3aAt8euVJl9VXltPkcRg==/109951163571960244.jpg",
      "height": 480,
      "width": 854,
      "title": "申旭阔编舞夏日度假风的《咖喱咖喱》~",
      "description": null,
      "commentCount": 302,
      "shareCount": 4706,
      "resolutions": [
      {
      "resolution": 240,
      "size": 26277148
      },
      {
      "resolution": 480,
      "size": 37209968
      }
      ],
      "creator": {
      "defaultAvatar": false,
      "province": 320000,
      "authStatus": 1,
      "followed": false,
      "avatarUrl": "http://p1.music.126.net/z2qbKqlahEw9oy-WpIzjPA==/109951163337851725.jpg",
      "accountStatus": 0,
      "gender": 1,
      "city": 320100,
      "birthday": 590083200000,
      "userId": 124285205,
      "userType": 10,
      "nickname": "阔少_申旭阔",
      "signature": "南京Ishow艺术总监申旭阔，《舞林争霸》26强，《你最有才》全国季军，《舞动好声音》十强，国内知名舞蹈编导，Ishow报名vx：13770971242",
      "description": "舞蹈编导，Ishow艺术总监",
      "detailDescription": "舞蹈编导，Ishow艺术总监",
      "avatarImgId": 109951163337851730,
      "backgroundImgId": 109951162799917400,
      "backgroundUrl": "http://p1.music.126.net/4bxZd-Y_BKmacq_hkSx4-g==/109951162799917401.jpg",
      "authority": 0,
      "mutual": false,
      "expertTags": null,
      "experts": null,
      "djStatus": 10,
      "vipType": 11,
      "remarkName": null,
      "avatarImgIdStr": "109951163337851725",
      "backgroundImgIdStr": "109951162799917401"
      },
      "urlInfo": null,
      "videoGroup": [
      {
      "id": 1101,
      "name": "舞蹈",
      "alg": null
      }
      ],
      "previewUrl": null,
      "previewDurationms": 0,
      "hasRelatedGameAd": false,
      "markTypes": [
      109
      ],
      "relateSong": [],
      "relatedInfo": null,
      "videoUserLiveInfo": null,
      "vid": "A677E958FE2A220F15DDB23DC6E5E113",
      "durationms": 157000,
      "playTime": 3118214,
      "praisedCount": 10991,
      "praised": false,
      "subscribed": false
      }
      },
      {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
      "alg": "onlineHotGroup",
      "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
      "threadId": "R_VI_62_F7D2B8D15462A90F3421C614B6B55BE8",
      "coverUrl": "https://p1.music.126.net/SDVpmD1Yl9IUY_F2fRke8A==/109951163572909561.jpg",
      "height": 540,
      "width": 960,
      "title": "【Blackpink】boombayah2倍速舞蹈版",
      "description": "你家粉墨两倍速舞蹈跳boombayah！#BLACKPINK#",
      "commentCount": 474,
      "shareCount": 707,
      "resolutions": [
      {
      "resolution": 240,
      "size": 31642479
      },
      {
      "resolution": 480,
      "size": 45087826
      }
      ],
      "creator": {
      "defaultAvatar": false,
      "province": 0,
      "authStatus": 0,
      "followed": false,
      "avatarUrl": "http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg",
      "accountStatus": 30,
      "gender": 0,
      "city": 100,
      "birthday": -2209017600000,
      "userId": 1295882384,
      "userType": 0,
      "nickname": "帐号已注销",
      "signature": "",
      "description": "",
      "detailDescription": "",
      "avatarImgId": 109951165647004060,
      "backgroundImgId": 109951162868126480,
      "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
      "authority": 0,
      "mutual": false,
      "expertTags": null,
      "experts": null,
      "djStatus": 0,
      "vipType": 0,
      "remarkName": null,
      "avatarImgIdStr": "109951165647004069",
      "backgroundImgIdStr": "109951162868126486"
      },
      "urlInfo": null,
      "videoGroup": [
      {
      "id": 1101,
      "name": "舞蹈",
      "alg": null
      },
      {
      "id": 13164,
      "name": "快乐",
      "alg": null
      }
      ],
      "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_148108475_lOZSkBhv.webp?wsSecret=e7669469e1963c396847150e7240ac4c&wsTime=1673019503",
      "previewDurationms": 4000,
      "hasRelatedGameAd": false,
      "markTypes": [
      109
      ],
      "relateSong": [
      {
      "name": "BOOMBAYAH (Japanese Ver.)",
      "id": 502238185,
      "pst": 0,
      "t": 0,
      "ar": [
      {
      "id": 12068017,
      "name": "BLACKPINK",
      "tns": [],
      "alias": []
      }
      ],
      "alia": [],
      "pop": 95,
      "st": 0,
      "rt": null,
      "fee": 8,
      "v": 28,
      "crbt": null,
      "cf": "",
      "al": {
      "id": 36031601,
      "name": "BLACKPINK",
      "picUrl": "http://p4.music.126.net/3BPc7x_UVZWpHHjg9t4YYg==/109951163014329187.jpg",
      "tns": [],
      "pic_str": "109951163014329187",
      "pic": 109951163014329180
      },
      "dt": 241640,
      "h": {
      "br": 320000,
      "fid": 0,
      "size": 9668485,
      "vd": -74598
      },
      "m": {
      "br": 192000,
      "fid": 0,
      "size": 5801108,
      "vd": -74598
      },
      "l": {
      "br": 128000,
      "fid": 0,
      "size": 3867420,
      "vd": -74598
      },
      "a": null,
      "cd": "1",
      "no": 1,
      "rtUrl": null,
      "ftype": 0,
      "rtUrls": [],
      "djId": 0,
      "copyright": 1,
      "s_id": 0,
      "mst": 9,
      "rtype": 0,
      "rurl": null,
      "cp": 457010,
      "mv": 5350068,
      "publishTime": 1504022400000,
      "privilege": {
      "id": 502238185,
      "fee": 8,
      "payed": 0,
      "st": 0,
      "pl": 128000,
      "dl": 0,
      "sp": 7,
      "cp": 1,
      "subp": 1,
      "cs": false,
      "maxbr": 999000,
      "fl": 128000,
      "toast": false,
      "flag": 5,
      "preSell": false
      }
      }
      ],
      "relatedInfo": null,
      "videoUserLiveInfo": null,
      "vid": "F7D2B8D15462A90F3421C614B6B55BE8",
      "durationms": 269791,
      "playTime": 1445776,
      "praisedCount": 11314,
      "praised": false,
      "subscribed": false
      }
      },
      {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
      "alg": "onlineHotGroup",
      "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
      "threadId": "R_VI_62_B55246CE6C9D0B978CB186ABAF5E5108",
      "coverUrl": "https://p1.music.126.net/v4FKQGRH_XQ_QwAuW_iWZw==/109951164890748875.jpg",
      "height": 1080,
      "width": 1920,
      "title": "腾格尔对《恋爱循环》下手了，一开口忘记原唱，太洗脑了",
      "description": "腾格尔对《恋爱循环》下手了，一开口忘记原唱，太洗脑了",
      "commentCount": 17,
      "shareCount": 68,
      "resolutions": [
      {
      "resolution": 240,
      "size": 14483478
      },
      {
      "resolution": 480,
      "size": 23937916
      },
      {
      "resolution": 720,
      "size": 37569136
      },
      {
      "resolution": 1080,
      "size": 66607029
      }
      ],
      "creator": {
      "defaultAvatar": false,
      "province": 330000,
      "authStatus": 0,
      "followed": false,
      "avatarUrl": "http://p1.music.126.net/GSABhoZKKa9h48blcC1XDQ==/109951164575599087.jpg",
      "accountStatus": 0,
      "gender": 1,
      "city": 330100,
      "birthday": -2209017600000,
      "userId": 2077929525,
      "userType": 0,
      "nickname": "唯一音乐吐槽酱",
      "signature": "每日优秀好听国内外音乐推荐，音乐如此不平凡",
      "description": "",
      "detailDescription": "",
      "avatarImgId": 109951164575599090,
      "backgroundImgId": 109951162868126480,
      "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
      "authority": 0,
      "mutual": false,
      "expertTags": null,
      "experts": {
      "1": "音乐视频达人"
      },
      "djStatus": 0,
      "vipType": 0,
      "remarkName": null,
      "avatarImgIdStr": "109951164575599087",
      "backgroundImgIdStr": "109951162868126486"
      },
      "urlInfo": null,
      "videoGroup": [
      {
      "id": 1101,
      "name": "舞蹈",
      "alg": null
      },
      {
      "id": 3110,
      "name": "宅舞",
      "alg": null
      },
      {
      "id": 12100,
      "name": "流行",
      "alg": null
      },
      {
      "id": 5100,
      "name": "音乐",
      "alg": null
      },
      {
      "id": 23116,
      "name": "音乐推荐",
      "alg": null
      },
      {
      "id": 16142,
      "name": "日语音乐",
      "alg": null
      }
      ],
      "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2956810542_Th6sDJ4M.webp?wsSecret=31478c8d4dda3526f45d8843505fd339&wsTime=1673019503",
      "previewDurationms": 4000,
      "hasRelatedGameAd": false,
      "markTypes": null,
      "relateSong": [],
      "relatedInfo": null,
      "videoUserLiveInfo": null,
      "vid": "B55246CE6C9D0B978CB186ABAF5E5108",
      "durationms": 175787,
      "playTime": 166165,
      "praisedCount": 464,
      "praised": false,
      "subscribed": false
      }
      },
      {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
      "alg": "onlineHotGroup",
      "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
      "threadId": "R_VI_62_BB2EE65034FD7B40CCF2637DCA6FEDFB",
      "coverUrl": "https://p1.music.126.net/3z80eg1PZS9NUy6gkT-xoA==/109951164106219781.jpg",
      "height": 720,
      "width": 1280,
      "title": "【酸梅酱】BLACKPINK 成员家族背景大揭秘",
      "description": "【酸梅酱】BLACKPINK 成员家族背景大揭秘，原来她们都是不红就要去继承家业的人\n#BLACKPINK #",
      "commentCount": 1031,
      "shareCount": 662,
      "resolutions": [
      {
      "resolution": 240,
      "size": 22740205
      },
      {
      "resolution": 480,
      "size": 31975328
      },
      {
      "resolution": 720,
      "size": 45751806
      }
      ],
      "creator": {
      "defaultAvatar": false,
      "province": 120000,
      "authStatus": 0,
      "followed": false,
      "avatarUrl": "http://p1.music.126.net/t9hwoyS4xe_EYkq2RYNZHw==/109951164918589539.jpg",
      "accountStatus": 0,
      "gender": 2,
      "city": 120101,
      "birthday": 631123200000,
      "userId": 495642873,
      "userType": 204,
      "nickname": "改什么名字凑合用吧",
      "signature": "永远浓墨重彩，永远乐在其中\nB站同名",
      "description": "",
      "detailDescription": "",
      "avatarImgId": 109951164918589540,
      "backgroundImgId": 109951164345249680,
      "backgroundUrl": "http://p1.music.126.net/7BWZLfRnO3d4OhwzK4f4DA==/109951164345249683.jpg",
      "authority": 0,
      "mutual": false,
      "expertTags": null,
      "experts": {
      "1": "音乐视频达人"
      },
      "djStatus": 0,
      "vipType": 11,
      "remarkName": null,
      "avatarImgIdStr": "109951164918589539",
      "backgroundImgIdStr": "109951164345249683"
      },
      "urlInfo": null,
      "videoGroup": [
      {
      "id": 1101,
      "name": "舞蹈",
      "alg": null
      },
      {
      "id": 58101,
      "name": "听BGM",
      "alg": null
      },
      {
      "id": 4101,
      "name": "娱乐",
      "alg": null
      },
      {
      "id": 92105,
      "name": "BLACKPINK",
      "alg": null
      },
      {
      "id": 16172,
      "name": "八卦",
      "alg": null
      },
      {
      "id": 16190,
      "name": "韩国明星",
      "alg": null
      }
      ],
      "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2523445900_PBBSRTVh.webp?wsSecret=f5b4e38e8afc6a8930d59e389c09ae45&wsTime=1673019503",
      "previewDurationms": 4000,
      "hasRelatedGameAd": false,
      "markTypes": null,
      "relateSong": [],
      "relatedInfo": null,
      "videoUserLiveInfo": null,
      "vid": "BB2EE65034FD7B40CCF2637DCA6FEDFB",
      "durationms": 339305,
      "playTime": 1830613,
      "praisedCount": 20159,
      "praised": false,
      "subscribed": false
      }
      },
      {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
      "alg": "onlineHotGroup",
      "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
      "threadId": "R_VI_62_B0AF06A8C86A7631D0607206F7AA914B",
      "coverUrl": "https://p1.music.126.net/8K5YhE7xEWESKZFGo8Ne7A==/109951163574297364.jpg",
      "height": 1080,
      "width": 1920,
      "title": "【狙击少女心 泫雅《因为红》翻跳】致命诱惑~",
      "description": "樨樨和小志共同演绎性感舞曲，将泫雅欧尼的舞跳出新feel~",
      "commentCount": 87,
      "shareCount": 230,
      "resolutions": [
      {
      "resolution": 240,
      "size": 10698158
      },
      {
      "resolution": 480,
      "size": 17637609
      },
      {
      "resolution": 720,
      "size": 26341045
      },
      {
      "resolution": 1080,
      "size": 55594315
      }
      ],
      "creator": {
      "defaultAvatar": false,
      "province": 510000,
      "authStatus": 0,
      "followed": false,
      "avatarUrl": "http://p1.music.126.net/OsUYrxrLcleN7tC6K1w_2g==/109951165808951932.jpg",
      "accountStatus": 0,
      "gender": 2,
      "city": 510100,
      "birthday": 1499184000000,
      "userId": 596861177,
      "userType": 204,
      "nickname": "WOULP舞铺-成都舞蹈工作室",
      "signature": "给大家分享最新的街舞（爵士舞、韩舞、urban dance等）原创编舞及舞蹈翻跳作品。也会持续更新详细的舞蹈教学视频，零基础学跳舞之友，喜欢我们就关注我们吧。",
      "description": "",
      "detailDescription": "",
      "avatarImgId": 109951165808951940,
      "backgroundImgId": 109951162868128400,
      "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
      "authority": 0,
      "mutual": false,
      "expertTags": null,
      "experts": {
      "1": "舞蹈原创视频达人"
      },
      "djStatus": 0,
      "vipType": 0,
      "remarkName": null,
      "avatarImgIdStr": "109951165808951932",
      "backgroundImgIdStr": "109951162868128395"
      },
      "urlInfo": null,
      "videoGroup": [
      {
      "id": 1101,
      "name": "舞蹈",
      "alg": null
      },
      {
      "id": 60105,
      "name": "翻跳",
      "alg": null
      },
      {
      "id": 58116,
      "name": "韩舞",
      "alg": null
      }
      ],
      "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_1957393088_EoysjcOz.webp?wsSecret=caccf4ca76e6e7e1f0d0c321695b826e&wsTime=1673019503",
      "previewDurationms": 4000,
      "hasRelatedGameAd": false,
      "markTypes": null,
      "relateSong": [
      {
      "name": "잘나가서 그래",
      "id": 34072520,
      "pst": 0,
      "t": 0,
      "ar": [
      {
      "id": 126066,
      "name": "泫雅",
      "tns": [],
      "alias": []
      },
      {
      "id": 1046469,
      "name": "郑镒勋",
      "tns": [],
      "alias": []
      }
      ],
      "alia": [],
      "pop": 100,
      "st": 0,
      "rt": null,
      "fee": 8,
      "v": 38,
      "crbt": null,
      "cf": "",
      "al": {
      "id": 3270979,
      "name": "A+",
      "picUrl": "http://p4.music.126.net/NWsVV7vmFZaeM734sslRog==/7779044767646083.jpg",
      "tns": [],
      "pic": 7779044767646083
      },
      "dt": 202536,
      "h": {
      "br": 320000,
      "fid": 0,
      "size": 8104272,
      "vd": -80850
      },
      "m": {
      "br": 192000,
      "fid": 0,
      "size": 4862581,
      "vd": -78393
      },
      "l": {
      "br": 128000,
      "fid": 0,
      "size": 3241735,
      "vd": -77149
      },
      "a": null,
      "cd": "1",
      "no": 2,
      "rtUrl": null,
      "ftype": 0,
      "rtUrls": [],
      "djId": 0,
      "copyright": 0,
      "s_id": 0,
      "mst": 9,
      "rtype": 0,
      "rurl": null,
      "cp": 1415873,
      "mv": 463570,
      "publishTime": 1440086400000,
      "tns": [
      "因为红"
      ],
      "privilege": {
      "id": 34072520,
      "fee": 8,
      "payed": 0,
      "st": 0,
      "pl": 128000,
      "dl": 0,
      "sp": 7,
      "cp": 1,
      "subp": 1,
      "cs": false,
      "maxbr": 999000,
      "fl": 128000,
      "toast": false,
      "flag": 4,
      "preSell": false
      }
      }
      ],
      "relatedInfo": null,
      "videoUserLiveInfo": null,
      "vid": "B0AF06A8C86A7631D0607206F7AA914B",
      "durationms": 147440,
      "playTime": 294725,
      "praisedCount": 1391,
      "praised": false,
      "subscribed": false
      }
      },
      {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
      "alg": "onlineHotGroup",
      "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
      "threadId": "R_VI_62_08D23B37E4DE4D48D2986B1E6F931106",
      "coverUrl": "https://p1.music.126.net/YtT-yNAoaHte6mocOZTCTw==/109951164620326763.jpg",
      "height": 1920,
      "width": 1080,
      "title": "少儿舞蹈《你笑起来真好看》，可爱的宝贝们快笑一个！",
      "description": "",
      "commentCount": 11,
      "shareCount": 176,
      "resolutions": [
      {
      "resolution": 240,
      "size": 671928
      },
      {
      "resolution": 480,
      "size": 1085305
      },
      {
      "resolution": 720,
      "size": 1616414
      },
      {
      "resolution": 1080,
      "size": 3481090
      }
      ],
      "creator": {
      "defaultAvatar": false,
      "province": 420000,
      "authStatus": 0,
      "followed": false,
      "avatarUrl": "http://p1.music.126.net/keivcMyMR_6TTrmRztKBbQ==/109951163460508903.jpg",
      "accountStatus": 0,
      "gender": 2,
      "city": 420100,
      "birthday": 1475251200000,
      "userId": 549300941,
      "userType": 204,
      "nickname": "舞林一分钟",
      "signature": "每天舞林一分钟，秒变女神很轻松！",
      "description": "",
      "detailDescription": "",
      "avatarImgId": 109951163460508900,
      "backgroundImgId": 109951162868126480,
      "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
      "authority": 0,
      "mutual": false,
      "expertTags": null,
      "experts": {
      "1": "舞蹈原创视频达人"
      },
      "djStatus": 0,
      "vipType": 0,
      "remarkName": null,
      "avatarImgIdStr": "109951163460508903",
      "backgroundImgIdStr": "109951162868126486"
      },
      "urlInfo": null,
      "videoGroup": [
      {
      "id": 1101,
      "name": "舞蹈",
      "alg": null
      }
      ],
      "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2874774777_vyVEm2Bx.webp?wsSecret=3c71f4a546fa86a952f84d963b8aa8e8&wsTime=1673019503",
      "previewDurationms": 4000,
      "hasRelatedGameAd": false,
      "markTypes": [
      109
      ],
      "relateSong": [],
      "relatedInfo": null,
      "videoUserLiveInfo": null,
      "vid": "08D23B37E4DE4D48D2986B1E6F931106",
      "durationms": 11328,
      "playTime": 323356,
      "praisedCount": 956,
      "praised": false,
      "subscribed": false
      }
      },
      {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
      "alg": "onlineHotGroup",
      "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
      "threadId": "R_VI_62_7E9342E47926F4474C463A251DBFC572",
      "coverUrl": "https://p1.music.126.net/Y7ozX32hHL56cNWyQwK5Hg==/109951163207543314.jpg",
      "height": 720,
      "width": 1280,
      "title": "【编舞】星舞TKDANCE双双超美编舞snow in California",
      "description": "编舞：双双\n舞蹈：双双、晓东\n陪伴才是爱最好的语言～\n\n【成都星舞TKDANCE】",
      "commentCount": 10,
      "shareCount": 9,
      "resolutions": [
      {
      "resolution": 240,
      "size": 18061388
      },
      {
      "resolution": 480,
      "size": 25772134
      },
      {
      "resolution": 720,
      "size": 41154936
      }
      ],
      "creator": {
      "defaultAvatar": false,
      "province": 0,
      "authStatus": 0,
      "followed": false,
      "avatarUrl": "http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg",
      "accountStatus": 30,
      "gender": 0,
      "city": 100,
      "birthday": -2209017600000,
      "userId": 94364059,
      "userType": 0,
      "nickname": "帐号已注销",
      "signature": "",
      "description": "",
      "detailDescription": "",
      "avatarImgId": 109951165647004060,
      "backgroundImgId": 109951162868126480,
      "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
      "authority": 0,
      "mutual": false,
      "expertTags": null,
      "experts": {
      "1": "舞蹈视频达人"
      },
      "djStatus": 0,
      "vipType": 0,
      "remarkName": null,
      "avatarImgIdStr": "109951165647004069",
      "backgroundImgIdStr": "109951162868126486"
      },
      "urlInfo": null,
      "videoGroup": [
      {
      "id": 1101,
      "name": "舞蹈",
      "alg": null
      },
      {
      "id": 60106,
      "name": "现代舞",
      "alg": null
      }
      ],
      "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_139651763_Jg0ijPMO.webp?wsSecret=6cf4b0e6b7326a89c3df33ad9f888fdb&wsTime=1673019503",
      "previewDurationms": 4000,
      "hasRelatedGameAd": false,
      "markTypes": null,
      "relateSong": [
      {
      "name": "Snow In California",
      "id": 28111224,
      "pst": 0,
      "t": 0,
      "ar": [
      {
      "id": 48161,
      "name": "Ariana Grande",
      "tns": [],
      "alias": []
      }
      ],
      "alia": [],
      "pop": 100,
      "st": 0,
      "rt": "",
      "fee": 1,
      "v": 20,
      "crbt": null,
      "cf": "",
      "al": {
      "id": 2709012,
      "name": "Christmas Kisses",
      "picUrl": "http://p3.music.126.net/JPTW7SylI5VVBLeC2AjpAA==/109951166582656118.jpg",
      "tns": [],
      "pic_str": "109951166582656118",
      "pic": 109951166582656110
      },
      "dt": 207000,
      "h": {
      "br": 320000,
      "fid": 0,
      "size": 8311434,
      "vd": -46449
      },
      "m": {
      "br": 192000,
      "fid": 0,
      "size": 4986987,
      "vd": -46449
      },
      "l": {
      "br": 128000,
      "fid": 0,
      "size": 3324763,
      "vd": -46449
      },
      "a": null,
      "cd": "1",
      "no": 3,
      "rtUrl": null,
      "ftype": 0,
      "rtUrls": [],
      "djId": 0,
      "copyright": 1,
      "s_id": 0,
      "mst": 9,
      "rtype": 0,
      "rurl": null,
      "cp": 7003,
      "mv": 375342,
      "publishTime": 1356969600000,
      "privilege": {
      "id": 28111224,
      "fee": 1,
      "payed": 0,
      "st": 0,
      "pl": 0,
      "dl": 0,
      "sp": 0,
      "cp": 0,
      "subp": 0,
      "cs": false,
      "maxbr": 320000,
      "fl": 0,
      "toast": false,
      "flag": 260,
      "preSell": false
      }
      }
      ],
      "relatedInfo": null,
      "videoUserLiveInfo": null,
      "vid": "7E9342E47926F4474C463A251DBFC572",
      "durationms": 166160,
      "playTime": 42193,
      "praisedCount": 51,
      "praised": false,
      "subscribed": false
      }
      }
      ]
      let videoPlayList=this.data.videoPlayList
      videoPlayList.push(...newVideoList)
    this.setData({
      videoPlayList
    })
      
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("下拉了")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage({from}) {
    console.log(from)
    if(from=='menu'){
      return{
        title:'右上角的歌曲分享',
        path:'pages/video/video',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }else if(from=='button'){
      return{
        title:'按钮的歌曲分享',
        path:'pages/video/video',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }
  
  }
})