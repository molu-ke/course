module.exports = ( ...reset ) => {
    let sum = 0
    for( let n of reset) {
        sum += n
    }
    return sum
}