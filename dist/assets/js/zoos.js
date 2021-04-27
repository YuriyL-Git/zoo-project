/*================ Carousel videos =====================================*/

const preview = [...document.querySelectorAll('.preview-container__title-wrapper')];
const previewVideos = [...document.querySelectorAll('.preview-container__videos iframe')];
const mainVideo = document.querySelector('.iframe-main');


preview.forEach((preview, index) => {
  preview.addEventListener('click', event => {
    mainVideo.src = mainVideo.src.replace('?autoplay=1', '');
    [mainVideo.src, previewVideos[index].src] = [previewVideos[index].src, mainVideo.src];
    mainVideo.src += '?autoplay=1';
  });
});

/*================ Read more btn =====================================*/
const btnRead = document.querySelector('.btn-read-less');

btnRead.addEventListener('click', () => {
  console.log('clicked');
});
















