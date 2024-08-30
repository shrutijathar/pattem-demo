document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const categoryFilterMobile = document.getElementById('category-filter-mobile');
    const priceSort = document.getElementById('price-sort');

    let products = [];
    let displayedProducts = [];
    let start = 0;
    const limit = 10;

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            showShimmer(); // Show shimmer effect
            const response = await fetch('https://fakestoreapi.com/products');
            products = await response.json();
            displayedProducts = products;  // Initialize displayedProducts with all products
            populateCategoryCheckboxes();
            populateCategoryFilter();
            displayProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            productList.innerHTML = '<p>Failed to load products. Please try again later.</p>';
        } finally {
            hideShimmer(); // Hide shimmer effect
        }
    };

    // Show shimmer effect
    const showShimmer = () => {
        for (let i = 0; i < limit; i++) {
            const shimmerElement = document.createElement('div');
            shimmerElement.className = 'product-placeholder shimmer-wrapper';
            shimmerElement.innerHTML = `
                <div class="shimmer"></div>
            `;
            productList.appendChild(shimmerElement);
        }
    };

    // Hide shimmer effect
    const hideShimmer = () => {
        const shimmerElements = document.querySelectorAll('.product-placeholder');
        shimmerElements.forEach(element => element.remove());
    };

    // Populate category checkboxes
    const populateCategoryCheckboxes = () => {
        // Create "All" checkbox
        const allLabel = document.createElement('label');
        allLabel.innerHTML = `
            <input type="checkbox" value="all" checked>
            All
        `;
        categoryFilter.appendChild(allLabel);

        const categories = [...new Set(products.map(product => product.category))];
        categories.forEach(category => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" value="${category}">
                ${category}
            `;
            categoryFilter.appendChild(label);
        });

        // Add event listener for filtering
        categoryFilter.addEventListener('change', filterAndSortProducts);
    };

    // Populate category filter for mobile
    const populateCategoryFilter = () => {
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All';
        categoryFilterMobile.appendChild(allOption);

        const categories = [...new Set(products.map(product => product.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilterMobile.appendChild(option);
        });
    };

    // Display products
    const displayProducts = () => {
        const slicedProducts = displayedProducts.slice(start, start + limit);
        slicedProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <div class="proImg">
                <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="proDesc pt-1">
                <h5>${product.title.slice(0, 50)}...</h5>
                <p class="pt-1">$${product.price}</p>
                </div>
            `;
            productList.appendChild(productElement);
        });
        start += limit;

        if (start >= displayedProducts.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    };

    // Filter and sort products
    const filterAndSortProducts = () => {
        let filteredProducts = products;

        // Filter by checkbox category
        const selectedCategories = Array.from(categoryFilter.querySelectorAll('input:checked')).map(input => input.value);

        if (!selectedCategories.includes('all') && selectedCategories.length > 0) {
            filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
        }

        // Filter by mobile dropdown category
        const mobileCategory = categoryFilterMobile.value;
        if (mobileCategory && mobileCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === mobileCategory);
        }

        // Sort by price
        const sort = priceSort.value;
        if (sort === 'asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        // Search by name
        const searchQuery = searchInput.value.toLowerCase();
        if (searchQuery) {
            filteredProducts = filteredProducts.filter(product =>
                product.title.toLowerCase().includes(searchQuery)
            );
        }

        productList.innerHTML = '';
        start = 0;
        displayedProducts = filteredProducts;
        displayProducts();
    };

    // Event Listeners
    loadMoreButton.addEventListener('click', displayProducts);
    categoryFilterMobile.addEventListener('change', filterAndSortProducts);
    searchInput.addEventListener('input', filterAndSortProducts);
    priceSort.addEventListener('change', filterAndSortProducts);

    // Initial fetch
    fetchProducts();
});
