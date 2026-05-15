/**
 * SkyClear shared chrome loader.
 *
 * Each page includes <div data-include="header"></div> and
 * <div data-include="footer"></div>. This script fetches the matching
 * partial from /partials/, rewrites the {{BASE}} placeholder so links
 * work whether the page is at the root or nested under /tools/, and
 * injects it into the DOM. It also marks the current page's nav link
 * as .active and stamps the current year into the footer.
 *
 * Why fetch instead of inline-everything-in-every-page: keeps the
 * header/footer in one place. When we add a new nav item, we change
 * one file, not eight.
 */
(function () {
  // Figure out how many "../" hops back to the site root from this page.
  // We walk up directories until we find /index.html at the root, then
  // hard-code the base. Cleanest approach for a static site: derive from
  // the page's depth.
  function computeBase() {
    // Strip off the filename, count remaining segments.
    var path = window.location.pathname.replace(/\/[^\/]*$/, '');
    var depth = path.split('/').filter(Boolean).length;
    if (depth === 0) return '.';
    return new Array(depth + 1).join('../').replace(/\/$/, '');
  }

  function activateNav() {
    var here = window.location.pathname;
    var navLinks = document.querySelectorAll('.site-nav a[data-nav]');
    navLinks.forEach(function (a) {
      var key = a.getAttribute('data-nav');
      if (key === 'tools' && here.indexOf('/tools') !== -1) a.classList.add('active');
      else if (here.indexOf('/' + key) !== -1) a.classList.add('active');
      else if (key === 'about' && /\/about\.html$/.test(here)) a.classList.add('active');
    });
  }

  function stampYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  function include(name, target) {
    var base = computeBase();
    return fetch(base + '/partials/' + name + '.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        target.outerHTML = html.replace(/\{\{BASE\}\}/g, base);
      })
      .catch(function (e) {
        console.warn('SkyClear: failed to load partial', name, e);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var slots = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    var ps = slots.map(function (s) { return include(s.getAttribute('data-include'), s); });
    Promise.all(ps).then(function () {
      activateNav();
      stampYear();
    });
  });
})();
