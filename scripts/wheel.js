'use strict';

(() => {

window.showWheel = (sectors, callback) => {
  const wheel = document.querySelector('.wheel');
  const countdown = document.querySelector('.wheel__counter-time');

  const smallReel = document.querySelector('.reel__inner--circle-small');
  const mediumReel = document.querySelector('.reel__inner--circle-medium');
  const contentReel = document.querySelector('.reel__inner--circle-content');
  const sectorsContainer = document.querySelector('.reel__content');
  const resultText = document.querySelector('.reel__result-text');
  const resultValue = document.querySelector('.reel__result-value');

  const form = document.querySelector('.wheel__form');
  const nameInput = document.querySelector('.wheel__input[name=username]');
  const phoneInput = document.querySelector('.wheel__input[name=tel]');
  const checkboxInput = document.querySelector('.wheel__checkbox');
  const spinBtn = document.querySelector('.wheel__button--spin');
  const confirmBtn = document.querySelector('.wheel__button--confirm');
  const closeBtn = document.querySelector('.wheel__close');

  const availableSectors = sectors.filter(({ allow }) => allow);
  const resultSector = availableSectors[random(availableSectors.length)];

  let countdownIntervalId = null;
  let hideTimeoutId = null;

  const init = () => {
    wheel.classList.add('wheel--visible');

    sectorsContainer.innerHTML = getSectorsHtml(sectors);

    resize();
    window.addEventListener('resize', resizeHandler);

    form.addEventListener('submit', submitHandler);
    nameInput.addEventListener('input', inputHandler);
    phoneInput.addEventListener('input', inputHandler);
    checkboxInput.addEventListener('input', inputHandler);

    spinBtn.addEventListener('click', spin);
    closeBtn.addEventListener('click', hide);
  };

  const hide = () => {
    wheel.classList.remove('wheel--visible');

    clearTimeout(hideTimeoutId);
    clearInterval(countdownIntervalId);

    window.removeEventListener('resize', resizeHandler);

    form.removeEventListener('submit', submitHandler);
    nameInput.removeEventListener('input', inputHandler);
    phoneInput.removeEventListener('input', inputHandler);
    checkboxInput.removeEventListener('input', inputHandler);

    spinBtn.removeEventListener('click', spin);
    confirmBtn.removeEventListener('click', confirm);
    closeBtn.removeEventListener('click', hide);

    contentReel.removeEventListener('transitionend', spinStopHandler);
  };

  const spin = () => {
    spinBtn.removeEventListener('click', spin);
    spinBtn.disabled = true;
    checkboxInput.disabled = true;

    const resultIndex = sectors.indexOf(resultSector);
    const angle = (5 * 360) - ((360 / sectors.length) * resultIndex);
    const randomOffset = 0.8 * (Math.random() - 0.5) * (360 / sectors.length);

    contentReel.style.transform = `rotate(${angle + randomOffset}deg)`;
    smallReel.style.transform = `rotate(${(4 + Math.random()) * 360}deg)`;
    mediumReel.style.transform = `rotate(-${(4 + Math.random()) * 360}deg)`;

    contentReel.addEventListener('transitionend', spinStopHandler);
  };

  const spinStopHandler = () => {
    contentReel.removeEventListener('transitionend', spinStopHandler);

    startCountdown();

    wheel.classList.remove('wheel--initial');
    wheel.classList.add('wheel--confirm');

    if (isDiscount(resultSector.text)) {
      resultValue.innerText = resultSector.text;
    } else {
      resultText.innerText = resultSector.text;
      resultValue.hidden = true;
    }

    confirmBtn.addEventListener('click', confirm);
  };

  const confirm = () => {
    confirmBtn.removeEventListener('click', confirm);
    wheel.classList.remove('wheel--confirm');
    wheel.classList.add('wheel--result');

    callback({
      name: nameInput.value,
      phone: phoneInput.value,
      value: resultSector.value,
    });

    hideTimeoutId = setTimeout(hide, 3000);
  };

  const startCountdown = () => {
    let secondsLeft = 10 * 60;
    countdown.innerText = stringifyTime(secondsLeft);

    countdownIntervalId = setInterval(() => {
      if (secondsLeft <= 0) {
        hide();
        return;
      }

      secondsLeft -= 1;
      countdown.innerText = stringifyTime(secondsLeft);
    }, 1000);
  };

  const resize = () => {
    if ([nameInput, phoneInput].includes(document.activeElement)) {
      return;
    }

    const vertical = window.innerWidth < window.innerHeight;

    // значения после + это хак для отступов от края экрана
    const defaultWidth = vertical ? (860 + 30) : (1520 + 40);
    const defaultHeigth = vertical ? (1400 + 40) : 756;

    const scaleX = window.innerWidth / defaultWidth;
    const scaleY = window.innerHeight / defaultHeigth;
    const scale = Math.min(1, scaleX, scaleY);

    if (vertical) {
      wheel.classList.add('wheel--vertical');
    } else {
      wheel.classList.remove('wheel--vertical');
    }
    wheel.style.fontSize = `${scale}px`;
  };

  const resizeHandler = debounce(resize, 150);

  const submitHandler = e => e.preventDefault();

  const inputHandler = ({ target }) => {
    if (target.value === '') {
      target.classList.add('wheel__input--invalid');
    } else {
      target.classList.remove('wheel__input--invalid');
    }

    const invalid = nameInput.value === '' || phoneInput.value === '' || !checkboxInput.checked;

    spinBtn.disabled = invalid;
    confirmBtn.disabled = invalid;
  };

  init();

  return hide;
};

const isDiscount = text => /^\d+\%$/.test(text);

const getSectorsHtml = sectors => sectors
  .map(({ text }, i) => {
    const style = `transform: translateY(-50%) rotate(${(360/12) * i}deg)`;
    const bigTextClass = isDiscount(text) ? 'reel__sector-text--big' : '';

    return (
      `<div class="reel__sector" style="${style}">
        <span class="reel__sector-text ${bigTextClass}">${text}</span>
      </div>`
    );
  })
  .reduce((acc, curr) => `${acc}${curr}`, '');

const stringifyTime = seconds => {
  const s = seconds % 60;
  const m = (seconds - s) / 60;
  const ss = s >= 10 ? s : `0${s}`;
  const mm = m >= 10 ? m : `0${m}`;

  return `${mm}:${ss}`;
}

const debounce = (func, delay) => {
  let timeoutId = null;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(func, delay);
  };
};

const random = (max) => Math.floor(Math.random() * max);

})();