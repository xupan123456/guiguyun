// pages/recommand/recommand.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    songList: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageInfoSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    } else {
      this.getSongList()
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    })
    //消息的订阅---获得音乐详情页的上一首、下一首
    PubSub.subscribe('SwitchType', (msg, type) => {

      let { songList, index } = this.data
      if (type === 'before') {
        (index === 0) && (index = songList.length);
        index -= 1

      } else {
        (index === songList.length - 1) && (index = -1);
        index += 1

      }
      this.setData({
        index
      })
      let MusicId = songList[index].id
   
      //消息的发布--将id给音乐详情页

      PubSub.publish('SwitchId', MusicId)
    })


  },
  async getSongList() {
    let songListData = await request("/recommend/songs")
    this.setData({
      songList: songListData.data.dailySongs
    })
  },
  handlerQuery(event) {
    let { song, index } = event.currentTarget.dataset
    this.setData({
      index
    })

    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?MusicId=' + song.id
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