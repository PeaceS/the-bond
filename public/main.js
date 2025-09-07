function formatId(id) {
  const idAsString = String(id);
  const paddedId = idAsString.padStart(3, '0');

  return `TB-${paddedId}`;
}

async function fetchProducts() {
  try {
    const response = await fetch('/products');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    const productContainer = document.getElementById('product-container');
    const productTemplate = document.getElementById('product-template');

    products.forEach(product => {
      const productDiv = productTemplate.cloneNode(true);
      productDiv.removeAttribute('id');

      titleDiv = productDiv.querySelector('.product-title');
      titleDiv.textContent = formatId(product.id);

      imageDiv = productDiv.querySelector('.product-image');
      imageDiv.src = `images/the-bond/${product.id}.jpg`;
      imageDiv.alt = formatId(product.id);

      // descriptionDiv = productDiv.querySelector('.product-description');
      // descriptionDiv.textContent = product.description;

      priceDiv = productDiv.querySelector('.product-price');
      priceDiv.classList.add(product.currency);
      priceDiv.textContent = product.price;

      productContainer.appendChild(productDiv);
    });

    productContainer.removeChild(productTemplate);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

fetchProducts();
