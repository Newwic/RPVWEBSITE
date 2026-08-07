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

function loadAdminProductDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem("rpvProductsDraft") || "null");
    if (!Array.isArray(draft)) return null;

    const staticProducts = window.rpvProducts || [];
    const staticById = new Map(staticProducts.map((product) => [product.id, product]));
    const draftById = new Map(draft.map((product) => [product.id, product]));
    const mergeProduct = (staticProduct) => {
      const product = draftById.get(staticProduct.id);
      if (!product) return staticProduct;

      const savedImage = product.image || product.image_url || "";
      const isGeneratedPlaceholder = savedImage.startsWith("assets/products/") && savedImage.endsWith(".svg");
      const isOldImportedImage = savedImage.startsWith("assets/products/");
      const shouldUseStaticImage = !savedImage || savedImage === "assets/nylon-shot-sample.svg" || isGeneratedPlaceholder || isOldImportedImage;
      const image = shouldUseStaticImage ? staticProduct.image || "" : savedImage;
      return {
        ...staticProduct,
        ...product,
        image,
        gallery: shouldUseStaticImage ? staticProduct.gallery || (image ? [image] : []) : product.gallery || (image ? [image] : [])
      };
    };

    if (staticProducts.length > 40) {
      return staticProducts.map(mergeProduct);
    }

    const draftIds = new Set(draft.map((product) => product.id).filter(Boolean));
    const mergedDraft = draft.map((product) => (staticById.has(product.id) ? mergeProduct(staticById.get(product.id)) : product));
    const newStaticProducts = staticProducts.filter((product) => !draftIds.has(product.id));
    return [...mergedDraft, ...newStaticProducts];
  } catch {
    return null;
  }
}

function loadAdminSiteDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem("rpvSiteDraft") || "null");
    return draft && typeof draft === "object" ? draft : null;
  } catch {
    return null;
  }
}

const products = (loadAdminProductDraft() || window.rpvProducts || [])
  .filter((product) => product.status === "active")
  .sort((a, b) => a.sortOrder - b.sortOrder);

const urlParams = new URLSearchParams(window.location.search);
let currentCategory = "All";
let currentCategoryGroup = null;
const urlLanguage = urlParams.get("lang");
let currentLanguage = ["th", "en"].includes(urlLanguage)
  ? urlLanguage
  : localStorage.getItem("rpvLanguage") || "th";

const categoryGroups = {
  "polishing-machines": [
    "1.เครื่องขัดแบบเขย่า (Vibratory Machine)",
    "2.เครื่องขัดแบบจานหมุน (Centrifugal Disc Machine)",
    "3.เครื่องขัดแบบถังกลิ้ง (Rotary/Single Barrel)",
    "4.เครื่องอบแห้ง (Dryer Machine)",
    "5.เครื่องขัดโลหะ ยี่ห้อ Roto Finish - USA (Mass Finishing System)",
    "6.เครื่องแยกชิ้นงาน (Vibratory Separator)",
    "8.เครื่องขัดเงาแผ่นแสตนเลส (8K Mirror Polishing)"
  ],
  "media-compound": [
    "7.หินขัดและน้ำยาขัด (Media & Compound)"
  ],
  "other-products": [
    "3.3 สินค้าอื่นๆ / Other Products"
  ]
};

