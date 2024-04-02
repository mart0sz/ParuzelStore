import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyCpq8ZLTzKJy8YakWLvUWOVMT00Is2Q-Dw",
  authDomain: "paruzelstore.firebaseapp.com",
  projectId: "paruzelstore",
  storageBucket: "paruzelstore.appspot.com",
  messagingSenderId: "502741329672",
  appId: "1:502741329672:web:3efe507c7f610bec1eeebd",
  measurementId: "G-6MMBCFVSKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const querySnapshot = await getDocs(collection(db, 'phones'));

let currentProducts = [];
let categories = new Set();
let basket = [];
let addToBasketButtons;
const productsSection = document.querySelector(".products");

querySnapshot.forEach((doc) => {
  currentProducts.push(doc.data());
});

const addToBasket = (e) => {
  const selectedId = parseInt(e.target.dataset.id);
  const selectedItem = currentProducts.find(
    (product) => product.id === selectedId
  );

  if (selectedItem) {
    const priceToAdd = selectedItem.sale
      ? selectedItem.price - selectedItem.saleAmount
      : selectedItem.price;

    const itemToAdd = {
      id: selectedItem.id,
      name: selectedItem.name,
      description: selectedItem.description,
      image: selectedItem.image,
      price: priceToAdd,
    };

    basket.push(itemToAdd);
    setCookie("basket", JSON.stringify(itemToAdd), 15); // Koszyk będzie przechowywany przez 15 minut
    updateBasketPriceFromCookie();
  }
};

function setCookie(name, value, minutes) {
  let existingCookie = getCookie(name);
  let updatedCookie = [];

  if (existingCookie && Array.isArray(existingCookie)) {
    updatedCookie = existingCookie;
  }
  updatedCookie.push(value);

  const date = new Date();
  date.setTime(date.getTime() + minutes * 15 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie =
    name + "=" + JSON.stringify(updatedCookie) + ";" + expires + ";path=/";
}

// Funkcja do pobierania wartości pliku cookie
function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return JSON.parse(cookie.substring(name.length + 1));
    }
  }
  return [];
}


const renderProducts = (items) => {
  productsSection.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    const newProduct = document.createElement("div");
    newProduct.className = `product-item ${items[i].sale ? "on-sale" : ""}`;
    newProduct.innerHTML = `
    <img src="${items[i].image}" alt="product-image" />
    <p class="product-name">${items[i].name}</p>
    <p class="product-description">
   ${items[i].description}
    </p>
    <div class="product-price">
    <span class="price">${items[i].price.toFixed(2)} zł</span>
    <span class="price-sale">${(items[i].price - items[i].saleAmount).toFixed(
      2
    )} zł</span>
    </div>
    <button data-id="${
      items[i].id
    }" class="product-add-to-basket-btn">Dodaj do koszyka</button>
<p class="product-item-sale-info">Promocja</p>`;

    productsSection.appendChild(newProduct);
  }
  addToBasketButtons = document.querySelectorAll(".product-add-to-basket-btn");
  addToBasketButtons.forEach((btn) =>
    btn.addEventListener("click", addToBasket)
  );
};

const renderCategories = (items) => {
  for (let i = 0; i < items.length; i++) {
    categories.add(items[i].category);
  }

  const categoriesItems = document.querySelector(".categories-items");

  categories = ["Wszystkie", ...categories];

  categories.forEach((category, index) => {
    const newCategory = document.createElement("button");
    newCategory.innerHTML = category;
    newCategory.dataset.category = category;

    index === 0 ? newCategory.classList.add("active") : "";

    categoriesItems.appendChild(newCategory);
  });
};

document.onload = renderProducts(currentProducts);
document.onload = renderCategories(currentProducts);

const categoriesButtons = document.querySelectorAll(".categories-items button");

categoriesButtons.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    const category = e.target.dataset.category;

    categoriesButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    currentProducts = products;

    if (category === "Wszystkie") {
      currentProducts = products;
    } else {
      currentProducts = currentProducts.filter(
        (product) => product.category === category
      );
    }

    renderProducts(currentProducts);
  })
);

const searchBarInput = document.querySelector(".search-bar-input");

searchBarInput.addEventListener("input", (e) => {
  const search = e.target.value;

  const foundProducts = currentProducts.filter((product) => {
    if (product.name.toLowerCase().includes(search.toLowerCase())) {
      return product;
    }
  });

  const emptyState = document.querySelector(".empty-state");

  foundProducts.length === 0
    ? emptyState.classList.add("active")
    : emptyState.classList.remove("active");

  renderProducts(foundProducts);
});

const basketAmountSpan = document.querySelector(".basket-amount-button");
const basketClearBtn = document.querySelector(".basket-clear-btn");

const clearBasket = () => {
  basketAmountSpan.innerHTML = "Koszyk";
  basket = [];
  deleteCookie("basket");
  updateBasketPriceFromCookie();
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

basketClearBtn.addEventListener("click", clearBasket);

document
  .querySelector(".basket-amount-button")
  .addEventListener("click", function () {
    window.location.href = "./basket.html"; // Przekierowanie do basket.html
  });

function updateBasketPriceFromCookie() {
  const basketItems = getCookie("basket");
  let basketTotal = 0;

  if (basketItems.length > 0) {
    basketItems.forEach((item) => {
      var parsedItem = JSON.parse(item);
      basketTotal += parsedItem.price;
    });
  }

  basketTotal > 0
    ? (basketClearBtn.style.display = "inline-block")
    : (basketClearBtn.style.display = "none");

  if (basketTotal === 0) {
    basketAmountSpan.innerHTML = "Koszyk";
  } else {
    basketAmountSpan.innerHTML = `${basketTotal.toFixed(2)} zł`;
  }
}
window.onload = updateBasketPriceFromCookie;
