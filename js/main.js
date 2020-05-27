'use strict';

// меню
const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal')

let tempCardSrc; // для первоначального src картинок карточек

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

// при наведении на мышки на карточку, заменяет картинку
tvShowsList.addEventListener('mouseover', event => {
  const tvCard = event.target.closest('.tv-card');
  if (!tvCard) return;

  const tvCardImg = tvCard.querySelector('.tv-card__img');

  if (tvCardImg.dataset.backdrop) {
    tempCardSrc = tvCardImg.src;
    tvCardImg.src = tvCardImg.dataset.backdrop;
  }
});

// при выходу мышки с карточки заменяет на начальную картинку
tvShowsList.addEventListener('mouseout', event => {
  const tvCard = event.target.closest('.tv-card');
  if (!tvCard) return;

  const tvCardImg = tvCard.querySelector('.tv-card__img');
  if (tvCardImg.dataset.backdrop) {
    tvCardImg.src = tempCardSrc;
  }
});

// открытие модального окна
tvShowsList.addEventListener('click', event => {
  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
  }
});