const categoryText = {
  th: {
    All: "สินค้าทั้งหมด",
    "Polishing Machines": "เครื่องขัดผิว",
    "Magnetic Polishing Machines": "เครื่องขัดแม่เหล็ก",
    "Magnetic Pins": "เข็มขัดแม่เหล็ก",
    "Ceramic Media": "หินขัดเซรามิก",
    "Plastic Media": "หินขัดพลาสติก",
    "Stainless Steel Media": "วัสดุขัดสแตนเลส",
    "Polishing Media": "วัสดุขัด",
    "Compound and Chemicals": "น้ำยาขัดและเคมีภัณฑ์",
    "Industrial Equipment": "อุปกรณ์อุตสาหกรรม"
  },
  en: {
    All: "All Products",
    "Polishing Machines": "Polishing Machines",
    "Magnetic Polishing Machines": "Magnetic Polishing Machines",
    "Magnetic Pins": "Magnetic Pins",
    "Ceramic Media": "Ceramic Media",
    "Plastic Media": "Plastic Media",
    "Stainless Steel Media": "Stainless Steel Media",
    "Polishing Media": "Polishing Media",
    "Compound and Chemicals": "Compound and Chemicals",
    "Industrial Equipment": "Industrial Equipment"
  }
};

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
    brandSubtitle: "โซลูชันงานขัดผิว",
    navHome: "หน้าแรก",
    navProducts: "สินค้า",
    navSolutions: "โซลูชัน",
    navAbout: "เกี่ยวกับเรา",
    navContact: "ติดต่อ",
    quoteButton: "สอบถามราคา",
    searchEyebrow: "ค้นหาสินค้า RPV",
    heroTitle: "ค้นหาเครื่องจักรและวัสดุขัดที่เหมาะกับงานของคุณ",
    heroText: "ค้นหาจากชื่อสินค้า รุ่น ประเภทเครื่อง หรือวัสดุขัด",
    categoryTitle: "เลือกหมวดสินค้า",
    categoryText: "กดหมวดเพื่อกรองสินค้าในหน้านี้ทันที",
    searchLabel: "ค้นหาสินค้า",
    searchPlaceholder: "ค้นหาชื่อสินค้า รุ่น หรือหมวดสินค้า",
    productListTitle: "รายการสินค้า",
    productListHint: "ค้นหาและเลือกหมวดเพื่อดูสินค้าที่ตรงกับงานของคุณ",
    allProducts: "สินค้าทั้งหมด",
    showing: (visible) => `พบ ${visible} รายการ`,
    noResults: "ไม่พบสินค้าที่ค้นหา กรุณาลองใช้คำอื่นหรือสอบถามทีมงาน RPV",
    detail: "ดูรายละเอียด",
    askPrice: "สอบถามผ่าน LINE",
    productPlaceholder: "สินค้า",
    noImage: "ยังไม่มีรูปสินค้าสำหรับ",
    contactTitle: "ไม่แน่ใจว่าควรเลือกเครื่องหรือวัสดุขัดแบบใด?",
    contactText: "ส่งรูปชิ้นงาน วัสดุ ปัญหาผิว และผลลัพธ์ที่ต้องการมาให้ทีมงานช่วยแนะนำ",
    lineButton: "LINE @rpvofficial",
    callOffice: "โทร 02-194-4346-7",
    callMobile: "โทร 086-399-0785",
    officeLink: "หรือโทรสำนักงาน 02-194-4346-7",
    footerAbout: "จำหน่ายเครื่องจักรอุตสาหกรรม เครื่องขัดผิว วัสดุขัด ชิ้นส่วน และอุปกรณ์ที่เกี่ยวข้อง",
    footerAddress: "21/62 หมู่ 3 ถ.345 ซ.ลำโพ 1 ต.ลำโพ อ.บางบัวทอง จ.นนทบุรี 11110",
    footerOffice: "สำนักงาน 02-194-4346-7",
    footerMobile: "มือถือ 086-399-0785",
    footerLine: "LINE @rpvofficial",
    footerProducts: "สินค้าทั้งหมด",
    footerAboutLink: "เกี่ยวกับเรา",
    footerContactLink: "ติดต่อเรา",
    footerCopyright: "© 2026 RPV Industrial Supply Co., Ltd. All rights reserved.",
    modalFeatures: "จุดเด่นที่ยืนยันได้",
    modalMore: "ข้อมูลเพิ่มเติม",
    modalNote: "ยังไม่มีสเปกรายละเอียดหรือราคาที่ตรวจสอบครบถ้วน จึงแสดงเป็น “สอบถามราคา” เพื่อหลีกเลี่ยงข้อมูลผิดพลาด",
    addLine: "เพิ่ม LINE",
    closeModal: "ปิดหน้าต่างสินค้า"
  },
  en: {
    title: "RPV Industrial Supply | Surface Finishing Machines and Industrial Equipment",
    brandSubtitle: "Surface Finishing Solutions",
    navHome: "Home",
    navProducts: "Products",
    navSolutions: "Solutions",
    navAbout: "About Us",
    navContact: "Contact",
    quoteButton: "Request Quote",
    searchEyebrow: "RPV PRODUCT SEARCH",
    heroTitle: "Find the right machines and polishing media for your work",
    heroText: "Search by product name, model, machine type, or polishing media.",
    categoryTitle: "Quick Categories",
    categoryText: "Select a category to filter products on this page.",
    searchLabel: "Search products",
    searchPlaceholder: "Search product name, model, or category",
    productListTitle: "Product List",
    productListHint: "Search and choose a category to find matching products.",
    allProducts: "All Products",
    showing: (visible) => `Found ${visible} items`,
    noResults: "No matching products found. Try another keyword or contact the RPV team.",
    detail: "View Details",
    askPrice: "Ask via LINE",
    productPlaceholder: "Product",
    noImage: "No product image yet for",
    contactTitle: "Not sure which machine or polishing media to choose?",
    contactText: "Send your part photo, material, surface issue, and target result so our team can recommend the right option.",
    lineButton: "LINE @rpvofficial",
    callOffice: "Call 02-194-4346-7",
    callMobile: "Call 086-399-0785",
    officeLink: "Or call office 02-194-4346-7",
    footerAbout: "Supplier of industrial machinery, surface finishing machines, polishing media, parts, and related equipment.",
    footerAddress: "21/62 Moo 3, 345 Rd., Soi Lumpo 1, Lumpo, Bangbuathong, Nonthaburi 11110, Thailand",
    footerOffice: "Office 02-194-4346-7",
    footerMobile: "Mobile 086-399-0785",
    footerLine: "LINE @rpvofficial",
    footerProducts: "All Products",
    footerAboutLink: "About Us",
    footerContactLink: "Contact Us",
    footerCopyright: "© 2026 RPV Industrial Supply Co., Ltd. All rights reserved.",
    modalFeatures: "Confirmed Highlights",
    modalMore: "More Information",
    modalNote: "Detailed specifications or verified pricing are not yet available, so this item is shown as “Ask for Price” to avoid inaccurate information.",
    addLine: "Add LINE",
    closeModal: "Close product dialog"
  }
};

