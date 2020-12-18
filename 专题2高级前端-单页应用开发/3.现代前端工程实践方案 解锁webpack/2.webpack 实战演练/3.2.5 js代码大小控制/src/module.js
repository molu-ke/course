
// tree-shaking 支持的写法
export const a = () => [
    console.log('i am a')
]

export const b = () => [
    console.log('i am b')
]

// export default {
//     a:function(){
//         console.log('i am a')
//     },
//     b:function(){
//         console.log('i am b')
//     },
// }