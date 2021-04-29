const map = document.querySelector('.map-main__map');
const zoomInBtn = document.querySelector('.map-main__plus-btn');
const zoomOutBtn = document.querySelector('.map-main__minus-btn');
const root = document.documentElement;
const animalIcons = [...document.querySelectorAll('.animal-icon')];

const mapRect = map.getBoundingClientRect();

const mapInitWidth = mapRect.width;
console.log('init-width', mapInitWidth);
const mapInitHeight = mapRect.height;
let initialAnimalPosition = [];
let initialIconsPosition = [];
const animalContainers = [...document.querySelectorAll('.tooltip-hover')];
let scaleValue = 1;


/*-------------------*/
class AnimalPosition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/*------------------------drag and drop--------------*/

/*---------------------------------------------------*/
let multiplier = 1;
getInitialAnimalPosition();
getInitialIconsPosition();
scaleAnimalIcons();

zoomInBtn.addEventListener('click', event => {
  if (multiplier < 4) {
    multiplier += 0.5;
    resetMap();
    scaleValue *= multiplier;
    updateMap();

  }
});

zoomOutBtn.addEventListener('click', () => {
  if (multiplier > 1) {
    multiplier -= 0.5;
    resetMap();
    scaleValue *= multiplier;
    updateMap();
  }
});

function updateMap() {
  root.style.setProperty('--map-width', '100%');
  root.style.setProperty('--map-height', '100%');

  zoomMap(scaleValue);
  updateAnimalsPosition();
  scaleAnimalIcons();

}

function zoomMap(scale) {
  let mapWidhtPercents = getComputedStyle(root).getPropertyValue('--map-width').slice(0, -1);
  let mapHeightPercents = getComputedStyle(root).getPropertyValue('--map-height').slice(0, -1);
  mapWidhtPercents *= scale;
  mapHeightPercents *= scale;
  root.style.setProperty('--map-width', mapWidhtPercents + '%');
  root.style.setProperty('--map-height', mapHeightPercents + '%');
  console.log(getComputedStyle(map).width);
  let offcetX = (getComputedStyle(map).width.slice(0, -2) - mapInitWidth) / 2;
  let offcetY = (getComputedStyle(map).height.slice(0, -2) - mapInitHeight) / 2;

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

function updateAnimalsPosition() {
  animalContainers.forEach((container, index) => {
    //const animal = getAnimalPosition(container);
    const newPos = scaleAnimalCoordinates(initialAnimalPosition[index], scaleValue);
    setAnimalPosition(container, newPos);
  });
}

function getInitialAnimalPosition() {
  animalContainers.forEach(container => {
    let animalPos = getAnimalPosition(container);
    initialAnimalPosition.push(animalPos);
  });
}

function getInitialIconsPosition() {
  animalIcons.forEach(icon => {
    let out = {};
    out.left = getComputedStyle(icon).left.slice(0, -2);
    out.top = getComputedStyle(icon).top.slice(0, -2);
    initialIconsPosition.push(out);
  });
}

function resetAnimalsPosition() {
  initialAnimalPosition.forEach((pos, index) => {
    animalContainers[index].style.left = pos.x;
    animalContainers[index].style.top = pos.y;
  });
  initialIconsPosition.forEach((pos, index) => {
    animalIcons[index].style.left = pos.left + 'px';
    animalIcons[index].style.top = pos.top + 'px';
  });
}

function resetMap() {
  scaleValue = 1;
  updateMap();
  resetAnimalsPosition();
}


console.log(initialAnimalPosition);








