'use strict';

////////////////////////////////////////////////////////////////
// Fix for flexbox gap property missing in some Safari browsers

const checkFlexGap = () => {
  // Create a flex container with gap
  const flexEl = document.createElement('div');
  flexEl.style.display = 'flex';
  flexEl.style.flexDirection = 'column';
  flexEl.style.gap = '1px';

  // Append two child elements to flexEl container
  flexEl.appendChild(document.createElement('div'));
  flexEl.appendChild(document.createElement('div'));

  // Append flexEl container to DOM IOT read scrollHeight
  document.body.appendChild(flexEl);
  const isSupported = flexEl.scrollHeight === 1;
  flexEl.parentNode.removeChild(flexEl);

  return isSupported;
};

if (!checkFlexGap()) {
  document.body.classList.add('js-no-flexbox-gap');
  console.log('Flexbox gap is not supported');
}

///////////////////////////////////////////////
// Create sticky navigation for all browsers

const sectionHeroEl = document.querySelector('.section__hero');
const navBarEl = document.querySelector('.nav');

// Get height of nav bar and convert to negative pixel string
const navBarOffset = '-' + navBarEl.offsetHeight + 'px';

const obs = new IntersectionObserver(
  entries => {
    const ent = entries[0];
    if (!ent.isIntersecting) document.body.classList.add('js-sticky');
    if (ent.isIntersecting) document.body.classList.remove('js-sticky');
  },
  {
    root: null /* Viewport */,
    threshold: 0,
    rootMargin: navBarOffset,
  }
);
obs.observe(sectionHeroEl);

///////////////////////////////////
// Update copyright year in footer

const year = document.querySelector('.year');
const currentYear = new Date().getFullYear();

year.textContent = currentYear;

////////////////////////////////////////////
// Create smooth scrolling for all browsers

const alllinkEls = document.querySelectorAll('a:link');

alllinkEls.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');

    if (!href.startsWith('http')) e.preventDefault();

    // Scroll back to top of page
    if (href === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    // Scroll to relevant section on page
    if (href !== '#' && href.startsWith('#')) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({
        behavior: 'smooth',
      });
    }
  });
});

const btnScrollToEl = document.querySelector('.btn__scroll-to');
const section1El = document.getElementById('section--1');

btnScrollToEl.addEventListener('click', e => {
  e.preventDefault();
  section1El.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////
// Animate modal overlay

const openModalBtns = document.querySelectorAll('.btn__show-modal');
const closeModalBtn = document.querySelector('.btn__close-modal');
const modalEl = document.querySelector('.modal');
const overlayEl = document.querySelector('.overlay');

const openModal = e => {
  e.preventDefault();
  modalEl.classList.remove('hidden');
  overlayEl.classList.remove('hidden');
};

const closeModal = () => {
  modalEl.classList.add('hidden');
  overlayEl.classList.add('hidden');
};

openModalBtns.forEach(btn => {
  btn.addEventListener('click', openModal);
});

closeModalBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalEl.classList.contains('hidden')) closeModal();
});
