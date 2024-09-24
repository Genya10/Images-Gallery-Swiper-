'use strict'

let pageSlider = new Swiper('.slider', {
    speed: 1000, //скорость переключения слайдов(в миллисекундах)
    scrollbar:{
        el: ".slider__scrollbar",//элемент для ползунка (scrollbar)
        draggable: true //Разрешает перетаскивать ползунок для изменения слайдов вручную
    }
})
