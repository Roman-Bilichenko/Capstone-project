import {
  getCartItems,
  removeFromCart,
  updateQuantity,
  clearCart,
} from './shared/storage';

function renderCart(): void {
  const items = getCartItems();
  const table = document.getElementById('cart-table');
  const empty = document.getElementById('cart-empty');
  const bottom = document.getElementById('cart-bottom');

  if (!table || !empty || !bottom) return;

  if (items.length === 0) {
    table.innerHTML = '';
    empty.style.display = 'block';
    bottom.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  bottom.style.display = 'grid';

  table.innerHTML = `
    <div class="cart__header">
      <span>Image</span>
      <span>Product Name</span>
      <span>Price</span>
      <span>Quantity</span>
      <span>Total</span>
      <span>Delete</span>
    </div>
    ${items
      .map(
        (item) => `
    <div class="cart__item" data-id="${item.product.id}" data-color="${item.product.color}" data-size="${item.product.size}">
      <img src="/${item.product.imageUrl}" alt="${item.product.name}" class="cart__item-img" />
      <p class="cart__item-name">${item.product.name}</p>
      <p class="cart__item-price">$${item.product.price.toLocaleString()}</p>
      <div class="cart__item-quantity">
        <button class="qty-minus" data-action="decrease">-</button>
        <input type="text" value="${item.quantity}" readonly />
        <button class="qty-plus" data-action="increase">+</button>
      </div>
      <p class="cart__item-total">$${(item.product.price * item.quantity).toLocaleString()}</p>
      <button class="cart__item-delete" data-action="delete">
        <img src="/images/icons/dump-cart.svg" alt="Delete" />
      </button>
    </div>
  `,
      )
      .join('')}
  `;

  updateTotals();
  initCartEvents();
}

function updateTotals(): void {
  const items = getCartItems();
  const subtotalEl = document.getElementById('subtotal');
  const discountRow = document.getElementById('discount-row');
  const discountEl = document.getElementById('discount');
  const totalEl = document.getElementById('total');

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = 30;
  const discount = subtotal > 3000 ? subtotal * 0.1 : 0;
  const total = subtotal - discount + shipping;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;

  if (discount > 0) {
    if (discountRow) discountRow.style.display = 'flex';
    if (discountEl) discountEl.textContent = `$${discount.toLocaleString()}`;
  } else if (discountRow) {
    discountRow.style.display = 'none';
  }

  if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
}

function initCartEvents(): void {
  document.querySelectorAll("[data-action='decrease']").forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.cart__item') as HTMLElement;
      const id = item?.dataset.id ?? '';
      const color = item?.dataset.color ?? '';
      const size = item?.dataset.size ?? '';
      const cartItem = getCartItems().find(
        (i) =>
          i.product.id === id &&
          i.product.color === color &&
          i.product.size === size,
      );
      if (cartItem && cartItem.quantity > 1) {
        updateQuantity(id, color, size, cartItem.quantity - 1);
        renderCart();
      }
    });
  });

  document.querySelectorAll("[data-action='increase']").forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.cart__item') as HTMLElement;
      const id = item?.dataset.id ?? '';
      const color = item?.dataset.color ?? '';
      const size = item?.dataset.size ?? '';
      const cartItem = getCartItems().find(
        (i) =>
          i.product.id === id &&
          i.product.color === color &&
          i.product.size === size,
      );
      if (cartItem) {
        updateQuantity(id, color, size, cartItem.quantity + 1);
        renderCart();
      }
    });
  });

  document.querySelectorAll("[data-action='delete']").forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.cart__item') as HTMLElement;
      const id = item?.dataset.id ?? '';
      const color = item?.dataset.color ?? '';
      const size = item?.dataset.size ?? '';
      removeFromCart(id, color, size);
      renderCart();
    });
  });
}

function initClearCart(): void {
  document.getElementById('clear-cart')?.addEventListener('click', () => {
    clearCart();
    renderCart();
  });
}

function initCheckout(): void {
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    clearCart();

    const table = document.getElementById('cart-table');
    const empty = document.getElementById('cart-empty');
    const bottom = document.getElementById('cart-bottom');

    if (table) table.innerHTML = '';
    if (bottom) bottom.style.display = 'none';
    if (empty) {
      empty.textContent = 'Thank you for your purchase.';
      empty.style.display = 'block';
    }
  });
}

export function init(): void {
  renderCart();
  initClearCart();
  initCheckout();
}
