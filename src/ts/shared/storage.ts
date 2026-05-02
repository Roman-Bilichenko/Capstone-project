import type { Product, CartItem, CartData } from "./types";

const CART_KEY = "suitcase-shop-cart";

function getCartData(): CartData {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) {
    return { items: [] };
  }
  try {
    return JSON.parse(raw) as CartData;
  } catch {
    return { items: [] };
  }
}

function saveCartData(data: CartData): void {
  localStorage.setItem(CART_KEY, JSON.stringify(data));
}

export function getCartItems(): CartItem[] {
  return getCartData().items;
}

export function getCartCount(): number {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(product: Product, quantity: number = 1): void {
  const data = getCartData();
  const existing = data.items.find(
    (item) =>
      item.product.id === product.id &&
      item.product.color === product.color &&
      item.product.size === product.size,
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    data.items.push({ product, quantity });
  }

  saveCartData(data);
  updateCartCounter();
}

export function removeFromCart(
  productId: string,
  color: string,
  size: string,
): void {
  const data = getCartData();
  data.items = data.items.filter(
    (item) =>
      !(
        item.product.id === productId &&
        item.product.color === color &&
        item.product.size === size
      ),
  );
  saveCartData(data);
  updateCartCounter();
}

export function updateQuantity(
  productId: string,
  color: string,
  size: string,
  quantity: number,
): void {
  const data = getCartData();
  const item = data.items.find(
    (item) =>
      item.product.id === productId &&
      item.product.color === color &&
      item.product.size === size,
  );

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    item.quantity = quantity;
    saveCartData(data);
    updateCartCounter();
  }
}

export function clearCart(): void {
  localStorage.setItem(CART_KEY, JSON.stringify({ items: [] }));
  updateCartCounter();
}

export function getCartTotal(): number {
  return getCartItems().reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}

export function getDiscountedTotal(): {
  original: number;
  discount: number;
  final: number;
} {
  const original = getCartTotal();
  const discount = original > 3000 ? original * 0.1 : 0;
  const final = original - discount;

  return { original, discount, final };
}

export function updateCartCounter(): void {
  const count = getCartCount();
  const counter = document.querySelector(".header__cart-count");

  if (!counter) return;

  counter.textContent = count.toString();

  if (count === 0) {
    counter.classList.add("header__cart-count--hidden");
  } else {
    counter.classList.remove("header__cart-count--hidden");
  }
}

export function initCartCounter(): void {
  updateCartCounter();
}
