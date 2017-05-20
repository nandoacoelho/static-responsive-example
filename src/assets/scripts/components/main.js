(function () {
    var slider = document.querySelector('.neon-carousel'),
        slideCount = slider.querySelectorAll('.neon-carousel__slides__item').length,
        slideWidth = slider.querySelector('.neon-carousel__slides__item').clientWidth,
        slideHeight = slider.querySelector('.neon-carousel__slides__item').clientHeight,
        sliderUl = slider.querySelector('.neon-carousel__slides'),
        lastSlide = slider.querySelector('.neon-carousel__slides__item:last-child'),
        leftArrow = document.querySelector('.neon-carousel__nav-left'),
        rightArrow = document.querySelector('.neon-carousel__nav-right'),
        sliderUlWidth = slideCount * slideWidth,
        start = '';

    slider.style.width = slideWidth + 'px';
    slider.style.height = slideHeight + 'px';
    sliderUl.style.width = sliderUlWidth + 'px';
    sliderUl.style.marginLeft = - slideWidth + 'px';
    sliderUl.prepend(lastSlide);

    function init() {
        leftArrow.addEventListener('click', moveLeft);

        rightArrow.addEventListener('click', moveRight);
    }

    init();

    function moveLeft(event) {
        event.preventDefault();

        var lastSlide = document.querySelector('.neon-carousel__slides__item:last-child');

        animate({
            duration: 300,
            timing(timeFraction) {
                return timeFraction;
            },
            draw(progress) {
                sliderUl.style.left = + progress * slideWidth + 'px';
                if (progress === 1) {
                    sliderUl.prepend(lastSlide);
                }
            }
        });

    }

    function moveRight(event) {
        event.preventDefault();

        var firstSlide = document.querySelector('.neon-carousel__slides__item:first-child');
        animate({
            duration: 300,
            timing(timeFraction) {
                return timeFraction;
            },
            draw(progress) {
                sliderUl.style.left = - progress * slideWidth + 'px';
                if (progress === 1) {
                    sliderUl.append(firstSlide);
                }
            }
        });

    }

    function animate({duration, draw, timing}) {
        let start = performance.now();

        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = timing(timeFraction);

            draw(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }

        });
    }
})();