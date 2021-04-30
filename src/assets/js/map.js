const map = document.querySelector('.map-main__map');
const zoomInBtn = document.querySelector('.map-main__plus-btn');
const zoomOutBtn = document.querySelector('.map-main__minus-btn');
const root = document.documentElement;
const animalIcons = [...document.querySelectorAll('.animal-icon')];
const header = document.querySelector('.header-map');
const footer = document.querySelector('.footer');
const body = document.querySelector('.map-page');
const animalContainers = [...document.querySelectorAll('.tooltip-hover')];

const mapRect = map.getBoundingClientRect();


const mapInitWidth = mapRect.width;
const mapInitHeight = mapRect.height;
let initialAnimalsPosition = [];
let initialIconsPosition = [];
let currentAnimalsPosition = [];
let scaleValue = 1;

let mapLeftAfterZoom = 0;
let mapTopAfterZoom = 0;

/*-------------------*/
class AnimalPosition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/*------------------------drag and drop--------------*/

map.addEventListener('mousedown', event => {
  let mapCurrentRect = map.getBoundingClientRect();

  let currentLeft = (+getComputedStyle(map).left.slice(0, -2));
  let currentTop = (+getComputedStyle(map).top.slice(0, -2));
  let mapPosition = getMapPosition();
  let shiftX = event.pageX - mapPosition.left;
  let shiftY = event.pageY - mapPosition.top;


  document.addEventListener('mousemove', moveMap);
  document.addEventListener('mouseup', stopDrag);

  let offsetX = 0;
  let offsetY = 0;
  let fixedX = 0;
  let fixedY = 0;

  function moveMap(e) {
    /*offsetX, offsetY calculate offsets when map is
    moved in not allowed direction */
    let moveX = e.pageX - mapPosition.left - shiftX + offsetX;
    let moveY = e.pageY - mapPosition.top - shiftY + offsetY;

    let mapLeftPos = currentLeft + moveX;
    let mapTopPos = currentTop + moveY;

    let limitLeft = mapRect.width - mapCurrentRect.width;
    let limitTop = mapRect.height - mapCurrentRect.height;

    if (mapLeftPos < 0 && mapLeftPos > limitLeft) {
      root.style.setProperty('--map-left', mapLeftPos + 'px');
      moveAnimals(moveX, moveY);
      fixedX = moveX;
      // console.log('move x= ', moveX);
      // console.log('offsetX=', offsetX);
    } else {
      offsetX++;
      moveAnimals(fixedX, moveY);
      moveX = fixedX;
      // console.log('offsetX', offsetX);

    }

    if (mapTopPos < 0 && mapTopPos > limitTop) {
      root.style.setProperty('--map-top', mapTopPos + 'px');
      moveAnimals(moveX, moveY);
      fixedY = moveY;
      //console.log('move y =', moveY);
      // console.log('offsetY=', offsetY);
    } else {
      moveY = fixedY;
      moveAnimals(fixedX, moveY);
      offsetY--;
    }
  }

  function getMapPosition() {
    return {
      top: mapCurrentRect.top + pageYOffset,
      left: mapCurrentRect.left + pageXOffset
    };
  }

  function stopDrag() {
    //console.log('stopDrag executed');
    document.mousemove = null;
    document.removeEventListener('mousemove', moveMap);
    map.removeEventListener('mouseup', stopDrag);
    saveCurrentAnimalsPosition();
  }

  header.addEventListener('mouseenter', stopDrag);
  footer.addEventListener('mouseenter', stopDrag);
  body.addEventListener('mouseenter', stopDrag);
});
let newPosition = {};

function moveAnimals(shiftX, shiftY) {
  animalContainers.forEach((container, index) => {
    let coords = {x: currentAnimalsPosition[index].x + shiftX, y: currentAnimalsPosition[index].y + shiftY};
    setAnimalPosition(container, coords);
  });
}


map.ondragstart = function () {
  return false;
};
/*---------------------------------------------------*/
let multiplier = 1;
getInitialAnimalsPosition();
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
  zoomMap(scaleValue);
  updateAnimalsPosition();
  scaleAnimalIcons();
  saveCurrentAnimalsPosition();
}

function zoomMap(scale) {
  root.style.setProperty('--map-width', 100 * scale + '%');
  root.style.setProperty('--map-height', 100 * scale + '%');
  mapLeftAfterZoom = (getComputedStyle(map).width.slice(0, -2) - mapInitWidth) / 2;
  mapTopAfterZoom = (getComputedStyle(map).height.slice(0, -2) - mapInitHeight) / 2;

  root.style.setProperty('--map-left', (-mapLeftAfterZoom) + 'px');
  root.style.setProperty('--map-top', (-mapTopAfterZoom) + 'px');
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
    if (index === 2 && scaleValue > 1.5) {
      icon.style.top = 28 * scaleValue + 'px';
      icon.style.left = 16 * scaleValue + 'px';
    }
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
  //const animalRect = animalContainer.getBoundingClientRect();
  //return new AnimalPosition(animalRect.x - mapRect.x, animalRect.y - mapRect.y);
  return new AnimalPosition((+getComputedStyle(animalContainer).left.slice(0, -2)), (+getComputedStyle(animalContainer).top.slice(0, -2)));
}

function setAnimalPosition(animalContainer, coords) {
  //console.log('set animal coords =', coords);
  animalContainer.style.left = Math.floor(coords.x) + 'px';
  animalContainer.style.top = Math.floor(coords.y) + 'px';
}


function updateAnimalsPosition() {
  animalContainers.forEach((container, index) => {
    const newPos = scaleAnimalCoordinates(initialAnimalsPosition[index], scaleValue);
    setAnimalPosition(container, newPos);
  });

}

function getInitialAnimalsPosition() {
  initialAnimalsPosition = [];
  animalContainers.forEach(container => {
    let animalPos = getAnimalPosition(container);
    initialAnimalsPosition.push(animalPos);
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
  initialAnimalsPosition.forEach((pos, index) => {
    animalContainers[index].style.left = pos.x;
    animalContainers[index].style.top = pos.y;
  });
  initialIconsPosition.forEach((pos, index) => {
    animalIcons[index].style.left = pos.left + 'px';
    animalIcons[index].style.top = pos.top + 'px';
  });
  saveCurrentAnimalsPosition();
}

function saveCurrentAnimalsPosition() {
  currentAnimalsPosition = [];
  animalContainers.forEach(container => {
    let animalPos = getAnimalPosition(container);
    currentAnimalsPosition.push(animalPos);
  });
  //console.log('saved position', currentAnimalsPosition);
}

function resetMap() {
  scaleValue = 1;
  root.style.setProperty('--map-width', '100%');
  root.style.setProperty('--map-height', '100%');
  root.style.setProperty('--map-left', (-mapLeftAfterZoom) + 'px');
  root.style.setProperty('--map-top', (-mapTopAfterZoom) + 'px');
  updateMap();
  resetAnimalsPosition();
}










