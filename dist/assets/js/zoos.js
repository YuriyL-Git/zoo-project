/*================ Carousel videos =====================================*/

const preview = [...document.querySelectorAll('.preview-container__title-wrapper')];
const previewVideos = [...document.querySelectorAll('.preview-container__videos iframe')];
const mainVideo = document.querySelector('.iframe-main');
const btnLeft = document.querySelector('.preview-container__btn-left');
const btnRight = document.querySelector('.preview-container__btn-right');
const videoSources = previewVideos.map(video => video.src);

let currentIndex = 0;

preview.forEach((preview, index) => {
  preview.addEventListener('click', event => {
    mainVideo.src = mainVideo.src.replace('?autoplay=1', '');
    [mainVideo.src, previewVideos[index].src] = [previewVideos[index].src, mainVideo.src];
    mainVideo.src += '?autoplay=1';
  });
});

btnLeft.addEventListener('click', () => {
  currentIndex = getFollowingIndex(currentIndex - 4);
  console.log('currentIndex', currentIndex);
  let videoNumbers = getVideoNumbers(currentIndex);
  console.log('test');

  /* hide videos with animation */
  let i = 99;
  const timerHide = setInterval(() => {
    i--;
    if (i < 0) {clearInterval(timerHide);} else {
      previewVideos.forEach(video => {
        video.style.opacity = 0 + '.' + i;
      });
    }
  }, 10);
  video.style.opacity = '0';
  setTimeout(() => {
    videoNumbers.forEach((number, index) => {
      previewVideos[index].src = videoSources[number];
    });
  }, 1000);


  i = 0;

  setTimeout(() => {
    const timerShow = setInterval(() => {
      i++;
      if (i > 9) {clearInterval(timerShow);} else {
        console.log('i=', i);
        previewVideos.forEach(video => {
          video.style.opacity = 0 + '.' + i;
        });
      }
    }, 50);
  }, 3000);
  video.style.opacity = '0.98';

});


function getVideoNumbers(index) {
  let result = [];
  for (let i = 0; i < 4; i++) {
    result.push(index);
    index++;
    if (index > videoSources.length - 1) {
      index = 0;
    }
  }
  return result;
}

function getFollowingIndex(index) {
  return (videoSources.length + index) % videoSources.length;
}

/*================ Read more btn =====================================*/
const btnRead = document.querySelector('.btn-read-less');
const arcticleSection = document.querySelector('.info-section');

btnRead.addEventListener('click', () => {
  arcticleSection.classList.toggle('info-section--small');
  if (btnRead.textContent === 'Read More') {
    btnRead.textContent = 'Read Less';
  } else {
    btnRead.textContent = 'Read More';
  }
});

















