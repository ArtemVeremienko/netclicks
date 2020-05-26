'use strict';

// меню
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');

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