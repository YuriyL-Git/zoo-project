/*================ Carousel videos =====================================*/
const preview = [...document.querySelectorAll('.preview-container__title-wrapper')];
const previewVideos = [...document.querySelectorAll('.preview-container__videos iframe')];
const mainVideo = document.querySelector('.iframe-main');
const btnLeft = document.querySelector('.preview-container__btn-left');
const btnRight = document.querySelector('.preview-container__btn-right');
const items = document.querySelectorAll('.preview-container__block');

let animationInProcess = false;
let currentIndex = 0;

updateVideoLinks();

btnLeft.addEventListener('click', () => {
  if (!animationInProcess) {
    hideCurrent('to-left', currentIndex);
    currentIndex = getFollowingIndex(currentIndex + 1, items.length);
    showFollowing('from-right', currentIndex);
  }
});

btnRight.addEventListener('click', () => {
  if (!animationInProcess) {
    hideCurrent('to-right', currentIndex);
    currentIndex = getFollowingIndex(currentIndex - 1, items.length);
    showFollowing('from-left', currentIndex);
  }
});


function getFollowingIndex(index, length) {
  return (length + index) % length;
}

function hideCurrent(direction, index) {
  animationInProcess = true;
  items[index].classList.add(direction);
  items[index].addEventListener('animationend', event => {
    items[index].classList.remove('preview-container__block--active', direction);
    animationInProcess = false;
  });
}

function showFollowing(direction, index) {
  items[index].classList.add('block-following', direction);
  items[index].addEventListener('animationend', () => {
    items[index].classList.remove('block-following', direction);
    items[index].classList.add('preview-container__block--active');
  });
}

function updateVideoLinks() {
  preview.forEach((preview, index) => {
    preview.addEventListener('click', () => {
      let indexVideo = getFollowingIndex(currentIndex * 4 + index, previewVideos.length);
      mainVideo.src = mainVideo.src.replace('?autoplay=1', '');
      [mainVideo.src, previewVideos[indexVideo].src] = [previewVideos[indexVideo].src, mainVideo.src];
      mainVideo.src += '?autoplay=1';
    });
  });
}

/*================ Read more btn =====================================*/
const btnRead = document.querySelector('.btn-read-less');
const arcticleSection = document.querySelector('.info-section');
const separator = document.querySelector('.separator');

btnRead.addEventListener('click', () => {
  arcticleSection.classList.toggle('info-section--small');
  if (btnRead.textContent === 'Read More') {
    btnRead.textContent = 'Read Less';
  } else {
    btnRead.textContent = 'Read More';
    separator.scrollIntoView();
  }
});
















