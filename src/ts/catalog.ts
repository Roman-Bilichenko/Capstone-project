import type { Product } from './shared/types';
import { addToCart } from './shared/storage';

const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let currentProducts: Product[] = [];
let allProducts: Product[] = [];

async function loadProducts(): Promise<Product[]> {
  const response = await /data.json('/assets/data.json');
  const json = await response.json();
  return json.data;
}

function renderProducts(products: Product[]): void {
  const grid = document.querySelector('.catalog__grid') as HTMLElement;
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML =
      '<p class="catalog__not-found">No products match your filters.</p>';
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
    <article class="product__card" data-id="${product.id}">
      ${product.salesStatus ? '<span class="product__sale product__sale--active">SALE</span>' : ''}
      <img src="/${product.imageUrl}" class="product__img" alt="${product.name}" />
      <div class="product__info">
        <h3 class="product__name">${product.name}</h3>
        <p class="product__price">$${product.price}</p>
        <button class="btn btn--primary product__btn" data-action="add-to-cart">Add To Cart</button>
      </div>
    </article>
  `,
    )
    .join('');
}

function updateResults(total: number, page: number, perPage: number): void {
  const results = document.querySelector('.catalog__results');
  if (!results) return;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  results.textContent = `Showing ${from}–${to} of ${total} results`;
}

function renderPagination(total: number): void {
  const pagination = document.querySelector(
    '.catalog__pagination',
  ) as HTMLElement;
  if (!pagination) return;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  pagination.innerHTML = `
    <button class="pagination__btn pagination__prev" ${currentPage === 1 ? 'disabled' : ''}>
      <img src="/images/icons/arrow.svg" alt="prev" class="pagination__arrow pagination__arrow--left" />
      Prev
    </button>
    ${Array.from({ length: totalPages }, (_, i) => i + 1)
      .map(
        (page) => `
        <button class="pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}" data-page="${page}">
          ${page}
        </button>
      `,
      )
      .join('')}
    <button class="pagination__btn pagination__next" ${currentPage === totalPages ? 'disabled' : ''}>
      Next
      <img src="/images/icons/arrow.svg" alt="next" class="pagination__arrow pagination__arrow--right" />
    </button>
  `;

  pagination.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentPage = Number((btn as HTMLElement).dataset.page);
      applyPagination();
    });
  });

  pagination
    .querySelector('.pagination__prev')
    ?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        applyPagination();
      }
    });

  pagination
    .querySelector('.pagination__next')
    ?.addEventListener('click', () => {
      const totalPages = Math.ceil(currentProducts.length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        applyPagination();
      }
    });
}

function applyPagination(): void {
  if (currentProducts.length === 0) {
    renderProducts([]);
    renderPagination(0);
    updateResults(0, 0, ITEMS_PER_PAGE);
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = currentProducts.slice(start, start + ITEMS_PER_PAGE);

  renderProducts(paginated);
  renderPagination(currentProducts.length);
  updateResults(currentProducts.length, currentPage, ITEMS_PER_PAGE);
}

function filterProducts(
  products: Product[],
  filters: {
    size: string;
    color: string;
    category: string;
    sale: boolean | null;
  },
): Product[] {
  return products.filter((product) => {
    if (filters.size && product.size !== filters.size) return false;
    if (filters.color && product.color !== filters.color) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.sale !== null && product.salesStatus !== filters.sale)
      return false;
    return true;
  });
}

function sortProducts(products: Product[], sortValue: string): Product[] {
  const sorted = [...products];
  switch (sortValue) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'popularity':
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

function showNotFoundPopup(): void {
  const existing = document.querySelector('.catalog__not-found-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.className = 'catalog__not-found-popup';
  popup.textContent = 'Product not found';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

function handleSearch(query: string): void {
  const trimmed = query.toLowerCase().trim();
  if (!trimmed) {
    currentProducts = allProducts;
    currentPage = 1;
    applyPagination();
    return;
  }

  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(trimmed),
  );

  if (filtered.length === 0) {
    currentProducts = [];
    applyPagination();
    showNotFoundPopup();
  } else {
    currentProducts = filtered;
    currentPage = 1;
    applyPagination();
  }
}

function initFiltersPanelToggle(): void {
  const toggleBtn = document.getElementById('toggle-filters-btn');
  const panel = document.getElementById('filters-panel');
  const hideBtn = document.getElementById('hide-filters-btn');
  let timeout: number;

  function openPanel(): void {
    panel?.classList.add('is-open');
    toggleBtn?.classList.add('is-open');
  }

  function closePanel(): void {
    panel?.classList.remove('is-open');
    toggleBtn?.classList.remove('is-open');
  }

  toggleBtn?.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
    openPanel();
  });

  toggleBtn?.addEventListener('mouseleave', () => {
    timeout = window.setTimeout(() => {
      if (!panel?.matches(':hover')) {
        closePanel();
      }
    }, 300);
  });

  panel?.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
    openPanel();
  });

  panel?.addEventListener('mouseleave', () => {
    closePanel();
  });

  hideBtn?.addEventListener('click', () => closePanel());
}

function initFilters(products: Product[]): void {
  const sizeSelect = document.getElementById(
    'filter-size',
  ) as HTMLSelectElement;
  const colorSelect = document.getElementById(
    'filter-color',
  ) as HTMLSelectElement;
  const categorySelect = document.getElementById(
    'filter-category',
  ) as HTMLSelectElement;
  const saleCheckbox = document.getElementById(
    'filter-sale',
  ) as HTMLInputElement;
  const sortSelect = document.getElementById(
    'sort-select',
  ) as HTMLSelectElement;
  const clearBtn = document.getElementById('clear-filters-btn');
  const searchInput = document.getElementById(
    'search-input',
  ) as HTMLInputElement;
  const searchBtn = document.getElementById('search-btn');

  function applyFilters(): void {
    const filters = {
      size: sizeSelect?.value || '',
      color: colorSelect?.value || '',
      category: categorySelect?.value || '',
      sale: saleCheckbox?.checked ? true : null,
    };

    let filtered = filterProducts(products, filters);
    filtered = sortProducts(filtered, sortSelect?.value || 'default');

    currentProducts = filtered;
    currentPage = 1;
    applyPagination();
  }

  sizeSelect?.addEventListener('change', applyFilters);
  colorSelect?.addEventListener('change', applyFilters);
  categorySelect?.addEventListener('change', applyFilters);
  saleCheckbox?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);

  clearBtn?.addEventListener('click', () => {
    if (sizeSelect) sizeSelect.value = '';
    if (colorSelect) colorSelect.value = '';
    if (categorySelect) categorySelect.value = '';
    if (saleCheckbox) saleCheckbox.checked = false;
    if (sortSelect) sortSelect.value = 'default';

    currentProducts = products;
    currentPage = 1;
    applyPagination();
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchInput.value);
    }
  });

  searchBtn?.addEventListener('click', () =>
    handleSearch(searchInput?.value ?? ''),
  );
}

function initProductInteractions(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    if (target.closest("[data-action='add-to-cart']")) {
      const card = target.closest('.product__card') as HTMLElement;
      const product = allProducts.find((p) => p.id === card?.dataset.id);
      if (product) {
        addToCart(product);
        const btn = target.closest(
          "[data-action='add-to-cart']",
        ) as HTMLElement;
        btn.textContent = '✓ Added!';
        setTimeout(() => {
          btn.textContent = 'Add To Cart';
        }, 2000);
      }
      return;
    }

    const card = target.closest('.product__card') as HTMLElement;
    if (card && !target.closest('button')) {
      const id = card.dataset.id;
      if (id) window.location.href = `product-details.html?id=${id}`;
    }
  });
}

export async function init(): Promise<void> {
  const products = await loadProducts();
  allProducts = products;
  currentProducts = products;
  applyPagination();
  initFiltersPanelToggle();
  initFilters(products);
  initProductInteractions();
}
