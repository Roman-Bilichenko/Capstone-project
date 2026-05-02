export function initBurgerMenu(): void {
  const burgerBtn = document.getElementById("burger-btn");
  const headerNav = document.getElementById("header-nav");
  const overlay = document.getElementById("header-overlay");
  const navLinks = document.querySelectorAll(".header__nav-link");

  if (!burgerBtn || !headerNav || !overlay) return;

  function openMenu(): void {
    burgerBtn?.classList.add("header__burger--active");
    headerNav?.classList.add("header__nav--open");
    overlay?.classList.add("header__overlay--visible");
    document.body.style.overflow = "hidden";
  }

  function closeMenu(): void {
    burgerBtn?.classList.remove("header__burger--active");
    headerNav?.classList.remove("header__nav--open");
    overlay?.classList.remove("header__overlay--visible");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", () => {
    const isOpen = headerNav.classList.contains("header__nav--open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && headerNav.classList.contains("header__nav--open")) {
      closeMenu();
    }
  });
}