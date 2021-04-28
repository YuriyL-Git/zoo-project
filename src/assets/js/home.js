/*================ Carousel Photo Section =============================*/
const btnLeft = document.querySelector('.photo-section__btn-left');
const btnRight = document.querySelector('.photo-section__btn-right');
const items = document.querySelectorAll('.photo-section__item');

let animationInProcess = false;
let currentIndex = 0;

btnLeft.addEventListener('click', () => {
  if (!animationInProcess) {
    hideCurrent('to-left', currentIndex);
    currentIndex = getFollowingIndex(currentIndex + 1);
    showFollowing('from-right', currentIndex);
  }
});

btnRight.addEventListener('click', () => {
  if (!animationInProcess) {
    hideCurrent('to-right', currentIndex);
    currentIndex = getFollowingIndex(currentIndex - 1);
    showFollowing('from-left', currentIndex);
  }
});

function getFollowingIndex(index) {
  return (items.length + index) % items.length;
}

function hideCurrent(direction, index) {
  animationInProcess = true;
  items[index].classList.add(direction);
  items[index].addEventListener('animationend', event => {
    items[index].classList.remove('item-active', direction);
    animationInProcess = false;
  });
}

function showFollowing(direction, index) {
  items[index].classList.add('item-following', direction);
  items[index].addEventListener('animationend', () => {
    items[index].classList.remove('item-following', direction);
    items[index].classList.add('item-active');
  });
}

/*================ Carousel Testimonials ===============================*/

const cards = [...document.querySelectorAll('.testimonials__card')];
const container = document.querySelector('.testimonials__card-container');
const slider = document.querySelector('.testimonials__slider');
const root = document.documentElement;

const repeatTime = 10000;
const waitTime = 30000;
let timeoutTimer = null;
let repeatTimer = setInterval(() => moveLeft(), repeatTime);

let cardLast = 3;
let cardToMove = 0;
let cardToHide = 0;
let sliderPrevValue = slider.value;
let animationIsActive = false;

container.addEventListener('animationend', () => {
  container.classList.remove('testimonials-left', 'testimonials-right');
  cards[cardToHide].classList.remove('testimonials__card--active');
  cards[cardToMove].classList.add('testimonials__card--active');
  cards[cardToMove].classList.remove('testimonials__card--left', 'testimonials__card--right');
  slider.value = cardLast - 2;
  sliderPrevValue = slider.value;
  animationIsActive = false;
});

let prevTime = Date.now();
let prevMoveTime

slider.addEventListener('input', () => {
  container.classList.add('testimonials__card-container--fast');
  const moveTime = (Date.now() - prevTime) / 6000;
  if (moveTime < 0.5) {
    root.style.setProperty('--animation-speed', moveTime + "s");
  }
  prevTime = Date.now();
  clearInterval(repeatTimer);
  clearTimeout(timeoutTimer);

  timeoutTimer = setTimeout(() => {
    repeatTimer = setInterval(() => moveLeft(), repeatTime);
    container.classList.remove('testimonials__card-container--fast');
  }, waitTime);

  if (sliderPrevValue - slider.value < 0) {
    moveLeft();
  } else {
    moveRight();
  }
  sliderPrevValue = slider.value;
});

function moveRight() {
  if (cardLast > 3 && !animationIsActive && window.screen.availWidth > 1100) {
    animationIsActive = true;
    cardToMove = cardLast - 4;
    cardToHide = cardLast;
    cardLast--;
    cards[cardToMove].classList.add('testimonials__card--right');
    container.classList.add('testimonials-right');
  }
}

function moveLeft() {
  if (cardLast < cards.length - 1 && !animationIsActive && window.screen.availWidth > 1100) {
    animationIsActive = true;
    cardToMove = cardLast + 1;
    cardToHide = cardLast - 3;
    cardLast++;
    cards[cardToMove].classList.add('testimonials__card--left');
    container.classList.add('testimonials-left');
  } else {
    resetCards();
  }
}

function resetCards() {
  cardLast = 3;
  slider.value = 1;
  cards.forEach((card, index) => {
    if (index < 4) {
      card.classList.add('testimonials__card--active');
    }
    if (index >= 4) {
      card.classList.remove('testimonials__card--active');
    }
  });
}









