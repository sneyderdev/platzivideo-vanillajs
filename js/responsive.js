/* ----- RESPONSIVE ----- */
const $sidebar = document.getElementById('sidebar');
const $burgerBtn = document.getElementById('burger_btn');
const $overlay = document.getElementById('overlay');
const $closeSidebarBtn = document.getElementById('close_btn');

$burgerBtn.addEventListener('click', () => {
  $sidebar.classList.add('sidebar_open');
  $overlay.classList.add('overlay_open');
  $closeSidebarBtn.classList.add('show_close_btn');
});

$overlay.addEventListener('click', () => {
  $overlay.classList.remove('overlay_open');
  $closeSidebarBtn.classList.remove('show_close_btn');
  $sidebar.classList.remove('sidebar_open');
});

$closeSidebarBtn.addEventListener('click', () => {
  $overlay.classList.remove('overlay_open');
  $closeSidebarBtn.classList.remove('show_close_btn');
  $sidebar.classList.remove('sidebar_open');
});


