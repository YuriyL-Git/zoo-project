/*============ Map Page ==============*/
const map = document.querySelector('.map-main__map');
const eagleContainer = document.querySelector('.map-main__eagles-container');
const gorillaContainer = document.querySelector('.map-main__gorilla-container');
const buttonPlus = document.querySelector('.map-main__plus-btn');
const root = document.documentElement;
const mapRect = map.getBoundingClientRect();

let scaleValue = 3;

/*-------------------*/
class Animal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let eagle = getAnimal(eagleContainer);
let gorilla = getAnimal(gorillaContainer);


let containerWidtn = mapRect.width;
let containerHeight = mapRect.height;

mapScaleX(scaleValue);

let newEaglePosition = scaleCoordinates(containerWidtn, containerHeight, eagle, scaleValue);
let newGorillaPosition = scaleCoordinates(containerWidtn, containerHeight, gorilla, scaleValue);
console.log('gorilla', newGorillaPosition);
setAnimalPosition(eagleContainer, newEaglePosition.x, newEaglePosition.y);
setAnimalPosition(gorillaContainer, newGorillaPosition.x, newGorillaPosition.y);

gorillaContainer.style.transform = `scale(${scaleValue})`;

buttonPlus.addEventListener('click', event => {
  console.log('eagles', eagleContainer.getBoundingClientRect());
  console.log();
});


function scaleCoordinates(width, height, animal, scale) {
  const centerX = width / 2;
  const centerY = height / 2;
  const relX = animal.x - centerX;
  const relY = animal.y - centerY;
  const scaledX = relX * scale;
  const scaledY = relY * scale;
  return {x: scaledX + centerX, y: scaledY + centerY};
};

function mapScaleX(scale) {
  let oldWidthPx = getComputedStyle(map).width.slice(0, -2);
  let oldHeightPx = getComputedStyle(map).height.slice(0, -2);

  let mapWidhtPercents = getComputedStyle(root).getPropertyValue('--map-width').slice(0, -1);
  let mapHeightPercents = getComputedStyle(root).getPropertyValue('--map-height').slice(0, -1);
  mapWidhtPercents *= scale;
  mapHeightPercents *= scale;
  root.style.setProperty('--map-width', mapWidhtPercents + '%');
  root.style.setProperty('--map-height', mapHeightPercents + '%');
  console.log(getComputedStyle(map).width);
  let offcetX = (getComputedStyle(map).width.slice(0, -2) - oldWidthPx) / 2;
  let offcetY = (getComputedStyle(map).height.slice(0, -2) - oldHeightPx) / 2;

  root.style.setProperty('--map-left', (-offcetX) + 'px');
  root.style.setProperty('--map-top', (-offcetY) + 'px');
}

function getAnimal(animalContainer) {
  const animalRect = animalContainer.getBoundingClientRect();
  return new Animal(animalRect.x - mapRect.x, animalRect.y - mapRect.y);
}

function setAnimalPosition(animalContainer, x, y) {
  animalContainer.style.left = x + 'px';
  animalContainer.style.top = y + 'px';
}








