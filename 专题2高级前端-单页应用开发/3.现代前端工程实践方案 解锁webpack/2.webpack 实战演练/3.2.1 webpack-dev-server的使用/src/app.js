import "./test.css"
import "./test2.css"
import $ from 'jquery'


$.ajax({
    url:'/smartSpec/detail/1001472002.htm',
    type:'POST',
    success:function(res){
        console.log(res)
    }
})

console.log(1)