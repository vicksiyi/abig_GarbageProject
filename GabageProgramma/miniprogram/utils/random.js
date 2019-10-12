/**
 * 函数节流(防重)
 * @param {*} minNum 最小值
 * @param {*} maxNum 最大值
 */
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

module.exports = {
    randomNum: randomNum
}