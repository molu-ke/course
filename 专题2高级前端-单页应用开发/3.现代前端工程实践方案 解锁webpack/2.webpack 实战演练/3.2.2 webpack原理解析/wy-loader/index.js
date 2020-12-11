module.exports = function(resource){
    console.log(resource)
    return resource.replace('c','console.log')
}