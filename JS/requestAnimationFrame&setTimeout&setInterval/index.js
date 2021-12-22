(function (window, document) {
    const oBox = document.getElementsByClassName('box')[0];
    let animationId;

    oBox.addEventListener('click', function () {
        animationId ? cancelAnimation() : startAnimation(oBox);
    });

    /**
     * 开始运动
     * @param element dom元素
     */
    function startAnimation(element) {
        element.style.left = parseInt(window.getComputedStyle(element).getPropertyValue("left")) + 1 + 'px';
        animationId = requestAnimationFrame(() => startAnimation(element))
    }

    /**
     * 取消运动
     */
    function cancelAnimation() {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
})(window, document);
