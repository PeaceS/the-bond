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
  
        imageDiv = productDiv.querySelector('.product-image');
        imageDiv.src = `images/the-bond/${product.id}/1.png`;
        imageDiv.alt = formatId(product.id);
  
        descriptionDiv = productDiv.querySelector('.product-description');
        descriptionDiv.textContent = product.description;
  
        priceDiv = productDiv.querySelector('.product-price');
        priceDiv.classList.add(product.currency);
        priceDiv.textContent = product.price;

        let currentImageIndex = 0;
        const images = [
          `images/the-bond/${product.id}/1.png`,
          `images/the-bond/${product.id}/2.png`,
          `images/the-bond/${product.id}/3.png`
        ];
  
        const updateImage = () => {
          // Fade out the current image
          imageDiv.classList.remove('show');
          console.log(imageDiv);
  
          // Wait for the fade-out to complete before changing the image source
          setTimeout(() => {
              imageDiv.src = images[currentImageIndex];
              // Fade in the new image
              imageDiv.classList.add('show');
          }, 500); // This delay should match the CSS transition duration
        };

        prevBtn = productDiv.querySelector('.previous-btn');
        prevBtn.addEventListener('click', () => {
          console.log(currentImageIndex);
          currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
          updateImage();
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