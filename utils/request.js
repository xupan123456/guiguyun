//发送ajax请求
import config from "./config";
export default (url,data={},method='GET')=>{
    //1.new Promise实例状态时pending
    return new Promise((resolve,reject)=>{
        wx.request({
            url:config.moblieHost+url,
            data,
            method,
            header:{
              cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U')!==-1):''
            },
            success: (res)=>{
                  //console.log(res.data)
                if(data.isLogin){
                  wx.setStorage({
                    key:'cookies',
                    data:res.cookies
                  })
                }
                resolve(res.data) //resolve修改promise的状态为成功状态 resolved
            },
            fail: (err)=>{
                // console.log(err)
                reject(err) //reject修改promise的状态为是失败状态 rejected
            },
        });
    })
    
}