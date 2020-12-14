import './css/test1.css'
import img1 from './assets/1.jpg'

var img = new Image();
img.src = img1;
document.getElementById('mydiv').appendChild(img)

var  name = 'webpack'
console.log(name)