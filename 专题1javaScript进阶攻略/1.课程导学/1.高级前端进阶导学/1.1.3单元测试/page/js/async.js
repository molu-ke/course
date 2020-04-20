export default {

    getDataCallback:callback => {
        $.ajax({
            url:'https://jy.xixi.top/schoolservice/api/v1/schoolAdmin/common/listRegion',
            success:callback
        })
     },

     getDataPost:callback => {
        $.post(
            'https://jy.xixi.top/schoolservice/api/v1/schoolAdmin/common/listRegion',
            callback
        )
     },

     
     getDataAaync: async () => {
        return $.ajax({
            url:'https://jy.xixi.top/schoolservice/api/v1/schoolAdmin/common/listRegion',
            success: data => {
                return data
            }
        })
     }  

}