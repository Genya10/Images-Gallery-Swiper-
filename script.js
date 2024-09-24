'use strict'

let pageSlider = new Swiper('.slider', {
    speed: 1000, //скорость переключения слайдов(в миллисекундах)
    scrollbar:{
        el: ".slider__scrollbar",//элемент для ползунка (scrollbar)
        draggable: true //Разрешает перетаскивать ползунок для изменения слайдов вручную
    },

    breakpoints:{
        "320":{
            slidesPerView:1,
            centeredSlides: false
        },
        "992":{
            slidesPerView: 2,
            centeredSlides: true
        }
    }
})

const page = document.querySelector('.page')
const images = document.querySelectorAll('.slide__picture')

if(images.length) {
    let backgroundSlides = ``;
    let textSlides = ``;

    images.forEach(image => {
        backgroundSlides += `
        <div class="background__slide swiper-slide">
         <div class="background__image">
          <img src="${image.getAttribute('src')}" alt="${image.alt}"/>
         </div>
        </div>
        `;
        textSlides += `
        <div class="text__slide swiper">
          <span>${image.dataset.title ? image.dataset.title : ``}</span>
        </div>
        `;
    });

    const background = `
     <div class="background swiper">
      <div class="background__wrapper swiper-wrapper">
        ${backgroundSlides}
      </div>
     </div>
     `;

     const text = `
     <div class="text swiper">
      <div class="text__wrapper swiper-wrapper">
        ${textSlides}
      </div>
     </div>
     `;
}