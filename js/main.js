'use strict';

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '764f5f90718a44fc2bcf08b2dd691ef7';

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal');


const DBService = class {
  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`)
    }
  }

  getTestData = () => {
    return this.getData('test.json');
  }
};

const renderCard = response => {
  tvShowsList.textContent = '';

  response.results.forEach(item => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote
    } = item;

    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

    const card = document.createElement('li');
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" class="tv-card">
          ${voteElem}
          <img class="tv-card__img"
              src="${posterIMG}"
              data-backdrop="${backdropIMG}" alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    tvShowsList.append(card);
  });


}

new DBService().getTestData()
  .then(renderCard);

// открытие/закрытие меню
hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

leftMenu.addEventListener('click', () => {
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

// функция для смены картинки карточки
const changeImage = event => {
  const tvCard = event.target.closest('.tv-card');
  if (!tvCard) return;

  const tvCardImg = tvCard.querySelector('.tv-card__img');

  if (tvCardImg.dataset.backdrop) {
    [tvCardImg.src, tvCardImg.dataset.backdrop] = [tvCardImg.dataset.backdrop, tvCardImg.src];
  }
};

// при наведении на мышки на карточку, заменяет картинку
tvShowsList.addEventListener('mouseover', changeImage);

// при выходу мышки с карточки заменяет на начальную картинку
tvShowsList.addEventListener('mouseout', changeImage);

// открытие модального окна
tvShowsList.addEventListener('click', event => {
  event.preventDefault(); // отключает прокрутку страницы вверх при клике на карточку
  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
  }
});

// закрытие модального окна
modal.addEventListener('click', event => {
  const target = event.target;
  if (target.classList.contains('modal') || target.closest('.cross')) {
    modal.classList.add('hide');
    document.body.style.overflow = '';
  }
});