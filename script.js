const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const productGrid = document.querySelector("#productGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const productSearch = document.querySelector("#productSearch");
const productCount = document.querySelector("#productCount");
const productModal = document.querySelector("#productModal");
const modalContent = document.querySelector("#modalContent");
const modalClose = document.querySelector(".modal-close");

const products = (window.rpvProducts || [])
  .filter((product) => product.status === "active")
  .sort((a, b) => a.sortOrder - b.sortOrder);

let currentCategory = "All";

function uniqueCategories() {
  return ["All", ...new Set(products.map((product) => product.category))];
}

function productMatchesSearch(product, keyword) {
  const text = [
    product.nameTh,
    product.nameEn,
    product.model,
    product.category,
    product.shortDescriptionTh,
    product.shortDescriptionEn
  ].join(" ").toLowerCase();

  return text.includes(keyword.toLowerCase());
}

function filteredProducts() {
  const keyword = productSearch.value.trim();

  return products.filter((product) => {
    const categoryMatch = currentCategory === "All" || product.category === currentCategory;
    const searchMatch = keyword === "" || productMatchesSearch(product, keyword);
    return categoryMatch && searchMatch;
  });
}

function renderFilters() {
  categoryFilters.innerHTML = "";

  uniqueCategories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = category === "All" ? "สินค้าทั้งหมด" : category;
    button.setAttribute("aria-pressed", String(category === currentCategory));

    button.addEventListener("click", () => {
      currentCategory = category;
      renderFilters();
      renderProducts();
    });

    categoryFilters.appendChild(button);
  });
}

function imageMarkup(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.nameTh} ${product.nameEn}" loading="lazy">`;
  }

  return `
    <div class="product-placeholder" role="img" aria-label="ยังไม่มีรูปสินค้าสำหรับ ${product.nameEn}">
      <span>RPV</span>
      <small>Product</small>
    </div>
  `;
}

function renderProducts() {
  const visibleProducts = filteredProducts();

  productCount.textContent = `แสดง ${visibleProducts.length} จาก ${products.length} รายการ`;
  productGrid.innerHTML = "";

  visibleProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = `product-card${product.featured ? " featured" : ""}`;
    card.innerHTML = `
      <div class="product-image">${imageMarkup(product)}</div>
      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3>${product.nameTh}</h3>
        <p class="product-en">${product.nameEn}${product.model ? ` / ${product.model}` : ""}</p>
        <p class="product-desc">${product.shortDescriptionTh}</p>
        <ul class="feature-list">
          ${product.features.slice(0, 3).map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <div class="price-note">สอบถามราคา</div>
      </div>
      <div class="product-actions">
        <button class="button detail" type="button" data-detail="${product.id}">ดูรายละเอียด</button>
        <a class="button primary" href="https://line.me/R/ti/p/@rpvofficial" target="_blank" rel="noopener">สอบถามราคา</a>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

function openProductModal(product) {
  modalContent.innerHTML = `
    <div class="modal-layout">
      <div class="product-image modal-image">${imageMarkup(product)}</div>
      <div>
        <span class="product-category">${product.category}</span>
        <h2>${product.nameTh}</h2>
        <p class="product-en">${product.nameEn}${product.model ? ` / ${product.model}` : ""}</p>
        <p>${product.shortDescriptionTh}</p>
        <h3>จุดเด่นที่ยืนยันได้</h3>
        <ul class="feature-list modal-features">
          ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <h3>ข้อมูลเพิ่มเติม</h3>
        <p>ยังไม่มีสเปกละเอียดหรือราคาที่ตรวจสอบครบถ้วน จึงแสดงเป็น “สอบถามราคา” เพื่อหลีกเลี่ยงข้อมูลผิดพลาด</p>
        <div class="modal-actions">
          <a class="button line" href="https://line.me/R/ti/p/@rpvofficial" target="_blank" rel="noopener">เพิ่ม LINE</a>
          <a class="button secondary" href="tel:021944346">โทร 02-194-4346-7</a>
        </div>
      </div>
    </div>
  `;
  productModal.showModal();
}

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

productSearch.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-detail]");

  if (!detailButton) {
    return;
  }

  const product = products.find((item) => item.id === detailButton.dataset.detail);

  if (product) {
    openProductModal(product);
  }
});

modalClose.addEventListener("click", () => productModal.close());
productModal.addEventListener("click", (event) => {
  if (event.target === productModal) {
    productModal.close();
  }
});

renderFilters();
renderProducts();
