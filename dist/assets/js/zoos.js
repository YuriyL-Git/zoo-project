const preview = [...document.querySelectorAll('.preview-container__title-wrapper')];
const previewVideos = [...document.querySelectorAll('.preview-container__videos iframe')];
const mainVideo = document.querySelector('.iframe-main');


preview.forEach((preview, index) => {
  preview.addEventListener('click', event => {
    console.log(index);
    //mainVideo.src = previewVideos[index].src;
    console.log(mainVideo.src);
    mainVideo.src = mainVideo.src.replace('?autoplay=1', '');
    console.log(mainVideo.src);
    [mainVideo.src, previewVideos[index].src] = [previewVideos[index].src, mainVideo.src];
    console.log(mainVideo);
    mainVideo.src += '?autoplay=1';
    //mainVideo.src += "&autoplay=1";
  });
});














