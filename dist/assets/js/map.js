/*============ Map Page ==============*/
const map = document.querySelector('.map-main__map');
const btnPlus = document.querySelector('.map-main__plus-btn');
const btnMinus = document.querySelector('.map-main__plus-btn');
const root = document.documentElement;
const animalIcons = [...document.querySelectorAll('.animal-icon')];

const mapRect = map.getBoundingClientRect();

const mapInitWidth = mapRect.width;
const mapInitHeight = mapRect.height;

const animalContainers = [...document.querySelectorAll('.tooltip-hover')];

let scaleValue = 1.8;

/*-------------------*/
class AnimalPosition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}


zoomMap(scaleValue);
updateAnimalsPosition();
scaleAnimalIcons();

btnPlus.addEventListener('click', event => {

});


function updateAnimalsPosition() {
  animalContainers.forEach(container => {
    const animal = getAnimalPosition(container);
    const newPos = scaleAnimalCoordinates(animal, scaleValue);
    setAnimalPosition(container, newPos);
  });
}

function zoomMap(scale) {
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

function scaleAnimalIcons() {
  animalIcons.forEach((icon, index) => {
    let offset = 1;
    if (index === 0) offset = 2;
    icon.style.transform = `scale(${scaleValue * offset})`;

    let iconLeft = getComputedStyle(icon).left.slice(0, -2);
    let iconTop = getComputedStyle(icon).top.slice(0, -2);
    icon.style.top = iconTop * scaleValue + 'px';
    icon.style.left = iconLeft * scaleValue + 'px';
    console.log('left=', iconLeft);
  });
}

function scaleAnimalCoordinates(animal, scale) {
  const centerX = mapInitWidth / 2;
  const centerY = mapInitHeight / 2;
  const relX = animal.x - centerX;
  const relY = animal.y - centerY;
  const scaledX = relX * scale;
  const scaledY = relY * scale;
  return {x: scaledX + centerX, y: scaledY + centerY};
}

function getAnimalPosition(animalContainer) {
  const animalRect = animalContainer.getBoundingClientRect();
  return new AnimalPosition(animalRect.x - mapRect.x, animalRect.y - mapRect.y);
}

function setAnimalPosition(animalContainer, coords) {
  animalContainer.style.left = coords.x + 'px';
  animalContainer.style.top = coords.y + 'px';
}








