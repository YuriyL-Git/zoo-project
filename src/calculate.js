/*calculate width percents*/
function calc(outContainer, startW, innerCont, endW) {
  let percents = (endW - startW) / (innerCont - outContainer);
  console.log('result:');
  let pixels = startW - outContainer * percents;
  percents = percents * 100;
  console.log(`calc(${pixels}px + ${percents}%)`);
}

let outContainerWidth = 580;
let startElementWidth = 106.5;
let innerContainerWidth = 500;
let ednElementWidth = 85.2;

calc(outContainerWidth, startElementWidth, innerContainerWidth, ednElementWidth);

//updated test commit
