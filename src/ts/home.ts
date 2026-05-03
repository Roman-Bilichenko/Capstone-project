import type { Product } from './shared/types';
import { addToCart, initCartCounter } from './shared/storage';

let allProducts: Product[] = [];
let currentSlide = 0;

async function loadProducts(): Promise<Product[]> {
  const response = await fetch('/data.json');
  const json = await response.json();
  return json.data;
}

function getProductsByBlock(products: Product[], blockName: string): Product[] {
  return products.filter((product) => product.blocks.includes(blockName));
}

function createProductCard(product: Product): string {
  return `
    <article class="product__card" data-id="${product.id}">
      ${product.salesStatus ? '<div class="product__sale product__sale--active">SALE</div>' : '<div class="product__sale">SALE</div>'}
      <img
        src="/${product.imageUrl}"
        alt="${product.name}"
        class="product__img"
      />
      <div class="product__info">
        <h3 class="product__name">${product.name}</h3>
        <p class="product__price">$${product.price}</p>
        <button class="btn btn--primary product__btn" data-action="add-to-cart">
          Add To Cart
        </button>
      </div>
    </article>
  `;
}

function renderSelectedProducts(products: Product[]): void {
  const grid = document.querySelector('.selected-products__grid');
  if (!grid) return;

  const selectedProducts = getProductsByBlock(products, 'Selected Products');
  grid.innerHTML = selectedProducts.map(createProductCard).join('');
}

function renderNewProducts(products: Product[]): void {
  const grid = document.querySelector('.new-products__grid');
  if (!grid) return;

  const newProducts = getProductsByBlock(products, 'New Products Arrival');
  grid.innerHTML = newProducts.map(createProductCard).join('');
}

function initTravelSlider(): void {
  const grid = document.querySelector('.travel__grid') as HTMLElement;
  if (!grid) return;

  const slides = [
    {
      img: '/images/products/travel-suitcase-1.png',
      title: 'Adventure Awaits: Explore in Style',
      description:
        'Premium luggage designed for the modern traveler. Lightweight, durable, and ready for any journey.',
    },
    {
      img: '/images/products/travel-suitcase-2.png',
      title: 'Weekend Gateway Essentials',
      description:
        'Compact yet spacious. Perfect for short trips and weekend adventures with everything you need.',
    },
    {
      img: '/images/products/travel-suitcase-3.png',
      title: 'Business Travel Made Easy',
      description:
        'Professional look with smart organization. Keep your suits wrinkle-free and devices protected.',
    },
    {
      img: '/images/products/travel-suitcase-4.png',
      title: 'Family Vacation Companion',
      description:
        'Extra durable for family trips. Spacious compartments keep everyone organized on the go.',
    },
  ];

  const totalSlides = slides.length;
  let slideInterval: number | null = null;

  function getVisibleSlides(startIndex: number): typeof slides {
    const result = [];

    const width = window.innerWidth;
    let visibleCount = 4;
    if (width <= 767) {
      visibleCount = 1;
    } else if (width <= 1023) {
      visibleCount = 2;
    }

    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % totalSlides;
      result.push(slides[index]);
    }
    return result;
  }

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'travel__dots';

  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = `travel__dot ${index === 0 ? 'travel__dot--active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
    dotsContainer.appendChild(dot);
  });

  const section = document.querySelector('.travel');
  if (section) {
    section.appendChild(dotsContainer);
  }

  function renderSlides(startIndex: number): void {
    const visibleSlides = getVisibleSlides(startIndex);

    grid.innerHTML = visibleSlides
      .map(
        (slide) => `
      <div class="travel__card">
        <img src="${slide.img}" alt="${slide.title}" class="travel__card-img" />
        <div class="travel__card-overlay">
          <h3 class="travel__card-title">${slide.title}</h3>
          <p class="travel__card-text">${slide.description}</p>
        </div>
      </div>
    `,
      )
      .join('');

    const dots = dotsContainer.querySelectorAll('.travel__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('travel__dot--active', i === startIndex);
    });
  }

  function goToSlide(index: number): void {
    currentSlide = index;
    renderSlides(currentSlide);
    resetAutoSlide();
  }

  function nextSlide(): void {
    currentSlide = (currentSlide + 1) % totalSlides;
    renderSlides(currentSlide);
  }

  function resetAutoSlide(): void {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
    slideInterval = window.setInterval(nextSlide, 5000);
  }

  renderSlides(0);

  resetAutoSlide();
}

function initAddToCartButtons(): void {
  document.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest(
      "[data-action='add-to-cart']",
    );
    if (!button) return;

    const card = button.closest('.product__card') as HTMLElement;
    if (!card) return;

    const productId = card.dataset.id;
    const product = allProducts.find((p) => p.id === productId);

    if (product) {
      addToCart(product);

      button.textContent = '✓ Added!';

      setTimeout(() => {
        button.textContent = 'Add To Cart';
        button.classList.remove('btn--added');
      }, 2000);
    }
  });
}

function initProductCardNavigation(): void {
  document.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest("[data-action='add-to-cart']")) {
      return;
    }

    const card = (event.target as HTMLElement).closest(
      '.product__card',
    ) as HTMLElement;
    if (!card) return;

    const productId = card.dataset.id;
    if (productId) {
      window.location.href = `./html/product-details.html?id=${productId}`;
    }
  });
}

export async function init(): Promise<void> {
  initCartCounter();

  allProducts = await loadProducts();

  renderSelectedProducts(allProducts);
  renderNewProducts(allProducts);

  initTravelSlider();
  initAddToCartButtons();
  initProductCardNavigation();
}
