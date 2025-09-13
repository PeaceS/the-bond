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
        imageDiv.src = `images/the-bond/${product.id}.png`;
        imageDiv.alt = formatId(product.id);
  
        descriptionDiv = productDiv.querySelector('.product-description');
        descriptionDiv.textContent = product.description;
  
        priceDiv = productDiv.querySelector('.product-price');
        priceDiv.classList.add(product.currency);
        priceDiv.textContent = product.price;
  
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