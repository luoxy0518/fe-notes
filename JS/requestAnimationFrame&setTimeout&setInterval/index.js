(function () {
    const oBox = document.getElementsByClassName('box')[0];
    let animationId;

    oBox.addEventListener('click', function () {
        if (animationId) return cancelAnimation(animationId);

        startAnimation(oBox);
    });

    function startAnimation(element, time) {
        console.log(time);
        element.style.left = parseInt(window.getComputedStyle(element).getPropertyValue("left")) + 1 + 'px';
        animationId = requestAnimationFrame((perfomaceTime) => startAnimation(element,perfomaceTime))
    }

    function cancelAnimation(animationId){
        cancelAnimationFrame(animationId);
        return animationId = null;
    }
})(window, document)
