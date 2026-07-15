const articleSearch = document.querySelector("#articleSearch");
const articleGrid = document.querySelector("#articleGrid");
const articleCount = document.querySelector("#articleCount");
const articleFilters = document.querySelector("#articleFilters");
const clearArticleSearch = document.querySelector("#clearArticleSearch");
const featuredArticle = document.querySelector("#featuredArticle");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

const articles = globalThis.rpvArticles || [];
const categories = globalThis.rpvArticleCategories || [];
let currentArticleCategory = "all";

function articleMatchesSearch(article, keyword) {
  const text = [
    article.title,
    article.excerpt,
    article.category,
    article.readingTime,
    ...(article.keywords || [])
  ].join(" ").toLowerCase();

  return text.includes(keyword.toLowerCase());
}

function filteredArticles() {
  const keyword = articleSearch.value.trim();

  return articles.filter((article) => {
    const categoryMatch = currentArticleCategory === "all" || article.categorySlug === currentArticleCategory;
    const searchMatch = keyword === "" || articleMatchesSearch(article, keyword);
    return categoryMatch && searchMatch;
  });
}

function articleImage(article) {
  if (article.image) {
    return `<img src="${article.image}" alt="${article.imageAlt}" width="640" height="360" loading="lazy">`;
  }

  return `
    <div class="article-placeholder" role="img" aria-label="${article.imageAlt}">
      <span>RPV</span>
      <small>Article image placeholder</small>
    </div>
  `;
}

function articleCard(article, isFeatured = false) {
  return `
    <article class="article-card${isFeatured ? " article-card-featured" : ""}">
      <a class="article-card-image" href="${article.url}">
        ${articleImage(article)}
      </a>
      <div class="article-card-body">
        <span class="article-category">${article.category}</span>
        <h3><a href="${article.url}">${article.title}</a></h3>
        <p>${article.excerpt}</p>
        <div class="article-meta">
          <time datetime="${article.published}">${article.published}</time>
          <span>${article.readingTime}</span>
        </div>
        <a class="article-read-link" href="${article.url}">อ่านบทความ</a>
      </div>
    </article>
  `;
}

function renderArticleFilters() {
  articleFilters.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "article-filter";
  allButton.textContent = "ทั้งหมด";
  allButton.dataset.category = "all";
  allButton.setAttribute("aria-pressed", String(currentArticleCategory === "all"));
  articleFilters.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "article-filter";
    button.dataset.category = category.slug;
    button.setAttribute("aria-pressed", String(currentArticleCategory === category.slug));
    button.innerHTML = `<span>${category.icon}</span>${category.name}`;
    articleFilters.appendChild(button);
  });
}

function renderFeaturedArticle() {
  const article = articles.find((item) => item.featured) || articles[0];

  if (!article || !featuredArticle) {
    return;
  }

  featuredArticle.innerHTML = articleCard(article, true);
}

function renderArticles() {
  const visibleArticles = filteredArticles();

  articleCount.textContent = `พบ ${visibleArticles.length} บทความ`;
  articleGrid.innerHTML = "";

  if (visibleArticles.length === 0) {
    articleGrid.innerHTML = `
      <div class="article-empty">
        <p>ไม่พบบทความที่ค้นหา กรุณาลองใช้คำอื่นหรือสอบถามทีมงาน RPV</p>
        <a class="button line" href="https://line.me/R/ti/p/@rpvofficial" target="_blank" rel="noopener">ปรึกษาเรา</a>
      </div>
    `;
    return;
  }

  articleGrid.innerHTML = visibleArticles.map((article) => articleCard(article)).join("");
}

articleFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) {
    return;
  }

  currentArticleCategory = button.dataset.category;
  renderArticleFilters();
  renderArticles();
});

articleSearch.addEventListener("input", renderArticles);

clearArticleSearch.addEventListener("click", () => {
  articleSearch.value = "";
  articleSearch.focus();
  renderArticles();
});

function closeMobileNav() {
  siteNav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
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

const initialQuery = new URLSearchParams(window.location.search).get("q");

if (initialQuery) {
  articleSearch.value = initialQuery;
}

renderArticleFilters();
renderFeaturedArticle();
renderArticles();
