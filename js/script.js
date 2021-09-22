'use strict';

////////////////
// DOM elements

const allSections = document.querySelectorAll('.section');
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
const navBarOffset = `-${navBarEl.offsetHeight}px`;

const stickyNav = entries => {
  const ent = entries[0];

  if (!ent.isIntersecting) document.body.classList.add('js-sticky');
  else document.body.classList.remove('js-sticky');
};

const stickyOptions = {
  root: null /* Viewport */,
  threshold: 0,
  rootMargin: navBarOffset,
};

const stickyObserver = new IntersectionObserver(stickyNav, stickyOptions);
stickyObserver.observe(sectionHeroEl);

///////////////////////////////////
// Update copyright year in footer
const currentYear = new Date().getFullYear();

yearEl.textContent = currentYear;

//////////////////////////////////////////
// Create shrink nav bar effect on scroll

const shrinkNav = entries => {
  const ent = entries[0];

  if (!ent.isIntersecting) navBarEl.classList.add('js-nav-shrink');
  else navBarEl.classList.remove('js-nav-shrink');
};

const shrinkOptions = {
  root: null /* Viewport */,
  threshold: 0,
};

const navShrinkObserver = new IntersectionObserver(shrinkNav, shrinkOptions);
navShrinkObserver.observe(sectionHeroEl);

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

/////////////////////////
// Animate modal overlay

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

////////////////////////////
// Activate Operations Tabs

tabsContainerEl.addEventListener('click', e => {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Active tab
  tabsEl.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content

  const tabNumber = clicked.dataset.tab;
  tabsContentEl.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${tabNumber}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////
// Create navigation menu fade animation

const fadeEffect = function (evt) {
  if (evt.target.classList.contains('nav__link')) {
    const link = evt.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(el => {
      // Animate fade for sibling elements except logo
      if (link !== el && !el.querySelector('.nav__logo')) {
        el.style.opacity = this;
      }
    });
  }
};

navBarEl.addEventListener('mouseover', fadeEffect.bind(0.5));
navBarEl.addEventListener('mouseout', fadeEffect.bind(1));

/////////////////////////////
// Reveal sections on scroll

const revealSection = (entries, observer) => {
  const [entry] = entries; /* entry = entries[0] */

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section__hidden');
  observer.unobserve(entry.target);
};

const revealOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);

allSections.forEach(section => {
  section.classList.add('section__hidden');
  sectionObserver.observe(section);
});

/////////////////////////////////////
// Lazy load Features section images

const featureImgs = document.querySelectorAll('img[data-src]');

const lazyLoad = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
};

const lazyOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imgObserver = new IntersectionObserver(lazyLoad, lazyOptions);

featureImgs.forEach(img => imgObserver.observe(img));
