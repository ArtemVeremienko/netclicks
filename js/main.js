'use strict';

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = '764f5f90718a44fc2bcf08b2dd691ef7';

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  tvShows = document.querySelector('.tv-shows'),
  tvShowsHead = tvShows.querySelector('.tv-shows__head'),
  tvCardImg = document.querySelector('.tv-card__img'),
  modalTitle = document.querySelector('.modal__title'),
  genresList = document.querySelector('.genres-list'),
  rating = document.querySelector('.rating'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  searchForm = document.querySelector('.search__form'),
  searchFormInput = searchForm.querySelector('.search__form-input'),
  preloader = document.querySelector('.preloader'),
  dropdown = document.querySelectorAll('.dropdown');

const loading = document.createElement('div');
loading.className = 'loading';


class DBService {
  getData = async (url) => {
    tvShows.append(loading); // добавляет прелоадер для всех запросов
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`);
    }
  }

  getTestData = () => this.getData('test.json');

  getTestCard = () => this.getData('card.json');

  getSearchResult = query => this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);

  getTvShow = id => this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);

  getFiltered = filter => this.getData(`${SERVER}/tv/${filter}?api_key=${API_KEY}&language=ru-RU`);
}

const renderCard = (response, target) => {
  const { results } = response;

  tvShowsList.textContent = '';

  if (results.length) {
    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
    results.forEach(item => {
      const {
        backdrop_path: backdrop,
        name: title,
        poster_path: poster,
        vote_average: vote,
        id
      } = item;

      const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
      const backdropIMG = backdrop ? IMG_URL + backdrop : '';
      const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

      const card = document.createElement('li');
      card.idTV = id;
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
      loading.remove();
      tvShowsList.append(card);
    });
  } else {
    loading.remove();
    tvShowsHead.textContent = 'По вашему запросу сериалов не найдено 😢';
  }


}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  if (value) {
    searchFormInput.value = '';
    new DBService().getSearchResult(value).then(renderCard);
  }
});

// начальная страница с карточками
new DBService().getTestData().then(renderCard);


// закрытие пунктов меню
const closeDropdown = () => dropdown.forEach(item => item.classList.remove('active'));

// открытие/закрытие меню
hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
  closeDropdown();
});

document.addEventListener('click', event => {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
    closeDropdown();
  }
});

leftMenu.addEventListener('click', event => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest('.dropdown');

  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }

  if (target.closest('#top-rated')) {
    new DBService().getFiltered('top_rated').then(response => renderCard(response, target));
  } else if (target.closest('#popular')) {
    new DBService().getFiltered('popular').then(response => renderCard(response, target));
  } else if (target.closest('#week')) {
    new DBService().getFiltered('on_the_air').then(response => renderCard(response, target));
  } else if (target.closest('#today')) {
    new DBService().getFiltered('airing_today').then(response => renderCard(response, target));
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
    preloader.style.display = 'block'; // показать прелоадер при рендеринге модалки
    new DBService()
      .getTvShow(card.parentElement.idTV) // поднимаемся к элементу списка li
      .then(data => {
        const {
          poster_path,
          name,
          genres,
          vote_average,
          overview,
          homepage
        } = data;

        tvCardImg.src = poster_path ? IMG_URL + poster_path : 'img/no-poster.jpg';
        tvCardImg.alt = name;
        modalTitle.textContent = name;
        genresList.textContent = '';
        genres.forEach(item => genresList.innerHTML += `<li>${item.name}</li>`);
        rating.textContent = vote_average;
        description.textContent = overview;
        modalLink.href = homepage;
      })
      .then(() => {
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
      })
      .finally(() => preloader.style.display = 'none');
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