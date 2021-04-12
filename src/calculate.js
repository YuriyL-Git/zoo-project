/*calculate width percents*/
function calc(outContainer, startW, innerCont, endW) {
  let percents = (endW - startW) / (innerCont - outContainer);
  console.log('result:');
  let pixels = startW - outContainer * percents;
  percents = percents * 100;
  console.log(`calc(${pixels}px + ${percents}%)`)
}

let outContainerWidth = 1160;
let startElementWidth = 526;
let innerContainerWidth = 1000;
let ednElementWidth = 490;

calc(outContainerWidth, startElementWidth, innerContainerWidth, ednElementWidth)

//calc(1160, 526, 1000, 490)
