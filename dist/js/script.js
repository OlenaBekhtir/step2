const toggler = document.querySelector('.header__burger-toggler');
const menuMobile = document.querySelector('.nav-menu-mobile');
const body = document.body;

function handlerBurger(e) {
  if (
    (!e.target.closest('.nav-menu-mobile') && menuMobile.classList.contains('active')) ||
    e.target === toggler
  ) {
    toggler.classList.toggle('active');
    menuMobile.classList.toggle('active');
  }
}

function handlerResize(e) {
  const minWidth = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--sm-max-content'
    )
  );
  const currentWidth = window.innerWidth;

  if (currentWidth > minWidth) {
    toggler.classList.remove('active');
    menuMobile.classList.remove('active');
  }
}

body.addEventListener('click', handlerBurger);
window.addEventListener('resize', handlerResize);
