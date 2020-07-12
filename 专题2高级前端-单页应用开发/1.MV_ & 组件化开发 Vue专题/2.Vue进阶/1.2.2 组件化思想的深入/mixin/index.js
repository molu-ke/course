// 组件混入
export default {

    data(){
        return {
            mixinData:'混入',
            common:'共同数据--混入'
        }
    },

    created(){
        console.log('这是混入的钩子函数')
    },

    methods:{
        mixinFun(){
            console.log('混入函数')
        },
        commonFun(){
            console.log('共同函数--混入')
        }
    }
}
