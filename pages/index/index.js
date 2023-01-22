// index.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    personRecommandList:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //轮播图
    let bannerListData=await request('/banner',{type:2});
   this.setData({
    bannerList:bannerListData.banners,
   })
   //为你推荐
   let personRecommandListData=await request('/personalized',{limit:10});
   this.setData({
    personRecommandList:personRecommandListData.result
   })
   //排行榜
//    需求分析
//      1.需要根据idx的值获取相对应的数据
//      2.idx的取值是0-20，我们需要0-4
//      3.发送5次请求
   let index=0;
   let resultArray=[]
    while(index<5){
        let topListData=await request('/top/list',{idx:index++});
        //splice会修改原数组 slice不会修改原数组
        let topListItem={name:topListData.playlist.name,track:topListData.playlist.tracks.slice(0,3)}
        resultArray.push(topListItem)
        this.setData({
            topList:resultArray
           })
    }   
  },
  toRecommand(){
    wx.navigateTo({
      url: '/songPackage/pages/recommand/recommand',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})