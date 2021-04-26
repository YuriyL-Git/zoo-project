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