Object.assign(ui.th, {
  homeCatalogTitle: "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e2b\u0e21\u0e27\u0e14\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32",
  homeCatalogText: "\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e08\u0e31\u0e01\u0e23 \u0e27\u0e31\u0e2a\u0e14\u0e38\u0e02\u0e31\u0e14 \u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c \u0e41\u0e25\u0e30\u0e19\u0e49\u0e33\u0e22\u0e32\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e07\u0e32\u0e19\u0e02\u0e31\u0e14\u0e1c\u0e34\u0e27\u0e2d\u0e38\u0e15\u0e2a\u0e32\u0e2b\u0e01\u0e23\u0e23\u0e21",
  homeInfoPhone: "\u0e42\u0e17\u0e23",
  homeInfoAddress: "\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48",
  homeInfoLocation: "\u0e1a\u0e32\u0e07\u0e1a\u0e31\u0e27\u0e17\u0e2d\u0e07 \u0e19\u0e19\u0e17\u0e1a\u0e38\u0e23\u0e35",
  homeAskProduct: "\u0e2a\u0e2d\u0e1a\u0e16\u0e32\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32",
  homeCategoryMachine: "\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e02\u0e31\u0e14\u0e1c\u0e34\u0e27",
  homeCategoryMagnetic: "\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e02\u0e31\u0e14\u0e41\u0e21\u0e48\u0e40\u0e2b\u0e25\u0e47\u0e01",
  homeCategoryCeramic: "\u0e2b\u0e34\u0e19\u0e02\u0e31\u0e14\u0e40\u0e0b\u0e23\u0e32\u0e21\u0e34\u0e01",
  homeCategoryPlastic: "\u0e2b\u0e34\u0e19\u0e02\u0e31\u0e14\u0e1e\u0e25\u0e32\u0e2a\u0e15\u0e34\u0e01",
  homeCategorySteel: "\u0e27\u0e31\u0e2a\u0e14\u0e38\u0e02\u0e31\u0e14\u0e2a\u0e41\u0e15\u0e19\u0e40\u0e25\u0e2a",
  homeCategoryCompound: "\u0e19\u0e49\u0e33\u0e22\u0e32\u0e02\u0e31\u0e14\u0e41\u0e25\u0e30\u0e40\u0e04\u0e21\u0e35\u0e20\u0e31\u0e13\u0e11\u0e4c",
  homeCategorySpare: "\u0e2d\u0e30\u0e44\u0e2b\u0e25\u0e48\u0e41\u0e25\u0e30\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c",
  homeCategorySupport: "\u0e1b\u0e23\u0e36\u0e01\u0e29\u0e32\u0e07\u0e32\u0e19\u0e02\u0e31\u0e14\u0e1c\u0e34\u0e27",
  mobileCall: "\u0e42\u0e17\u0e23 086-399-0785"
});

