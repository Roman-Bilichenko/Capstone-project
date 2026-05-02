import { initCartCounter } from "./shared/storage";
import { initBurgerMenu } from "./shared/burger";
import { initLoginModal } from "./shared/login-modal";

const path = window.location.pathname;

initCartCounter();
initBurgerMenu();
initLoginModal();

if (path.includes('catalog')) {
  import('./catalog').then(module => module.init());
} else if (path.includes('product-details')) {
  import('./product').then(module => module.init());
} else if (path.includes('cart')) {
  import('./cart').then(module => module.init());
} else if (path.includes('about')) {
  import('./about').then(module => module.init());
} else if (path.includes('contact')) {
  import('./contact').then(module => module.init());
} else {
  import('./home').then(module => module.init());
}