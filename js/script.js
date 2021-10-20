'use strict';

////////////////
// DOM elements

const allSections = document.querySelectorAll('.section');
const headerEl = document.querySelector('.header');
const navBarEl = document.querySelector('.nav');
const mobileNavBtnEl = document.querySelector('.nav-btn-mobile');
const sectionHeroEl = document.querySelector('.section__hero');
const tabsContainerEl = document.querySelector('.operations__tab-container');
const tabsEl = document.querySelectorAll('.operations__tab');
const tabsContentEl = document.querySelectorAll('.operations__content');
const yearEl = document.querySelector('.year');
const openModalBtns = document.querySelectorAll('.btn__show-modal');
const closeModalBtn = document.querySelector('.btn__close-modal');
const modalEl = document.querySelector('.modal');
const overlayEl = document.querySelector('.overlay');

//////////////////////////////////////////////////
// Animate mobile navigation

mobileNavBtnEl.addEventListener('click', () => {
  headerEl.classList.toggle('nav-open');
});

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
const headerOffset = `-${headerEl.offsetHeight}px`;

const stickyNav = entries => {
  const ent = entries[0];

  if (!ent.isIntersecting) document.body.classList.add('js-sticky');
  else document.body.classList.remove('js-sticky');
};

const stickyOptions = {
  root: null /* Viewport */,
  threshold: 0,
  rootMargin: headerOffset,
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

  if (!ent.isIntersecting) headerEl.classList.add('js-nav-shrink');
  else headerEl.classList.remove('js-nav-shrink');
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

  // Close mobile navigation when link clicked
  if (e.path[2].classList.contains('main-nav-list')) {
    headerEl.classList.toggle('nav-open');
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

// bind value becomes 'this' value in callback function
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

////////////////////////
// Testimonial carousal

const slider = () => {
  const slideEls = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');
  const maxSlides = slideEls.length;
  let slidePosition = 0;

  const createDots = () => {
    slideEls.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const goToSlide = slide => {
    positionSlide(slide);
    activateDot(slide);
  };

  const positionSlide = curSlide => {
    slideEls.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });
  };

  const activateDot = slide => {
    const dotEls = document.querySelectorAll('.dots__dot');
    dotEls.forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    dotEls[slide].classList.add('dots__dot--active');
  };

  const nextSlide = () => {
    if (slidePosition < maxSlides - 1) slidePosition++;
    else slidePosition = 0;
    goToSlide(slidePosition);
  };

  const prevSlide = () => {
    if (slidePosition > 0) slidePosition--;
    else slidePosition = maxSlides - 1;
    goToSlide(slidePosition);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  dotsContainer.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'ArrowLeft') prevSlide();
  });

  const init = () => {
    createDots();
    goToSlide(0);
  };

  init();
};

slider();