Object.assign(ui.en, {
  homeCatalogTitle: "Product Categories",
  homeCatalogText: "Machines, polishing media, equipment, and compounds for industrial surface finishing.",
  homeInfoPhone: "Call",
  homeInfoAddress: "Address",
  homeInfoLocation: "Bang Bua Thong, Nonthaburi",
  homeAskProduct: "Ask About Products",
  homeCategoryMachine: "Polishing Machines",
  homeCategoryMagnetic: "Magnetic Polishing",
  homeCategoryCeramic: "Ceramic Media",
  homeCategoryPlastic: "Plastic Media",
  homeCategorySteel: "Stainless Steel Media",
  homeCategoryCompound: "Compounds and Chemicals",
  homeCategorySpare: "Parts and Equipment",
  homeCategorySupport: "Surface Finishing Advice",
  mobileCall: "Call 086-399-0785"
});

const adminSiteDraft = loadAdminSiteDraft();

function applyAdminSiteDraft() {
  if (!adminSiteDraft) return;

  if (adminSiteDraft.home) {
    if (adminSiteDraft.home.heroTitle) {
      ui.th.heroTitle = adminSiteDraft.home.heroTitle;
    }
    if (adminSiteDraft.home.heroText) {
      ui.th.heroText = adminSiteDraft.home.heroText;
    }
    if (adminSiteDraft.home.ctaText) {
      ui.th.contactText = adminSiteDraft.home.ctaText;
    }

    if (adminSiteDraft.home.sectionMode === "hide-contact") {
      document.querySelector(".contact-cta")?.setAttribute("hidden", "");
    }
    if (adminSiteDraft.home.sectionMode === "hide-footer") {
      document.querySelector(".site-footer")?.setAttribute("hidden", "");
    }
  }

  if (adminSiteDraft.contact) {
    const contact = adminSiteDraft.contact;
    if (contact.office) {
      ui.th.callOffice = `โทร ${contact.office}`;
      ui.th.officeLink = `หรือโทรสำนักงาน ${contact.office}`;
      ui.th.footerOffice = `สำนักงาน ${contact.office}`;
      ui.en.callOffice = `Call ${contact.office}`;
      ui.en.officeLink = `Or call office ${contact.office}`;
      ui.en.footerOffice = `Office ${contact.office}`;
      document.querySelectorAll('a[href^="tel:021944346"]').forEach((link) => {
        link.href = `tel:${contact.office.replace(/\D/g, "")}`;
      });
    }
    if (contact.mobile) {
      ui.th.callMobile = `โทร ${contact.mobile}`;
      ui.th.footerMobile = `มือถือ ${contact.mobile}`;
      ui.en.callMobile = `Call ${contact.mobile}`;
      ui.en.footerMobile = `Mobile ${contact.mobile}`;
      document.querySelectorAll('a[href^="tel:0863990785"]').forEach((link) => {
        link.href = `tel:${contact.mobile.replace(/\D/g, "")}`;
      });
    }
    if (contact.line) {
      ui.th.lineButton = `LINE ${contact.line}`;
      ui.th.footerLine = `LINE ${contact.line}`;
      ui.en.lineButton = `LINE ${contact.line}`;
      ui.en.footerLine = `LINE ${contact.line}`;
    }
    if (contact.address) {
      ui.th.footerAddress = contact.address;
      ui.en.footerAddress = contact.address;
    }
  }

  if (adminSiteDraft.appearance) {
    const appearance = adminSiteDraft.appearance;
    if (appearance.theme === "dark-green") {
      document.documentElement.style.setProperty("--green", "#0d5f45");
      document.documentElement.style.setProperty("--green-dark", "#073a2c");
    }
    if (appearance.columns === "3") {
      document.documentElement.style.setProperty("--admin-product-columns", "3");
      document.body.classList.add("admin-draft-three-columns");
    }
    if (appearance.hero === "compact") {
      document.body.classList.add("admin-draft-compact-hero");
    }
  }

  if (Array.isArray(adminSiteDraft.pages)) {
    const currentFile = location.pathname.split("/").pop() || "index.html";

    adminSiteDraft.pages.forEach((page) => {
      if (!page || !page.path) return;
      const pageFile = page.path.split("/").pop();
      document.querySelectorAll(`.site-nav a[href="${pageFile}"]`).forEach((link) => {
        link.textContent = page.menuLabel || page.label || link.textContent;
        link.hidden = page.status === "hidden";
      });

      if (pageFile === currentFile) {
        if (page.title) document.title = `${page.title} | RPV Industrial Supply`;
        const heroTitle = document.querySelector(".subpage-hero h1, .search-copy h1");
        const heroText = document.querySelector(".subpage-hero p:last-child, .search-copy > p");
        if (heroTitle && page.title) heroTitle.textContent = page.title;
        if (heroText && page.description) heroText.textContent = page.description;

        const quoteButton = document.querySelector(".quote-button");
        if (quoteButton && page.ctaText) quoteButton.textContent = page.ctaText;
        if (quoteButton && page.ctaLink) quoteButton.href = page.ctaLink;

        if (pageFile === "index.html") {
          if (page.title) {
            ui.th.homeCatalogTitle = page.title;
            ui.en.homeCatalogTitle = page.title;
          }
          if (page.description) {
            ui.th.homeCatalogText = page.description;
            ui.en.homeCatalogText = page.description;
          }
          if (page.ctaText) {
            ui.th.homeAskProduct = page.ctaText;
            ui.en.homeAskProduct = page.ctaText;
          }
        }

        if (Array.isArray(page.sections)) {
          const hiddenSections = new Set(
            page.sections
              .filter((section) => section.visible === false)
              .map((section) => section.id)
          );

          if (hiddenSections.has("categories")) document.querySelector(".quick-categories")?.setAttribute("hidden", "");
          if (hiddenSections.has("products") || hiddenSections.has("grid")) document.querySelector(".product-list-panel")?.setAttribute("hidden", "");
          if (hiddenSections.has("contact") || hiddenSections.has("contact-info")) document.querySelector(".contact-cta")?.setAttribute("hidden", "");
        }
      }
    });
  }

  if (Array.isArray(adminSiteDraft.homeCategories)) {
    applyAdminHomeCategories(adminSiteDraft.homeCategories);
  }
}

