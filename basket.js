// Odbieranie produktów z koszyka
const basketItems = getCookie("basket");
const basketItemsDiv = document.getElementById("basketItems");
basketItems.forEach(item => {
  const parsedItem = JSON.parse(item);
  
  // Tworzenie diva dla każdego produktu
  const productDiv = document.createElement("div");
  productDiv.classList.add("product");

  // Tworzenie elementu dla zdjęcia telefonu
  const image = document.createElement("img");
  image.src = parsedItem.image;
  image.alt = parsedItem.name;
  image.classList.add("product-image");
  productDiv.appendChild(image);

  // Tworzenie elementu dla opisu i nazwy
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("product-details");

  const nameParagraph = document.createElement("p");
  nameParagraph.textContent = parsedItem.name;
  nameParagraph.classList.add("product-name");
  detailsDiv.appendChild(nameParagraph);

  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.textContent = parsedItem.description;
  descriptionParagraph.classList.add("product-description");
  detailsDiv.appendChild(descriptionParagraph);

  productDiv.appendChild(detailsDiv);

  // Dodawanie produktu do listy
  basketItemsDiv.appendChild(productDiv);
});

// Funkcja do pobierania wartości pliku cookie
function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return JSON.parse(cookie.substring(name.length + 1));
    }
  }
  return [];
}

// Funkcja usuwająca element z listy koszyka
// Funkcja usuwająca element z listy koszyka
function removeItem(index) {
  const basketItems = getCookie("basket");
  
  // Usunięcie pozycji z koszyka
  basketItems.splice(index, 1);
  
  // Aktualizacja pliku cookie
  document.cookie = `basket=${JSON.stringify(basketItems)};path=/;max-age=900`;

  // Aktualizacja listy koszyka
  updateBasketList();

  // Aktualizacja podsumowania do zapłaty
  updatePaymentSummary();
}

// Aktualizacja listy koszyka po dodaniu nowego elementu
// Funkcja do aktualizacji listy koszyka
function updateBasketList() {
  const basketItems = getCookie("basket");
  const basketItemsUl = document.getElementById("basketItems");
  const summaryContainer = document.querySelector(".summary-container");
  const basketActions = document.querySelector(".basket-actions");

  // Usunięcie komunikatu o pustym koszyku, jeśli istnieje
  const basketEmptyMessage = document.getElementById("basketEmptyMessage");
  if (basketEmptyMessage) {
    basketEmptyMessage.remove();
  }

  // Wyczyszczenie zawartości listy koszyka
  basketItemsUl.innerHTML = "";

  // Sprawdzenie, czy koszyk jest pusty
  if (basketItems.length === 0) {
    const emptyBasketMessage = document.createElement("p");
    emptyBasketMessage.textContent = "Twój koszyk jest pusty...";
    emptyBasketMessage.id = "basketEmptyMessage";
    basketItemsUl.appendChild(emptyBasketMessage);

    // Ukrycie podsumowania i guzików podsumowania oraz wyczyszczenia koszyka
    summaryContainer.style.display = "none";
    basketActions.style.display = "none";

    return; // Zakończenie funkcji, jeśli koszyk jest pusty
  }

  // Wyświetlenie elementów koszyka
  basketItems.forEach((item, index) => {
    const parsedItem = JSON.parse(item);
    const li = document.createElement("li");
    li.classList.add("product");
    li.innerHTML = `
        <img src="${parsedItem.image}" alt="${parsedItem.name}" class="product-image">
        <div class="product-details">
            <p class="product-name">${parsedItem.name}</p>
            <p class="product-description">${parsedItem.description}</p>
        </div>
        <button class="remove-button" onclick="removeItem(${index})">&#10006;</button>
    `;
    basketItemsUl.appendChild(li);
  });

  // Wyświetlenie podsumowania i guzików podsumowania oraz wyczyszczenia koszyka
  summaryContainer.style.display = "block";
  basketActions.style.display = "flex";
}

// Funkcja czyszcząca koszyk
function clearBasket() {
  deleteCookie("basket");
  updateBasketList(); // Aktualizacja listy koszyka po wyczyszczeniu
}

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Aktualizacja listy koszyka przy ładowaniu strony
window.onload = function() {
  updateBasketList();
};

// Funkcja do obliczania całkowitej kwoty do zapłaty
function calculateTotal() {
  const basketItems = getCookie("basket");
  let total = 0;

  // Iteracja przez elementy koszyka i dodanie ich cen do całkowitej kwoty
  basketItems.forEach(item => {
    const parsedItem = JSON.parse(item);
    total += parsedItem.price;
  });

  return total.toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
}

// Funkcja aktualizująca podsumowanie do zapłaty
function updatePaymentSummary() {
  const totalAmount = calculateTotal();
  const summaryDetails = document.querySelector(".summary-details");

  // Aktualizacja zawartości podsumowania do zapłaty
  summaryDetails.innerHTML = `
      <p>Całkowita kwota do zapłaty: <strong>${totalAmount} zł</strong></p>
  `;
}

// Aktualizacja podsumowania do zapłaty przy ładowaniu strony
window.onload = function() {
  updateBasketList();
  updatePaymentSummary();
};

// Funkcja do obliczania całkowitej kwoty do zapłaty
function calculateTotal() {
  const basketItems = getCookie("basket");
  let total = 0;

  // Iteracja przez elementy koszyka i dodanie ich cen do całkowitej kwoty
  basketItems.forEach(item => {
      const parsedItem = JSON.parse(item);
      total += parsedItem.price;
  });

  return total.toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
}

// Aktualizacja listy koszyka przy ładowaniu strony
window.onload = function() {
  updateBasketList();
  updatePaymentSummary();
};

function summarizeBasket() {
  Swal.fire({
    title: 'Dziękujemy za zakup!',
    text: 'Zostaniesz przekierowany na stronę płatności.',
    icon: 'success',
    timer: 3000, // Czas trwania powiadomienia w milisekundach (3 sekundy)
    timerProgressBar: true, // Pasek postępu
    showConfirmButton: false // Ukrycie przycisku potwierdzającego
  });

  setTimeout(() => {
    window.location.href = "https://autopay.pl/";
  }, 3000); // Opóźnienie wynosi 3000 milisekund (3 sekundy)
  clearBasket();
}