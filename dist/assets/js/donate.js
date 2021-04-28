/*================= Donate page =======================*/
const amountRadioBtns = [...document.querySelectorAll('.section-donate__amount-picker')];
const amountInput = document.querySelector('.section-donate__input');

window.addEventListener('resize', function (event) {
  console.log('resized');
  amountRadioBtns.forEach(radio => {
    if (getRadioBtnValue(radio) === '100') radio.checked = true;
  });
});

amountRadioBtns.forEach(radio => {
  radio.addEventListener('click', () => {
    amountInput.value = getRadioBtnValue(radio);
  });
});

amountInput.addEventListener('input', event => {
  if (event.target.value > 9999) event.target.value = Math.floor(event.target.value / 10);
  amountRadioBtns.forEach(radio => {
    if (getRadioBtnValue(radio) === event.target.value) {
      radio.checked = 'true';
    }
  });
});

function getRadioBtnValue(radioBtn) {
  const amount = window.getComputedStyle(radioBtn, ':before')['content'];
  return amount.substring(2, amount.length - 1);
}

