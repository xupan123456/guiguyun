// pages/search/search.js
import request from '../../utils/request'
let isSend = false //函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolder: '', //搜索框默认值
    HotList: [],   //热搜榜表单
    searchInput: '', //用户输入
    searchList: [] ,//搜索列表
    historyList:[]  //历史记录列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.getInitInfo()
    this.getHotList()
    this.getHistoryList()
  },
  async getInitInfo() {
    let placeHolderData = await request('/search/default')
    this.setData({
      placeHolder: placeHolderData.data.showKeyword
    })
  },
  async getHotList() {
    let HotListData = await request('/search/hot/detail')
    this.setData({
      HotList: HotListData.data
    })
  },
  handlerInput(event) {
    let searchInput = event.detail.value.trim()
    this.setData({
      searchInput
    })
    if (isSend) {
      return
    }
    isSend = true;
    this.getSearchList()
    //函数节流
    setTimeout(() => {
      isSend = false
      this.getSearchList()
    }, 300);

  },
  //获取搜索的功能函数
  async getSearchList() {
    let {historyList}=this.data
    if(!this.data.searchInput){
      this.setData({
        searchList:""
      })
      return 
    }
    let SearchListData = await request('/search', { keywords: this.data.searchInput, limit: 10 })
    this.setData({
      searchList: SearchListData.result.songs
    })
    if(historyList.indexOf(this.data.searchInput)!==-1){
      historyList.splice(historyList.indexOf(this.data.searchInput),1)
    }
    
      historyList.unshift(this.data.searchInput)
  
    this.setData({
      historyList
    })
    wx.setStorageSync('historyList',historyList)
  },
  getHistoryList(){
  let historyList= wx.getStorageSync('historyList')
    if(historyList){
      this.setData({
        historyList
      })
    }
  },
  clearSearchInput(){
    this.setData({
      searchInput:"",
      searchList:[]
    })
  },
  deleteHistory(){
    wx.showModal({
      title: '',
      content: '确认删除吗？',
      complete: (res) => {
        if (res.cancel) {
        }
    
        if (res.confirm) {
          this.setData({
            historyList:[]
           })
           // 去除本地
           wx.removeStorageSync('historyList')
        }
      }
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