function applyAdminHomeCategories(categories) {
  const translationKeys = [
    "homeCategoryMachine",
    "homeCategoryMagnetic",
    "homeCategoryCeramic",
    "homeCategoryPlastic",
    "homeCategorySteel",
    "homeCategoryCompound",
    "homeCategorySpare",
    "homeCategorySupport"
  ];

  categories.forEach((category, index) => {
    const tile = document.querySelector(`.home-category-tile:nth-child(${index + 1})`);
    if (!tile || !category) return;
    const key = translationKeys[index];
    if (key && category.title) {
      ui.th[key] = category.title;
      ui.en[key] = category.title;
    }
    if (category.link) {
      tile.href = category.link.replace(/^\.\.\//, "");
    }
    if (category.image) {
      const image = category.image.replace(/^\.\.\//, "");
      tile.style.backgroundImage = `linear-gradient(180deg, rgba(13, 36, 29, 0.08), rgba(13, 36, 29, 0.58)), url("${image}")`;
    }
  });
}

function t(key) {
  return ui[currentLanguage][key];
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function categoryLabel(category) {
  return categoryText[currentLanguage]?.[category] || category;
}

function productName(product) {
  if (currentLanguage === "th") {
    return product.nameTh || productThai[product.id]?.name || product.nameEn;
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
    return product.shortDescriptionTh || productThai[product.id]?.description || product.shortDescriptionEn;
  }

  return product.shortDescriptionEn || productThai[product.id]?.description || product.shortDescriptionTh;
}

function uniqueCategories() {
  return ["All", ...new Set(products.map((product) => product.category))];
}

function applyCategoryFromUrl() {
  const requestedGroup = urlParams.get("group");
  const requestedCategory = urlParams.get("category") || urlParams.get("cat");

  if (requestedGroup && categoryGroups[requestedGroup]) {
    currentCategoryGroup = new Set(categoryGroups[requestedGroup]);
    return;
  }

  if (!requestedCategory) {
    return;
  }

  const normalizedCategory = requestedCategory.trim().toLowerCase();
  const matchedCategory = uniqueCategories().find((category) => category.toLowerCase() === normalizedCategory);

  if (matchedCategory) {
    currentCategory = matchedCategory;
    currentCategoryGroup = null;
  }
}

function applySearchFromUrl() {
  const requestedSearch = urlParams.get("search") || urlParams.get("q");

  if (productSearch && requestedSearch) {
    productSearch.value = requestedSearch.trim();
  }
}

function updateCategoryUrl(category) {
  if (!window.history?.replaceState) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  params.delete("group");

  if (category === "All") {
    params.delete("category");
  } else {
    params.set("category", category);
  }

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash || ""}`;
  window.history.replaceState(null, "", nextUrl);
}

function productMatchesSearch(product, keyword) {
  const text = [
    productName(product),
    secondaryProductName(product),
    product.nameEn,
    product.model,
    product.category,
    categoryLabel(product.category),
    productDescription(product)
  ].join(" ").toLowerCase();

  return text.includes(keyword.toLowerCase());
}

function filteredProducts() {
  const keyword = productSearch?.value.trim() || "";

  return products.filter((product) => {
    const categoryMatch = currentCategoryGroup
      ? currentCategoryGroup.has(product.category)
      : currentCategory === "All" || product.category === currentCategory;
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
  modalClose?.setAttribute("aria-label", t("closeModal"));
  updateLanguageButtons();

  setText(".quote-button", t("quoteButton"));
  setText(".brand small", t("brandSubtitle"));
  setText('.site-nav a[href="index.html"]', t("navHome"));
  setText('.site-nav a[href="products.html"]', t("navProducts"));
  setText('.site-nav a[href="solutions.html"]', t("navSolutions"));
  setText('.site-nav a[href="about.html"]', t("navAbout"));
  setText('.site-nav a[href="contact.html"]', t("navContact"));
  setText('[data-i18n="homeCatalogTitle"]', t("homeCatalogTitle"));
  setText('[data-i18n="homeCatalogText"]', t("homeCatalogText"));
  setText('[data-i18n="homeInfoPhone"]', t("homeInfoPhone"));
  setText('[data-i18n="homeInfoAddress"]', t("homeInfoAddress"));
  setText('[data-i18n="homeInfoLocation"]', t("homeInfoLocation"));
  setText('[data-i18n="homeAskProduct"]', t("homeAskProduct"));
  setText('[data-i18n="homeCategoryMachine"]', t("homeCategoryMachine"));
  setText('[data-i18n="homeCategoryMagnetic"]', t("homeCategoryMagnetic"));
  setText('[data-i18n="homeCategoryCeramic"]', t("homeCategoryCeramic"));
  setText('[data-i18n="homeCategoryPlastic"]', t("homeCategoryPlastic"));
  setText('[data-i18n="homeCategorySteel"]', t("homeCategorySteel"));
  setText('[data-i18n="homeCategoryCompound"]', t("homeCategoryCompound"));
  setText('[data-i18n="homeCategorySpare"]', t("homeCategorySpare"));
  setText('[data-i18n="homeCategorySupport"]', t("homeCategorySupport"));
  setText(".home-info-rail h1", t("homeCatalogTitle"));
  setText(".home-info-rail > div:first-child p:not(.eyebrow)", t("homeCatalogText"));
  setText(".home-info-list a:nth-child(1) strong", t("homeInfoPhone"));
  setText(".home-info-list a:nth-child(3) strong", t("homeInfoAddress"));
  setText(".home-info-list a:nth-child(3) span", t("homeInfoLocation"));
  setText(".home-info-rail .button.line", t("homeAskProduct"));
  setText(".home-category-tile:nth-child(1) span", t("homeCategoryMachine"));
  setText(".home-category-tile:nth-child(2) span", t("homeCategoryMagnetic"));
  setText(".home-category-tile:nth-child(3) span", t("homeCategoryCeramic"));
  setText(".home-category-tile:nth-child(4) span", t("homeCategoryPlastic"));
  setText(".home-category-tile:nth-child(5) span", t("homeCategorySteel"));
  setText(".home-category-tile:nth-child(6) span", t("homeCategoryCompound"));
  setText(".home-category-tile:nth-child(7) span", t("homeCategorySpare"));
  setText(".home-category-tile:nth-child(8) span", t("homeCategorySupport"));
  setText(".mobile-contact-call", t("mobileCall"));
  setText(".search-copy .eyebrow", t("searchEyebrow"));
  setText(".search-copy h1", t("heroTitle"));
  setText(".search-copy p:not(.eyebrow)", t("heroText"));
  setText(".quick-categories-head h2", t("categoryTitle"));
  setText(".quick-categories-head p", t("categoryText"));
  setText(".hero-search span", t("searchLabel"));
  if (productSearch) productSearch.placeholder = t("searchPlaceholder");
  setText(".product-panel-head strong", t("productListTitle"));
  setText(".product-panel-head span", t("productListHint"));
  setText(".contact-cta h2", t("contactTitle"));
  setText(".contact-copy p:not(.eyebrow)", t("contactText"));
  setText(".cta-actions .button.line", t("lineButton"));
  setText('.cta-actions a[href="tel:0863990785"]', t("callMobile"));
  setText(".office-link", t("officeLink"));
  setText(".footer-about", t("footerAbout"));
  setText(".footer-address", t("footerAddress"));
  setText(".footer-office", t("footerOffice"));
  setText(".footer-mobile", t("footerMobile"));
  setText(".footer-line", t("footerLine"));
  setText('.footer-links a[href="products.html"]', t("footerProducts"));
  setText('.footer-links a[href="about.html"]', t("footerAboutLink"));
  setText('.footer-links a[href="contact.html"]', t("footerContactLink"));
  setText(".copyright", t("footerCopyright"));
}

function renderFilters() {
  if (!categoryFilters) return;
  categoryFilters.innerHTML = "";

  uniqueCategories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    const label = categoryLabel(category);
    const shortLabel = category === "All"
      ? "ALL"
      : category
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
    button.innerHTML = `<span class="category-mark">${shortLabel}</span><span>${label}</span>`;
    button.setAttribute("aria-pressed", String(category === currentCategory));

    button.addEventListener("click", () => {
      currentCategory = category;
      currentCategoryGroup = null;
      updateCategoryUrl(category);
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
  if (!productGrid || !productCount) return;
  const visibleProducts = filteredProducts();

  productCount.textContent = t("showing")(visibleProducts.length, products.length);
  productGrid.innerHTML = "";

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="no-results">
        <p>${t("noResults")}</p>
        <a class="button line" href="https://line.me/R/ti/p/@rpvofficial" target="_blank" rel="noopener">${t("askPrice")}</a>
      </div>
    `;
    return;
  }

  visibleProducts.forEach((product) => {
    const name = productName(product);
    const secondaryName = secondaryProductName(product);
    const description = productDescription(product);
    const modelText = product.model || "-";
    const card = document.createElement("article");
    card.className = `product-card${product.featured ? " featured" : ""}`;
    card.dataset.detail = product.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${t("detail")} ${name}`);
    card.innerHTML = `
      <div class="product-image">${imageMarkup(product)}</div>
      <div class="product-body">
        <span class="product-category">${categoryLabel(product.category)}</span>
        <h3>${name}</h3>
        <p class="product-en">${secondaryName}</p>
        <p class="product-model">${modelText}</p>
        <p class="product-desc">${description}</p>
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
        <span class="product-category">${categoryLabel(product.category)}</span>
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

function closeMobileNav() {
  siteNav?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "เปิดเมนู");
}

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "ปิดเมนู" : "เปิดเมนู");
});

navToggle?.addEventListener("touchend", (event) => {
  event.preventDefault();
  navToggle.click();
}, { passive: false });

siteNav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMobileNav();
  }
});

document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("nav-open")) return;
  if (event.target.closest(".site-nav, .nav-toggle, .header-actions")) return;
  closeMobileNav();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileNav();
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

productSearch?.addEventListener("input", renderProducts);

productGrid?.addEventListener("click", (event) => {
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

productGrid?.addEventListener("keydown", (event) => {
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

modalClose?.addEventListener("click", () => productModal.close());
productModal?.addEventListener("click", (event) => {
  if (event.target === productModal) {
    productModal.close();
  }
});

applyCategoryFromUrl();
applyAdminSiteDraft();
applyLanguage();
applySearchFromUrl();
renderFilters();
renderProducts();
