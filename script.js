'use strict'

let pageSlider = new Swiper('.slider', {
    speed: 1000, 
    scrollbar:{
        el: ".slider__scrollbar",
        draggable: true 
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

// Получение главного контейнера страницы и всех изображений слайдов
const page = document.querySelector('.page')
const images = document.querySelectorAll('.slide__picture')

// Проверка, есть ли изображения
if(images.length) {
    let backgroundSlides = ``; 
    let textSlides = ``; 

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
        effect:"fade", 
        fadeEffect: {
            crossFade: true 
        },
        speed: 500 
     })

    //Связываем управление слайдерами: основной слайдер управляет фоном, а фон управляет текстом
     pageSlider.controller.control = pageBgSlider
     pageBgSlider.controller.control = pageTextSlider
}
// Константа для скорости анимации открытия и закрытия изображения
const speed = 800
// Слушаем клики на странице
document.addEventListener("click", function(e){
    const targetElement = e.target
    const textBlock = document.querySelector('.text') 
    textBlock.style.transitionDuration = `${speed}ms`

    // Открытие изображения при клике на слайд
    if(targetElement.closest('.slide')){
        const slide = targetElement.closest('.slide') // Текущий слайд
        const slideImage = slide.querySelector('img') 
        const activeImage = document.querySelector('.slide__picture.active')

        if(slide.classList.contains('swiper-slide-active')){ // Если слайд активен
            slideImage.classList.add('active') 
            textBlock.classList.add('active') 
            imageOpen(slideImage) // Запускаем анимацию открытия изображения
        } else {
            activeImage ? activeImage.classList.remove('active') : null
            pageSlider.slideTo(getIndex(slide)) 
        }
        e.preventDefault()//Предотвращаем действие по умолчанию (например, перезагрузку страницы)
    }

    // Закрытие открытого изображения при клике
    if(targetElement.closest('.open-image')){
        const openImage = targetElement.closest('.open-image') 
        const activeImage = document.querySelector('.slide__picture.active') 
        const imagePos = getImagePos(activeImage) 

         // Анимация возврата изображения в начальное положение
        openImage.style.cssText = `
          position:fixed;
          left:${imagePos.left}px;
          top:${imagePos.top}px;
          width:${imagePos.width}px;
          height:${imagePos.height}px;
          transition: all ${speed}ms;
          z-index:10;
        `;
       // Убираем открытое изображение после завершения анимации
        setTimeout(()=> {
            activeImage.classList.remove('active')
            activeImage.style.opacity = 1;
            openImage.remove()
        }, speed)
       
        textBlock.classList.remove('active')
    }
})

// Получение индекса элемента в его родительском контейнере
function getIndex(el){
    return Array.from(el.parentNode.children).indexOf(el)
}

// Функция открытия изображения на весь экран
function imageOpen(image){
    const imagePos = getImagePos(image)//Получаем текущие координаты изображения

    const openImage = image.cloneNode() //Клонируем изображение
    const openImageBlock = document.createElement('div')
    openImageBlock.classList.add('open-image') 
    openImageBlock.append(openImage) 
    
    //Устанавливаем стили для открытого изображения (в начальном положении)
    openImageBlock.style.cssText = `
      position: fixed;
      left:${imagePos.left}px;
      top:${imagePos.top}px;
      width:${imagePos.width}px;
      height:${imagePos.height}px;
      transition: all ${speed}ms;
      z-index:10;
    `;

    document.body.append(openImageBlock)//Вставляем контейнер с открытым изображением в DOM
   // Анимация увеличения изображения на весь экран
    setTimeout(()=> {
        image.style.opacity = 0;
        openImageBlock.style.left = 0;
        openImageBlock.style.top = 0;
        openImageBlock.style.width = '100%';
        openImageBlock.style.height = '100%';
    }, 0)
}

//Функция для получения позиции изображения (координаты и размеры)
function getImagePos(image){
    return {
        left: image.getBoundingClientRect().left,
        top: image.getBoundingClientRect().top,
        width: image.offsetWidth,
        height: image.offsetHeight
    }
}