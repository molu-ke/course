// miniprogram/pages/course/course.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloudImgUrl:''
  },

  onLoad: function (options) {
    // 云函数调用
    wx.cloud.callFunction({
      name:'add',
      complete: res => {
        // console.log(res)
      }
    })

    // 操作数据库
    // 初始化数据库
    const db = wx.cloud.database()
    // 获取要操作数据库的引用
    const todos = db.collection('todos')

    // 插入数据
    // todos.add({
    //   // data字段表示需要新增的json数据
    //   data:{
    //     description:'learn cloud database',
    //     due:new Date('2019-10-10')
    //   },
    //   success:function(res){
    //     console.log(res)
    //   }
    // })


    // 获取数据
    // todos.doc('e62469b25fb6473c000f44370830b384').get({
    //   complete:function(res) {
    //     console.log(res)
    //   }
    // })

    // 通过条件查找数据
    // todos.where({'done':true}).get({
    //   complete(res){
    //     console.log(res)
    //   }
    // })

    // 修改数据
    // todos.doc('e62469b25fb6473c000f44370830b384').update({
    //   data:{
    //     description:"我是修改的数据"
    //   },
    //   complete:function(res) {
    //     console.log(res)
    //   }
    // })
  
    // 删除数据
  },

  // 上传图片
  uploadImg(){
    let _this = this
    wx.chooseImage({
      success: (res) => {
        wx.cloud.uploadFile({
          cloudPath:'a.png',// 上传到云端的路径
          filePath:res.tempFilePaths[0],
          success(res){
            console.log(res)
            _this.data.cloudImgUrl = res.fileID
          }
        })
      }
    })
  },

  // 下载图片
  download(){
    wx.cloud.downloadFile({
      fileID:this.data.cloudImgUrl,
      success(res){
        console.log(res)
      }
    })
  },

   // 删除图片
   deleteData(){
    wx.cloud.deleteFile({
      fileList:[this.data.cloudImgUrl],
      success(res){
        console.log(res)
      }
    })
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