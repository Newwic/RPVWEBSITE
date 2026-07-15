const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const productGrid = document.querySelector("#productGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const productSearch = document.querySelector("#productSearch");
const productCount = document.querySelector("#productCount");
const productModal = document.querySelector("#productModal");
const modalContent = document.querySelector("#modalContent");
const modalClose = document.querySelector(".modal-close");
const languageButtons = document.querySelectorAll("[data-lang]");

const products = (window.rpvProducts || [])
  .filter((product) => product.status === "active")
  .sort((a, b) => a.sortOrder - b.sortOrder);

let currentCategory = "All";
const urlLanguage = new URLSearchParams(window.location.search).get("lang");
let currentLanguage = ["th", "en"].includes(urlLanguage)
  ? urlLanguage
  : localStorage.getItem("rpvLanguage") || "th";

const productThai = {
  "vibratory-finishing-machine": {
    name: "เครื่องขัดแบบเขย่า",
    description: "เครื่องจักรสำหรับงานลบคม ขัดผิว และขัดเงาชิ้นงานในกระบวนการ mass finishing"
  },
  "centrifugal-finishing-machine": {
    name: "เครื่องขัดแบบจานหมุน",
    description: "เครื่องขัดสำหรับงานที่ต้องการแรงขัดสูงและรอบการทำงานรวดเร็ว"
  },
  "barrel-rotary-finishing-machine": {
    name: "เครื่องขัดแบบถังกลิ้ง",
    description: "เครื่องขัดแบบถังสำหรับงานขัดชิ้นงานจำนวนมากและงานผิวที่ต้องใช้เวลา"
  },
  "dryer-machine": {
    name: "เครื่องอบแห้ง",
    description: "เครื่องอบแห้งสำหรับชิ้นงานหลังผ่านกระบวนการขัดหรือล้าง"
  },
  "vibratory-separator": {
    name: "เครื่องแยกชิ้นงาน",
    description: "เครื่องช่วยแยกชิ้นงานออกจาก media หลังจบกระบวนการขัด"
  },
  "magnetic-polishing-machine": {
    name: "เครื่องขัดระบบแม่เหล็ก",
    description: "เครื่องขัดสำหรับชิ้นงานขนาดเล็กหรือชิ้นงานที่มีรายละเอียดซับซ้อน"
  },
  "magnetic-pins": {
    name: "เข็มขัดแม่เหล็ก",
    description: "วัสดุขัดสำหรับใช้งานร่วมกับเครื่องขัดระบบแม่เหล็ก"
  },
  "ceramic-media": {
    name: "หินขัดเซรามิก",
    description: "วัสดุขัดเซรามิกสำหรับเครื่องขัดแบบเขย่าและเครื่องขัดผิว"
  },
  "plastic-media": {
    name: "หินขัดพลาสติก",
    description: "วัสดุขัดพลาสติกสำหรับงานขัดที่ต้องการถนอมผิวชิ้นงาน"
  },
  "stainless-steel-media": {
    name: "วัสดุขัดสแตนเลส",
    description: "วัสดุขัดโลหะสำหรับงานขัดเงาและงานผิวที่ต้องการความสม่ำเสมอ"
  },
  "compound-chemicals": {
    name: "น้ำยาขัดและเคมีภัณฑ์",
    description: "น้ำยาขัด น้ำยาล้าง และสารช่วยในกระบวนการขัดผิวชิ้นงาน"
  },
  "glass-beads-no-12": {
    name: "เม็ดแก้วพ่นทราย เบอร์ 12",
    description: "เม็ดแก้วสำหรับงานพ่นผิว งานลบคมละเอียด และงานผิว satin"
  },
  "steel-shot": {
    name: "เม็ดเหล็กกลม",
    description: "เม็ดเหล็กกลมสำหรับงาน shot blasting และเตรียมผิวโลหะ"
  },
  "steel-grit": {
    name: "เม็ดเหล็กทรงเหลี่ยม",
    description: "เม็ดเหล็กทรงเหลี่ยมสำหรับสร้าง profile และเตรียมผิวโลหะ"
  },
  "carbon-steel-cut-wire": {
    name: "เม็ดลวดตัดคาร์บอนสตีล",
    description: "เม็ดลวดตัดสำหรับงาน shot peening และงานลบคม"
  },
  "portable-under-blaster": {
    name: "เครื่องพ่นทรายแบบพกพา",
    description: "เครื่องพ่นทรายแบบพกพาสำหรับงานภาคสนาม งานซ่อมบำรุง และงานเตรียมผิว"
  }
};

const ui = {
  th: {
    title: "RPV Industrial Supply | เครื่องขัดผิว วัสดุขัด และอุปกรณ์อุตสาหกรรม",
    quoteButton: "สอบถามราคา",
    heroTitle: "โซลูชันเครื่องขัดผิวและอุปกรณ์สำหรับงานอุตสาหกรรม",
    heroText: "เครื่องจักร วัสดุขัด และอุปกรณ์สำหรับเพิ่มคุณภาพผิวชิ้นงาน พร้อมคำแนะนำในการเลือกระบบที่เหมาะสมกับการผลิต",
    viewProducts: "ดูสินค้าทั้งหมด",
    consultButton: "ปรึกษาการเลือกเครื่อง",
    productsEyebrow: "ผลิตภัณฑ์ของเรา / Our Products",
    productsTitle: "สินค้าหลักของ RPV",
    productsIntro: "แสดงรายการสินค้าหลักบนหน้า Home โดยตรง เลือกหมวดหรือค้นหาชื่อสินค้าได้ทันที",
    searchLabel: "ค้นหาสินค้า",
    searchPlaceholder: "ชื่อสินค้า รุ่น หรือหมวด",
    productListTitle: "รายการสินค้า",
    productListHint: "กดที่รูปหรือปุ่มเพื่อดูรายละเอียดสินค้า",
    allProducts: "สินค้าทั้งหมด",
    showing: (visible, total) => `แสดง ${visible} จาก ${total} รายการ`,
    detail: "ดูรายละเอียด",
    askPrice: "สอบถามราคา",
    productPlaceholder: "สินค้า",
    noImage: "ยังไม่มีรูปสินค้าสำหรับ",
    aboutText: "บริษัท อาร์พีวี อินดัสเทรียล ซัพพลาย จำกัด จำหน่ายเครื่องจักรอุตสาหกรรม เครื่องขัดผิว วัสดุขัด ชิ้นส่วน และอุปกรณ์ที่เกี่ยวข้อง",
    telLabel: "โทรศัพท์",
    mobileLabel: "มือถือ",
    addressLabel: "ที่อยู่",
    addressText: "21/62 หมู่ 3 ถนน 345 ซอยลำโพ 1 ตำบลลำโพ อำเภอบางบัวทอง จังหวัดนนทบุรี 11110",
    contactTitle: "ไม่แน่ใจว่าควรใช้เครื่องหรือวัสดุขัดแบบใด?",
    contactText: "ส่งรูปชิ้นงาน วัสดุ ปัญหาผิว และผลลัพธ์ที่ต้องการมาให้ทีมงานช่วยประเมิน",
    lineButton: "เพิ่ม LINE: @rpvofficial",
    callOffice: "โทร 02-194-4346-7",
    callMobile: "โทร 086-399-0785",
    requestQuote: "ขอใบเสนอราคา",
    footerAbout: "จำหน่ายเครื่องจักรอุตสาหกรรม เครื่องขัดผิว วัสดุขัด ชิ้นส่วน และอุปกรณ์ที่เกี่ยวข้อง",
    footerCopyright: "Copyright© 2026 www.rpv.co.th | All rights reserved",
    modalFeatures: "จุดเด่นที่ยืนยันได้",
    modalMore: "ข้อมูลเพิ่มเติม",
    modalNote: "ยังไม่มีสเปกรายละเอียดหรือราคาที่ตรวจสอบครบถ้วน จึงแสดงเป็น “สอบถามราคา” เพื่อหลีกเลี่ยงข้อมูลผิดพลาด",
    addLine: "เพิ่ม LINE",
    closeModal: "ปิดหน้าต่างสินค้า"
  },
  en: {
    title: "RPV Industrial Supply | Surface Finishing Machines and Industrial Equipment",
    quoteButton: "Request Quote",
    heroTitle: "Surface finishing machines and industrial equipment solutions",
    heroText: "Machines, polishing media, and industrial equipment for improving part surface quality, with guidance for choosing the right process.",
    viewProducts: "View All Products",
    consultButton: "Consult Product Selection",
    productsEyebrow: "Our Products",
    productsTitle: "RPV Main Products",
    productsIntro: "Browse core products directly on the Home page. Filter by category or search by name and model.",
    searchLabel: "Search products",
    searchPlaceholder: "Product name, model, or category",
    productListTitle: "Product List",
    productListHint: "Click an image or button to view product details",
    allProducts: "All Products",
    showing: (visible, total) => `Showing ${visible} of ${total} items`,
    detail: "View Details",
    askPrice: "Ask for Price",
    productPlaceholder: "Product",
    noImage: "No product image yet for",
    aboutText: "RPV Industrial Supply Co., Ltd. supplies industrial machinery, surface finishing machines, polishing media, parts, and related equipment.",
    telLabel: "Telephone",
    mobileLabel: "Mobile",
    addressLabel: "Address",
    addressText: "21/62 Moo 3, 345 Rd., Soi Lumpo 1, Lumpo, Bangbuathong, Nonthaburi 11110, Thailand",
    contactTitle: "Not sure which machine or media to use?",
    contactText: "Send us your part photo, material, surface issue, and target result for initial recommendation.",
    lineButton: "Add LINE: @rpvofficial",
    callOffice: "Call 02-194-4346-7",
    callMobile: "Call 086-399-0785",
    requestQuote: "Request a Quote",
    footerAbout: "Supplier of industrial machinery, surface finishing machines, polishing media, parts, and related equipment.",
    footerCopyright: "Copyright© 2026 www.rpv.co.th | All rights reserved",
    modalFeatures: "Confirmed Highlights",
    modalMore: "More Information",
    modalNote: "Detailed specifications or verified pricing are not yet available, so this item is shown as “Ask for Price” to avoid inaccurate information.",
    addLine: "Add LINE",
    closeModal: "Close product dialog"
  }
};

function t(key) {
  return ui[currentLanguage][key];
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function productName(product) {
  if (currentLanguage === "th") {
    return productThai[product.id]?.name || product.nameTh || product.nameEn;
  }

  return product.nameEn || productThai[product.id]?.name || product.nameTh;
}

function secondaryProductName(product) {
  if (currentLanguage === "th") {
    return product.nameEn || "";
  }

  return productThai[product.id]?.name || "";
}

function productDescription(product) {
  if (currentLanguage === "th") {
    return productThai[product.id]?.description || product.shortDescriptionTh || product.shortDescriptionEn;
  }

  return product.shortDescriptionEn || productThai[product.id]?.description || product.shortDescriptionTh;
}

function uniqueCategories() {
  return ["All", ...new Set(products.map((product) => product.category))];
}

function productMatchesSearch(product, keyword) {
  const text = [
    productName(product),
    secondaryProductName(product),
    product.nameEn,
    product.model,
    product.category,
    productDescription(product)
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

function updateLanguageButtons() {
  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = t("title");
  modalClose.setAttribute("aria-label", t("closeModal"));
  updateLanguageButtons();

  setText(".quote-button", t("quoteButton"));
  setText(".hero h1", t("heroTitle"));
  setText(".hero-copy > p:not(.eyebrow)", t("heroText"));
  setText(".hero-actions .button.primary", t("viewProducts"));
  setText(".hero-actions .button.secondary", t("consultButton"));
  setText(".products-section .section-heading .eyebrow", t("productsEyebrow"));
  setText(".products-section .section-heading h2", t("productsTitle"));
  setText(".products-section .section-heading p:not(.eyebrow)", t("productsIntro"));
  setText(".search-box span", t("searchLabel"));
  productSearch.placeholder = t("searchPlaceholder");
  setText(".product-panel-head strong", t("productListTitle"));
  setText(".product-panel-head span", t("productListHint"));
  setText(".about-section p:not(.eyebrow)", t("aboutText"));
  setText(".company-facts div:nth-child(2) dt", t("telLabel"));
  setText(".company-facts div:nth-child(3) dt", t("mobileLabel"));
  setText(".company-facts div:nth-child(4) dt", t("addressLabel"));
  setText(".company-facts div:nth-child(4) dd", t("addressText"));
  setText(".contact-cta h2", t("contactTitle"));
  setText(".contact-cta p:not(.eyebrow)", t("contactText"));
  setText(".cta-buttons .button.line", t("lineButton"));
  setText('.cta-buttons a[href="tel:021944346"]', t("callOffice"));
  setText('.cta-buttons a[href="tel:0863990785"]', t("callMobile"));
  setText(".cta-buttons .button.primary", t("requestQuote"));
  setText(".footer-brand p", t("footerAbout"));
  setText(".copyright", t("footerCopyright"));
}

function renderFilters() {
  categoryFilters.innerHTML = "";

  uniqueCategories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = category === "All" ? t("allProducts") : category;
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
  const name = productName(product);

  if (product.image) {
    return `<img src="${product.image}" alt="${name}" loading="lazy">`;
  }

  return `
    <div class="product-placeholder" role="img" aria-label="${t("noImage")} ${name}">
      <span>RPV</span>
      <small>${t("productPlaceholder")}</small>
    </div>
  `;
}

function renderProducts() {
  const visibleProducts = filteredProducts();

  productCount.textContent = t("showing")(visibleProducts.length, products.length);
  productGrid.innerHTML = "";

  visibleProducts.forEach((product) => {
    const name = productName(product);
    const secondaryName = secondaryProductName(product);
    const description = productDescription(product);
    const modelText = product.model ? ` / ${product.model}` : "";
    const card = document.createElement("article");
    card.className = `product-card${product.featured ? " featured" : ""}`;
    card.dataset.detail = product.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${t("detail")} ${name}`);
    card.innerHTML = `
      <div class="product-image">${imageMarkup(product)}</div>
      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3>${name}</h3>
        <p class="product-en">${secondaryName}${modelText}</p>
        <p class="product-desc">${description}</p>
        <ul class="feature-list">
          ${product.features.slice(0, 3).map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <div class="price-note">${t("askPrice")}</div>
      </div>
      <div class="product-actions">
        <button class="button detail" type="button" data-detail="${product.id}">${t("detail")}</button>
        <a class="button primary" href="https://line.me/R/ti/p/@rpvofficial" target="_blank" rel="noopener">${t("askPrice")}</a>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

function openProductModal(product) {
  const name = productName(product);
  const secondaryName = secondaryProductName(product);
  const description = productDescription(product);
  const modelText = product.model ? ` / ${product.model}` : "";

  modalContent.innerHTML = `
    <div class="modal-layout">
      <div class="product-image modal-image">${imageMarkup(product)}</div>
      <div>
        <span class="product-category">${product.category}</span>
        <h2>${name}</h2>
        <p class="product-en">${secondaryName}${modelText}</p>
        <p>${description}</p>
        <h3>${t("modalFeatures")}</h3>
        <ul class="feature-list modal-features">
          ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <h3>${t("modalMore")}</h3>
        <p>${t("modalNote")}</p>
        <div class="modal-actions">
          <a class="button line" href="https://line.me/R/ti/p/@rpvofficial" target="_blank" rel="noopener">${t("addLine")}</a>
          <a class="button secondary" href="tel:021944346">${t("callOffice")}</a>
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

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.lang;
    localStorage.setItem("rpvLanguage", currentLanguage);
    applyLanguage();
    renderFilters();
    renderProducts();
  });
});

productSearch.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    return;
  }

  const detailButton = event.target.closest("[data-detail]");

  if (!detailButton) {
    return;
  }

  const product = products.find((item) => item.id === detailButton.dataset.detail);

  if (product) {
    openProductModal(product);
  }
});

productGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest("[data-detail]");

  if (!card) {
    return;
  }

  event.preventDefault();
  const product = products.find((item) => item.id === card.dataset.detail);

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

applyLanguage();
renderFilters();
renderProducts();
