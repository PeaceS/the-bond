document.addEventListener('DOMContentLoaded', () => {
  let isLoading = false;
  let loadedBondIds = [];

  const apiURL = '/products';

  function formatId(id) {
    const idAsString = String(id);
    const paddedId = idAsString.padStart(3, '0');
  
    return `TB-${paddedId}`;
  }
  
  async function fetchProducts() {
    try {
      if (isLoading) return; // Prevent multiple simultaneous requests
      isLoading = true;
  
      const url = new URL(apiURL, window.location.origin);
      if (loadedBondIds.length > 0) {
        url.searchParams.set('excludeIds', loadedBondIds.join(','));
      }
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const products = await response.json();
      const productContainer = document.getElementById('product-container');
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
        imageDiv.src = `images/the-bond/${product.id}/a.jpg`;
        imageDiv.alt = formatId(product.id);
        imageDiv.id = formatId(product.id)

        let currentImageIndex = 0;
        const images = [
          `images/the-bond/${product.id}/a.jpg`,
          `images/the-bond/${product.id}/b.jpg`,
          `images/the-bond/${product.id}/c.jpg`
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

  fetchProducts();

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (!isLoading) {
        fetchProducts();
      }
    }
  });
});