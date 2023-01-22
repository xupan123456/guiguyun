import request from '../../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment';

const appInstance = getApp()
// pages/songDetail/songDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    Music: [], //音乐有关数据
    MusicUrl: '', //音乐的链接
    MusicId: '',  //音乐的Id
    currentTime:'0:00', //实时的时间
    durationTime:'', //总时间
    currentWidth:0  //进度条宽度
  },
  //点击播放
  handlerMusicPlay() {
    let isPlay = !this.data.isPlay  //修改播放状态
    this.musicControl(isPlay)
  },
  //点击播放
async  musicControl(isPlay) {
     //获取歌曲的url

   await this.getSongUrl()
    
    let { MusicUrl, Music } = this.data
  
  
    if (isPlay) {
      this.backgroundAudioManager.src = MusicUrl
      this.backgroundAudioManager.title = Music.name
    } else {
      this.backgroundAudioManager.pause()
    }
   
  },

  //获取音乐的播放地址
  async getSongUrl() {
    let SongUrlData = await request('/song/url', { id: this.data.MusicId })
   
    this.setData({
      MusicUrl: SongUrlData.data[0].url
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //options专门用来接收路由跳转传参
  async getSongInfo(MusicId) {
    let MusicData = await request('/song/detail', { ids: MusicId })
    let durationTime=moment(MusicData.songs[0].dt).format('mm:ss')
    this.setData({
      Music: MusicData.songs[0],
      MusicId:MusicId,
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.Music.name
    })
  },
  async onLoad(options) {
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    //原生小程序中路由传参，参数长度有限制，如果参数长度过长会自动截取掉
    let MusicId = options.MusicId
    this.getSongInfo(MusicId)

    
    /*问题：如果用户操作系统的控制音乐播放/暂停的按钮,页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
    1.通过控制音频的实例backgroundAudioManager去监视音乐播放/暂停
    */

    //判断当前页面音乐是否在播放
    if (appInstance.GroupData.MusicPlay && appInstance.GroupData.MusicId === MusicId) {
      //修改当前音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }
    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true
      })
      appInstance.GroupData.MusicPlay = true
      appInstance.GroupData.MusicId = MusicId

    })

    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      appInstance.GroupData.MusicPlay = false
      //由于上面必定是先播放后停止所以省略 appIstance.GroupData.MusicPlay=false

    })
    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false
      })
      appInstance.GroupData.MusicPlay = false
    })
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
      // console.log(this.backgroundAudioManager.currentTime)
      // console.log(this.backgroundAudioManager.duration)
      let currentWidth=this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
     
      this.setData({
        currentTime,
        currentWidth
      })
    });
    this.backgroundAudioManager.onEnded(()=>{
      //自动切换到下一首,自动播放
      PubSub.publish('SwitchType','before')
      //进度条置为0
      this.setData({
        currentWidth:0,
        currentTime:'0'
      })
    });
  },
  handlerSwitch(event) {
    let type = event.currentTarget.id
    PubSub.subscribe('SwitchId', (msg, MusicId) => {
      this.setData({
        MusicId
      })

      this.getSongInfo(MusicId)
     
      this.musicControl(true)
      PubSub.unsubscribe('SwitchId')
    })
    //消息发布，把点击了按钮传给推荐页
    PubSub.publish('SwitchType', type)

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})