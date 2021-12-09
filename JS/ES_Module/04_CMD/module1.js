define(function (require, exports, module) {
    let count = 0;

    function addCount() {
        count++;
    }

    function getCount() {
        return count;
    }

    module.exports = {addCount, getCount};
})
