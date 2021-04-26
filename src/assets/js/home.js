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
const btnTestimonials = document.querySelector('.testimonials__feedback-btn');
const container = document.querySelector('.testimonials__card-container');
const slider = document.querySelector('.testimonials__slider');
let cardLast = 3;

btnTestimonials.addEventListener('click', event => {
  console.log('slider.value', slider.value);
  if (cardLast < cards.length - 1) {
    cards[cardLast + 1].classList.add('testimonials__card--moving');
    container.classList.add('testimonials-left');
  } else {
    resetTestimonials();
  }
});

container.addEventListener('animationend', () => {
  container.classList.remove('testimonials-left');
  cards[cardLast - 3].classList.remove('testimonials__card--active');
  cards[cardLast + 1].classList.add('testimonials__card--active');
  cards[cardLast + 1].classList.remove('testimonials__card--moving');
  cardLast++;
  slider.value = cardLast - 2;
});

slider.addEventListener('input', event => {
  container.classList.add('testimonials__card-container--fast');
  container.classList.remove('testimonials__card-container--fast');
  console.log(event.target.value);
});

function moveCards(direction){

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









