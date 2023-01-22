// pages/login/login.js
// 登录页流程
// 1.收集表单项数据
// 2.前端验证
//   (1)验证用户信息(账号,密码)是否合法，
//   (2)前端验证不通过就提示用户，不要发请求给后端
//   (3)前端验证通过，发请求给服务器端
// 3.后端验证
//   (1)验证用户是否存在
//   (2)用户不存在直接返回，告诉前端用户不存在
//   (3)用户存在需要验证密码是否正确
//   (4)密码不正确返回给前端提示密码不正确

import request from "../../utils/request"

//   (5)密码正确返回给前端数据，提示用户登陆成功
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    password:"",
  },
  handleInput(event){
    // let type=event.currentTarget.id --通过设置输入框的id,可以通过event.currentTarget.id获取是哪个输入框    phone||password两个输入框
    let type=event.currentTarget.dataset.type
    this.setData({
      [type]:event.detail.value  //[变量]--不确定是哪个经行赋值
    })
  },
  async login(){
    //前端验证  ---输入格式是否正确
    let {phone,password}=this.data
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon:'none'
      })
      return  //直接打断，不再往下执行
    }
    let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式不正确，请重新输入',
        icon:'none'
      })
      return  //直接打断，不再往下执行
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:"none"
      })
    }

    //后端验证--是否存在数据库中
    //由于登陆不上，只能用其他接口
    let codeData=await request('/login/cellphone',{phone,password,isLogin:true})
    if(codeData.code===200){
      wx.showToast({
        title: '登陆成功',
      })
      //跳转到个人中心页
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
      //将用户信息存储在本地
      wx.setStorageSync('userInfo',JSON.stringify(codeData.profile))
    }else if(codeData.code==400){
      wx.showToast({
        title: '账号错误',
        icon:'none'
      })
    }else if(codeData.code==502){
      wx.showToast({
        title: '密码错误',
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '登陆失败，请重新登陆',
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
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