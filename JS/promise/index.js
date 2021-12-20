console.log('script start')
// script start , async2 end,Promise，script end，async2 end1，promise1，async1 end，promise2
async function async1() {
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2 end')
    return Promise.resolve().then(()=>{     // 微1
        console.log('async2 end1')
    })
}
async1()

setTimeout(function() {
    console.log('setTimeout')   // 宏1
}, 0)

new Promise(resolve => {
    console.log('Promise')
    resolve()
})
    .then(function() {
        console.log('promise1') // 微2
    })
    .then(function() {
        console.log('promise2')
    })

console.log('script end')
