/*======= Home page ===============*/
const btnLeft = document.querySelector('.photo-section__btn-left');
const btnRight = document.querySelector('.photo-section__btn-right');
let itemActive = document.querySelector('.item-active');
const items = document.querySelectorAll('.photo-section__item');
let animationInProcess = false;

let currentItem = 0;
let previousItem = items.length;
let nextItem = currentItem + 1;

function updateItems(index) {
  currentItem = (currentItem + items.length + index) % items.length;
  nextItem = (currentItem + 1) % items.length;
  previousItem = (currentItem - 1);
  if (previousItem < 0) previousItem = items.length - 1;
}

function hideCurrent(direction, directionIndex) {
  animationInProcess = true;
  items[currentItem].classList.add(direction);
  items[currentItem].addEventListener('animationend', event => {
    console.log('animation hide current ended');
    items[currentItem].classList.remove('item-active', direction);
    animationInProcess = false;

  });
}

function showFollowing(itemIndex, direction, directionIndex) {
  items[itemIndex].classList.add('item-following', direction);
  items[itemIndex].addEventListener('animationend', event => {
    console.log('animation show following ended');
    items[itemIndex].classList.remove('item-following', direction);
    items[itemIndex].classList.add('item-active');

    console.log('current=', currentItem);
    console.log('next=', nextItem);
    console.log('previous=', previousItem);
  });
}


btnLeft.addEventListener('click', event => {
  if (!animationInProcess) {
    hideCurrent('to-left', 1);
    showFollowing(nextItem, 'from-right', 1);
    updateItems(1);
  }
});

btnRight.addEventListener('click', event => {

  if (!animationInProcess) {
    updateItems(-1);

    hideCurrent('to-right', 1);
    showFollowing(previousItem, 'from-left');
  }
});


