'use strict';

////////////////
// DOM elements

const navBarEl = document.querySelector('.nav');
const sectionHeroEl = document.querySelector('.section__hero');
const tabsContainerEl = document.querySelector('.operations__tab-container');
const tabsEl = document.querySelectorAll('.operations__tab');
const tabsContentEl = document.querySelectorAll('.operations__content');
const yearEl = document.querySelector('.year');
const openModalBtns = document.querySelectorAll('.btn__show-modal');
const closeModalBtn = document.querySelector('.btn__close-modal');
const modalEl = document.querySelector('.modal');
const overlayEl = document.querySelector('.overlay');

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
const currentYear = new Date().getFullYear();

yearEl.textContent = currentYear;

////////////////////////////////////////////
// Create smooth scrolling for all browsers

document.body.addEventListener('click', function (e) {
  const targetEl = e.target.closest('.nav__link');

  if (!targetEl) return;

  const href = targetEl.getAttribute('href');

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
