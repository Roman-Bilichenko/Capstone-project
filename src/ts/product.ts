import type { Product } from './shared/types';
import { addToCart } from './shared/storage';

let product: Product | null = null;
let allProducts: Product[] = [];

async function loadProducts(): Promise<Product[]> {
const response = await fetch('/data.json');  const json = await response.json();
  return json.data;
}

function getProductId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderProduct(): void {
  if (!product) return;

  const title = document.getElementById('product-title');
  const price = document.getElementById('product-price');
  const image = document.getElementById(
    'product-main-image',
  ) as HTMLImageElement;
  const ratingStars = document.getElementById('product-rating-stars');
  const reviewProductName = document.getElementById('review-product-name');

  if (title) title.textContent = product.name;
  if (price) price.textContent = `$${product.price}`;
  if (image) image.src = `../../${product.imageUrl}`;
  if (reviewProductName) reviewProductName.textContent = product.name;
  if (ratingStars) {
    ratingStars.innerHTML =
      '★'.repeat(Math.floor(product.rating)) +
      '☆'.repeat(5 - Math.floor(product.rating));
  }

  const sizeSelect = document.getElementById(
    'product-size',
  ) as HTMLSelectElement;
  if (sizeSelect) {
    sizeSelect.innerHTML =
      '<option>Choose size</option>' +
      product.size
        .split(', ')
        .map((s) => `<option value="${s}">${s}</option>`)
        .join('');
  }

  const colorSelect = document.getElementById(
    'product-color',
  ) as HTMLSelectElement;
  if (colorSelect) {
    colorSelect.innerHTML = `<option>Choose color</option><option value="${product.color}">${product.color}</option>`;
  }

  const catSelect = document.getElementById(
    'product-category',
  ) as HTMLSelectElement;
  if (catSelect) {
    catSelect.innerHTML = `<option>${product.category}</option>`;
  }
}

function initQuantity(): void {
  const input = document.getElementById('qty-input') as HTMLInputElement;
  const minus = document.getElementById('qty-minus');
  const plus = document.getElementById('qty-plus');

  minus?.addEventListener('click', () => {
    const val = parseInt(input.value);
    if (val > 1) input.value = (val - 1).toString();
  });

  plus?.addEventListener('click', () => {
    const val = parseInt(input.value);
    input.value = (val + 1).toString();
  });
}

function initAddToCart(): void {
  const btn = document.getElementById('add-to-cart-btn');
  const qtyInput = document.getElementById('qty-input') as HTMLInputElement;

  btn?.addEventListener('click', () => {
    if (!product) return;
    const qty = parseInt(qtyInput?.value || '1');
    addToCart(product, qty);
    btn.textContent = '✓ Added!';
    setTimeout(() => {
      btn.textContent = 'Add To Cart';
    }, 2000);
  });
}

function initTabs(): void {
  const btns = document.querySelectorAll('.tabs__btn');
  const contents = document.querySelectorAll('.tabs__content');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = (btn as HTMLElement).dataset.tab;
      btns.forEach((b) => b.classList.remove('tabs__btn--active'));
      btn.classList.add('tabs__btn--active');
      contents.forEach((c) => c.classList.remove('tabs__content--active'));
      document
        .getElementById(`tab-${tab}`)
        ?.classList.add('tabs__content--active');
    });
  });
}

function initReviewForm(): void {
  const form = document.getElementById('review-form') as HTMLFormElement;
  const message = document.getElementById('review-message');
  const stars = document.querySelectorAll<HTMLElement>('#rating-stars span');
  let selectedRating = 0;

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      selectedRating = Number(star.dataset.star);
      stars.forEach((s, i) => {
        s.style.color = i < selectedRating ? 'gold' : '#ccc';
      });
    });

    star.addEventListener('mouseenter', () => {
      const val = Number(star.dataset.star);
      stars.forEach((s, i) => {
        s.style.color = i < val ? 'gold' : '#ccc';
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => {
        s.style.color = i < selectedRating ? 'gold' : '#ccc';
      });
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (message) {
      message.textContent = 'Thank you for your review!';
      message.style.color = '#2ecc71';
      form.reset();
      stars.forEach((s) => {
        s.style.color = '#ccc';
      });
      selectedRating = 0;
      setTimeout(() => {
        message.textContent = '';
      }, 3000);
    }
  });
}

function renderRelated(): void {
  const grid = document.getElementById('related-grid');
  if (!grid) return;

  const related = allProducts
    .filter((p) => p.id !== product?.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  grid.innerHTML = related
    .map(
      (p) => `
    <article class="product__card" data-id="${p.id}">
      ${p.salesStatus ? '<div class="product__sale product__sale--active">SALE</div>' : ''}
      <img src="/${p.imageUrl}" class="product__img" alt="${p.name}" />
      <div class="product__info">
        <h3 class="product__name">${p.name}</h3>
        <p class="product__price">$${p.price}</p>
        <button class="btn btn--primary product__btn" data-action="add-to-cart">Add To Cart</button>
      </div>
    </article>
  `,
    )
    .join('');

  grid.querySelectorAll('.product__card').forEach((card) => {
    const el = card as HTMLElement;
    const id = el.dataset.id;

    el.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) return;
      if (id) window.location.href = `product-details.html?id=${id}`;
    });

    const btn = el.querySelector("[data-action='add-to-cart']") as HTMLElement;
    btn?.addEventListener('click', () => {
      const prod = allProducts.find((p) => p.id === id);
      if (prod) {
        addToCart(prod);
        btn.textContent = '✓ Added!';
        setTimeout(() => {
          btn.textContent = 'Add To Cart';
        }, 2000);
      }
    });
  });
}

export async function init(): Promise<void> {
  allProducts = await loadProducts();
  const id = getProductId();
  product = allProducts.find((p) => p.id === id) || null;

  if (!product) {
    window.location.href = 'catalog.html';
    return;
  }

  renderProduct();
  initQuantity();
  initAddToCart();
  initTabs();
  initReviewForm();
  renderRelated();
}
