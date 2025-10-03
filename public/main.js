document.addEventListener('DOMContentLoaded', () => {
  let isLoading = false;
  let loadedBondIds = [];

  const apiURL = '/products';

  function formatId(id) {
    const idAsString = String(id);
    const paddedId = idAsString.padStart(3, '0');
  
    return `TB-${paddedId}`;
  }
  
  async function fetchProducts(id) {
    try {
      if (isLoading) return; // Prevent multiple simultaneous requests
      isLoading = true;
  
      const productContainer = document.getElementById('product-container');
      const url = new URL(apiURL, window.location.origin);

      if (id) {
        loadedBondIds = [];
        for (const row of productContainer.querySelectorAll('.removable')) {
          row.remove();
        }

        url.searchParams.set('searchId', id);
      }

      if (loadedBondIds.length > 0) {
        url.searchParams.set('excludeIds', loadedBondIds.join(','));
      }
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const products = await response.json();
      const productTemplate = document.getElementById('product-template');
      productTemplate.classList.remove('hide');
  
      products.forEach(product => {
        const productDiv = productTemplate.cloneNode(true);
        productDiv.removeAttribute('id');
  
        titleDiv = productDiv.querySelector('.product-title');
        titleDiv.textContent = formatId(product.id);

        if (product.sold) {
          const redDot = document.createElement('i');
          redDot.classList.add('red-dot-icon');
          titleDiv.appendChild(redDot);
        }
  
        imageDiv = productDiv.querySelector('.product-image');
        imageDiv.src = `images/the-bond/${product.id}/a.webp`;
        imageDiv.alt = formatId(product.id);
        imageDiv.id = formatId(product.id)

        let currentImageIndex = 0;
        const images = [
          `images/the-bond/${product.id}/a.webp`,
          `images/the-bond/${product.id}/b.webp`
        ];

        const updateImage = (id) => {
          imageDiv = document.getElementById(id);
          imageDiv.classList.remove('show');
  
          // Wait for the fade-out to complete before changing the image source
          setTimeout(() => {
              imageDiv.src = images[currentImageIndex];
              // Fade in the new image
              imageDiv.classList.add('show');
          }, 500); // This delay should match the CSS transition duration
        };

        prevBtn = productDiv.querySelector('.previous-btn');
        prevBtn.addEventListener('click', () => {
          currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
          updateImage(formatId(product.id));
        });

        nextBtn = productDiv.querySelector('.next-btn');
        nextBtn.addEventListener('click', () => {
          currentImageIndex = (currentImageIndex + 1) % images.length;
          updateImage(formatId(product.id));
        });
  
        // Preload
        const preload = document.createElement('link');
        preload.rel = 'preload';
        preload.as = 'image';
        preload.href = images[1];
        document.head.appendChild(preload);

        productDiv.classList.add('removable');
        productContainer.appendChild(productDiv);
        loadedBondIds.push(product.id);
      });
  
      productTemplate.classList.add('hide');
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      isLoading = false;
    }
  }

  async function bindTheBondSearch() {
    const searchInput = document.getElementById('search-the-bond');
    let timeoutId;
  
    searchInput.addEventListener('input', function(event) {
      const itemId = event.target.value;
  
      // Clear the previous timeout to reset the timer
      clearTimeout(timeoutId);
  
      // Set a new timeout to call the function after 500ms
      timeoutId = setTimeout(async () => {
        await fetchProducts(itemId);
      }, 500); // Wait for 500 milliseconds before calling
    });
  }

  async function scrollToLoad() {
    window.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        if (!isLoading) {
          fetchProducts();
        }
      }
    });
  }

  async function checkHomeSource() {
    const urlParams = new URLSearchParams(window.location.search);
    const sourceValue = urlParams.get('source');

    if (sourceValue == 'artmuc') {
      const homeIcon = document.getElementById('home');
      homeIcon.classList.remove('hide');
    }
  }

  async function bindStripeButton() {
    async function createSession() {
      const response = await fetch('/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    }

    const stripeLink = document.querySelector('.stripe-link');
    stripeLink.addEventListener('click', async (event) => {
      event.preventDefault();
      const button = event.currentTarget;
      const loader = button.querySelector('.loader');
      const icon = button.querySelector('.icon');

      loader.classList.add('loading');
      icon.classList.add('hide');
      try {
        const checkoutLink = await createSession();
        window.location.href = checkoutLink.url;
      } finally {
        loader.classList.remove('loading');
        icon.classList.remove('hide');
      }
    });
  }

  async function fetchVat() {
    const response = await fetch('/config/THE_BOND_VAT');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const vat = await response.text();
    const textVat = document.getElementById('vat');

    textVat.textContent = vat;
  }

  fetchProducts();
  bindTheBondSearch();
  scrollToLoad();
  checkHomeSource();
  bindStripeButton();
  fetchVat();
});
