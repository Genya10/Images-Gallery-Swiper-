'use strict'

let pageSlider = new Swiper('.slider', {
    speed: 1000, //скорость переключения слайдов(в миллисекундах)
    scrollbar:{
        el: ".slider__scrollbar",//элемент для ползунка (scrollbar)
        draggable: true //Разрешает перетаскивать ползунок для изменения слайдов вручную
    },

    breakpoints:{ // Настройки для ширины экрана 320px
        "320":{
            slidesPerView:1, // Показывать 1 слайд за раз
            centeredSlides: false // Слайды не центрируются
        },
        "992":{
            slidesPerView: 2,
            centeredSlides: true
        }
    }
})

// Получение главного контейнера страницы и всех изображений слайдов
const page = document.querySelector('.page')
const images = document.querySelectorAll('.slide__picture')

// Проверка, есть ли изображения
if(images.length) {
    let backgroundSlides = ``; // Переменная для фона слайдов
    let textSlides = ``; // Переменная для текста слайдов

    // Проходим по каждому изображению и создаем HTML-контент для фона и текста слайдов
    images.forEach(image => {
        backgroundSlides += `
        <div class="background__slide swiper-slide">
         <div class="background__image">
          <img src="${image.getAttribute('src')}" alt="${image.alt}"/>
         </div>
        </div>
        `;
        textSlides += `
        <div class="text__slide swiper-slide">
          <span>${image.dataset.title ? image.dataset.title : ``}</span>
        </div>
        `;
    });

    // Создаем HTML для фона и вставляем его в начало страницы
    const background = `
     <div class="background swiper">
      <div class="background__wrapper swiper-wrapper">
        ${backgroundSlides}
      </div>
     </div>
     `;

      // Создаем HTML для текста и вставляем его в конец страницы
     const text = `
     <div class="text swiper">
      <div class="text__wrapper swiper-wrapper">
        ${textSlides}
      </div>
     </div>
     `;

     page.insertAdjacentHTML("afterbegin", background)
     page.insertAdjacentHTML("beforeend", text)

     // Инициализация слайдера для фона
     let pageBgSlider = new Swiper('.background', {
        speed: 500
     })
     // Инициализация слайдера для текста
     let pageTextSlider = new Swiper('.text', {
        effect:"fade", // Анимация плавного исчезновения/появления
        fadeEffect: {
            crossFade: true // Плавное перекрытие при смене слайда
        },
        speed: 500 // Скорость переключения слайдов для текста
     })

      // Связываем управление слайдерами: основной слайдер управляет фоном, а фон управляет текстом
     pageSlider.controller.control = pageBgSlider
     pageBgSlider.controller.control = pageTextSlider
}
// Константа для скорости анимации открытия и закрытия изображения
const speed = 800
// Слушаем клики на странице
document.addEventListener("click", function(e){
    const targetElement = e.target // Элемент, на который кликнули
    const textBlock = document.querySelector('.text') // Блок текста
    textBlock.style.transitionDuration = `${speed}ms`//Устанавливаем длительность анимации текста

    // Открытие изображения при клике на слайд
    if(targetElement.closest('.slide')){
        const slide = targetElement.closest('.slide') // Текущий слайд
        const slideImage = slide.querySelector('img') // Изображение внутри слайда
        const activeImage = document.querySelector('.slide__picture.active')//Активное изображение

        if(slide.classList.contains('swiper-slide-active')){ // Если слайд активен
            slideImage.classList.add('active') //Добавляем класс "active" к изображению
            textBlock.classList.add('active') //Добавляем класс "active" к текстовому блоку
            imageOpen(slideImage)
        } else {
            activeImage ? activeImage.classList.remove('active') : null
            pageSlider.slideTo(getIndex(slide))
        }
        e.preventDefault()
    }

    //Close image
    if(targetElement.closest('.open-image')){
        const openImage = targetElement.closest('.open-image')
        const activeImage = document.querySelector('.slide__picture.active')
        const imagePos = getImagePos(activeImage)

        openImage.style.cssText = `
          position:fixed;
          left:${imagePos.left}px;
          top:${imagePos.top}px;
          width:${imagePos.width}px;
          height:${imagePos.height}px;
          transition: all ${speed}ms;
        `;

        setTimeout(()=> {
            activeImage.classList.remove('active')
            activeImage.style.opacity = 1;
            openImage.remove()
        }, speed)

        textBlock.classList.remove('active')
    }
})

function getIndex(el){
    return Array.from(el.parentNode.children).indexOf(el)
}
function imageOpen(image){
    const imagePos = getImagePos(image)

    const openImage = image.cloneNode()
    const openImageBlock = document.createElement('div')
    openImageBlock.classList.add('open-image')
    openImageBlock.append(openImage)

    openImageBlock.style.cssText = `
      position: fixed;
      left:${imagePos.left}px;
      top:${imagePos.top}px;
      width:${imagePos.width}px;
      height:${imagePos.height}px;
      transition: all ${speed}ms;
    `;

    document.body.append(openImageBlock)

    setTimeout(()=> {
        image.style.opacity = 0;
        openImageBlock.style.left = 0;
        openImageBlock.style.top = 0;
        openImageBlock.style.width = '100%';
        openImageBlock.style.height = '100%';
    }, 0)
}

function getImagePos(image){
    return {
        left: image.getBoundingClientRect().left,
        top: image.getBoundingClientRect().top,
        width: image.offsetWidth,
        height: image.offsetHeight
    }
}