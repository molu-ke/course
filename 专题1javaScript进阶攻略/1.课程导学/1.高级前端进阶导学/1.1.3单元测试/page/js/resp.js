// 测试责任链
let chains = []

function approve(req) {
    let index = 0
    let next = () => {
        let func = chains[index]
        index ++ 
        if(!!func) {
            return func(req,next)
        }
    }
    return next()
}

function def(func) {
    chains.push(func)
}

def( (req,next) => {
    if(req.amount < 5 ){
        return '主任审批通过'
    } else {
        return next()
    }
})

def( (req,next) => {
    let amount = req.amount;
    if( 5 <= amount && amount < 10 ){
        return '副董事长审批通过'
    } else {
        return next()
    }
})

def( (req,next) => {
    let amount = req.amount;
    if( 10 <= amount && amount < 50 ){
        return '董事长审批通过'
    } else {
        return next()
    }
})

def( (req,next) => {
    let amount = req.amount;
    if( amount >= 50 ){
        return '董事会审批通过'
    } else {
        return next()
    }
})

def( (req,next) => {
    let ok = next()
    if( !ok ){
        return `无人可审批此金额[${req.amount}]采购单`
    }
})

export { approve }