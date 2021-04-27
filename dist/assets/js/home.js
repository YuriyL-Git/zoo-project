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

/*==========================================================*/

/*================ Carousel Testimonials ===============================*/

const cards = [...document.querySelectorAll('.testimonials__card')];
const btnTestimonials = document.querySelector('.testimonials__feedback-btn');
const container = document.querySelector('.testimonials__card-container');
const slider = document.querySelector('.testimonials__slider');
let cardLast = 3;
let sliderValue = slider.value;
let cardMoving = 0;
let cardHide = 0;
let animActive = false;

const btnTest = document.querySelector('.btn-test');
btnTest.addEventListener('click', e => {
  moveRight();
});

btnTestimonials.addEventListener('click', event => {
  moveLeft();
});

container.addEventListener('animationend', () => {
  container.classList.remove('testimonials-left', 'testimonials-right');
  console.log('cardHide', cardHide);
  cards[cardHide].classList.remove('testimonials__card--active');
  cards[cardMoving].classList.add('testimonials__card--active');
  cards[cardMoving].classList.remove('testimonials__card--left', 'testimonials__card--right');
  slider.value = cardLast - 2;
  animActive = false;
});

slider.addEventListener('input', event => {
  container.classList.add('testimonials__card-container--fast');
  container.classList.remove('testimonials__card-container--fast');
  console.log(event.target.value);
});

function moveRight() {
  if (cardLast > 3 && !animActive) {
    animActive = true;
    cardMoving = cardLast - 4;
    cardHide = cardLast;
    cardLast--;
    cards[cardMoving].classList.add('testimonials__card--right');
    container.classList.add('testimonials-right');
  }
}

function moveLeft() {
  if (cardLast < cards.length - 1 && !animActive) {
    animActive = true;
    cardMoving = cardLast + 1;
    cardHide = cardLast - 3;
    cardLast++;
    cards[cardMoving].classList.add('testimonials__card--left');
    container.classList.add('testimonials-left');
  } else {
    resetTestimonials();
  }
}

function resetTestimonials() {
  console.log('reset called');
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









