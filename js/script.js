
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
          
    function hideTabContent() {
        tabsContent.forEach(tab => {
            tab.style.display = 'none';
            // tab.classList.add('hide');
            // tab.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        // tabsContent[i].classList.add('show', 'fade');
        // tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((tab, i) => {
                if (target == tab){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer
    const deadline = '2020-04-10';

    function getTimeRemaning(time){
        let days = 0, hours = 0, minutes = 0, seconds = 0;

        const mls = Date.parse(time) - Date.parse(new Date());
        
        if (mls >= 0){
            days = Math.floor(mls / (1000 * 60 * 60 * 24)),
            hours = Math.floor((mls / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((mls / (1000 * 60)) % 60),
            seconds = Math.floor((mls / 1000) % 60);
        }

        return {total: mls, days, hours, minutes, seconds};
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = document.querySelector('#days'),
              hours = document.querySelector('#hours'),
              minutes = document.querySelector('#minutes'),
              seconds = document.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function addZero(value){
            return (value <= 9) ? `0${value}` : value;
        }

        function updateClock() {
            const mls = getTimeRemaning(endtime);

            days.innerHTML = addZero(mls.days);
            hours.innerHTML = addZero(mls.hours);
            minutes.innerHTML = addZero(mls.minutes);
            seconds.innerHTML = addZero(mls.seconds);

            if (tabs.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');

    function closeModal() {
        // modal.classList.remove('show');
        // modal.classList.add('hide');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function openModal() {
        // modal.classList.add('show');
        // modal.classList.remove('hide');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal){
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code == 'Escape' && modal.style.display == 'block') {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 200000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
    
    // Class for cards

    class MenuCard {
        constructor(src, alt, subTitle, desc, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.subTitle = subTitle;
            this.desc = desc;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
        }

        render() {
            const newElem = document.createElement('div');

            this.classes = (this.classes.length === 0) ? ['menu__item'] : this.classes;

            this.classes.forEach(className => {
                newElem.classList.add(className);
            });

            newElem.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.subTitle}</h3>
                    <div class="menu__item-descr">${this.desc}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(newElem);
        }
    }

    new MenuCard(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        230,
        '.menu .container'
    ).render();

    new MenuCard(
        'img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        550,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        430,
        '.menu .container',
        'menu__item'
    ).render();

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'loading...',
        success: 'Thanks. We will contact you soon.',
        failure: 'Something is wrong.'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form){
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'multipart/form-data');
            const formData = new FormData(form);

            request.send(formData);

            request.addEventListener('load', () => {
                if (request.status === 200){
                    statusMessage.textContent = message.success;
                }else{
                    statusMessage.textContent = message.failure;
                }
            });
        });
    }
});