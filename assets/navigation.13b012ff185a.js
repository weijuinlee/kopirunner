(() => {
  const links = [...document.querySelectorAll('.mobile-nav a')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href')));
  function select(index) {
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function update() {
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = index;
    });
    select(current);
  }
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      update();
    });
  }, { passive: true });
  window.addEventListener('resize', update);
  links.forEach((link, index) => link.addEventListener('click', () => select(index)));
  update();
})();
