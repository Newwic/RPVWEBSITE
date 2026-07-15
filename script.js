const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const categoryList = document.querySelector("[data-product-categories]");
const productSubmenu = document.querySelector("[data-product-submenu]");

function createProductLink(item, className = "") {
  const link = document.createElement("a");
  link.href = item.url;
  link.textContent = item.name;

  if (className) {
    link.className = className;
  }

  return link;
}

function renderProductSubmenu(category) {
  productSubmenu.innerHTML = "";

  category.items.forEach((item) => {
    productSubmenu.appendChild(createProductLink(item));
  });
}

function setActiveCategory(activeLink, category) {
  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.remove("active");
  });

  activeLink.classList.add("active");
  renderProductSubmenu(category);
}

function renderProductMenu() {
  const categories = window.productMenuData || [];

  if (!categoryList || !productSubmenu || categories.length === 0) {
    return;
  }

  categoryList.innerHTML = "";

  categories.forEach((category, index) => {
    const link = createProductLink(category, "category-item");
    const label = document.createElement("span");
    const arrow = document.createElement("span");

    label.textContent = category.name;
    arrow.className = "arrow";
    arrow.textContent = ">";

    link.textContent = "";
    link.append(label);

    if (category.items.length > 0) {
      link.append(arrow);
    }

    link.addEventListener("mouseenter", () => setActiveCategory(link, category));
    link.addEventListener("focus", () => setActiveCategory(link, category));
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveCategory(link, category);
    });

    categoryList.appendChild(link);

    if (index === 0) {
      setActiveCategory(link, category);
    }
  });
}

renderProductMenu();

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  const productsButton = event.target.closest(".has-dropdown");

  if (productsButton) {
    event.preventDefault();
    productsButton.closest(".products-menu").classList.toggle("is-open");
    return;
  }

  if (event.target.matches(".product-submenu a")) {
    siteNav.classList.remove("is-open");
    document.querySelector(".products-menu")?.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    return;
  }

  if (event.target.matches("a") && !event.target.closest(".products-menu")) {
    siteNav.classList.remove("is-open");
    document.querySelector(".products-menu")?.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Order request received. Connect a real form service later.";
  contactForm.reset();
});
