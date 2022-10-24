let cart = [];
let modalQtd = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// Listagem dos books
bookJson.map((item, index) => {
  let bookItem = c(".models .book-item").cloneNode(true);

  bookItem.setAttribute("data-key", index);
  bookItem.querySelector(".book-item--img img").src = item.img;
  bookItem.querySelector(
    ".book-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  bookItem.querySelector(".book-item--name").innerHTML = item.name;
  bookItem.querySelector(".book-item--desc").innerHTML = item.description;

  bookItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    let key = e.target.closest(".book-item").getAttribute("data-key");
    modalQtd = 1;
    modalKey = key;

    c(".bookBig img").src = bookJson[key].img;
    c(".bookInfo h1").innerHTML = bookJson[key].name;
    c(".bookInfo--desc").innerHTML = bookJson[key].description;
    c(".bookInfo--actualPrice").innerHTML = `R$ ${bookJson[key].price.toFixed(
      2
    )}`;
    c(".bookInfo--size.selected").classList.remove("selected");
    cs(".bookInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = bookJson[key].sizes[sizeIndex];
    });

    c(".bookInfo--qt").innerHTML = modalQtd;

    c(".bookWindowArea").style.opacity = 0;
    c(".bookWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".bookWindowArea").style.opacity = 1;
    }, 200);
  });

  c(".book-area").append(bookItem);
});

// Eventos do MODAL
function closeModal() {
  c(".bookWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".bookWindowArea").style.display = "none";
  }, 500);
}
cs(".bookInfo--cancelButton, .bookInfo--cancelMobileButton").forEach((item) => {
  item.addEventListener("click", closeModal);
});
c(".bookInfo--qtmenos").addEventListener("click", () => {
  if (modalQtd > 1) {
    modalQtd--;
    c(".bookInfo--qt").innerHTML = modalQtd;
  }
});
c(".bookInfo--qtmais").addEventListener("click", () => {
  modalQtd++;
  c(".bookInfo--qt").innerHTML = modalQtd;
});
cs(".bookInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    c(".bookInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});
c(".bookInfo--addButton").addEventListener("click", () => {
  let size = parseInt(c(".bookInfo--size.selected").getAttribute("data-key"));
  let identifier = bookJson[modalKey].id + "@" + size;
  let key = cart.findIndex((item) => item.identifier == identifier);
  if (key > -1) {
    cart[key].qt += modalQtd;
  } else {
    cart.push({
      identifier,
      id: bookJson[modalKey].id,
      size,
      qt: modalQtd,
    });
  }
  updateCart();
  closeModal();
});

c(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    c(".cart-book").style.left = "0";
  }
});
c(".menu-closer").addEventListener("click", () => {
  c(".cart-book").style.left = "100vw";
});

function updateCart() {
  c(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    c(".cart-book").classList.add("show");
    c(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let bookItem = bookJson.find((item) => item.id == cart[i].id);
      subtotal += bookItem.price * cart[i].qt;

      let cartItem = c(".models .cart--item").cloneNode(true);

      let bookSizeName;
      switch (cart[i].size) {
        case 0:
          bookSizeName = "Via E-mail";
          break;
        case 1:
          bookSizeName = "Via Sedex";
          break;
        case 2:
          bookSizeName = "Via Sedex";
          break;
      }
      let bookName = `${bookItem.name} (${bookSizeName})`;

      cartItem.querySelector("img").src = bookItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = bookName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      c(".cart").append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    c(".cart-book").classList.remove("show");
    c(".cart-book").style.rigth = "100vw";
  }
}

/* Validação do formulário */

const form = document.getElementById("contact");
const fields = document.querySelectorAll(".required");
const spans = document.querySelectorAll(".span-required");
const text = document.querySelector("#text-required");
const emailRegex =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  nameValidate();
  lastValidate();
  emailValidate();
});

function setError(index) {
  fields[index].style.border = "3px solid #e63636";
  spans[index].style.display = "block";
}

function removeError(index) {
  fields[index].style.border = "";
  spans[index].style.display = "none";
}

function nameValidate() {
  if (fields[0].value.length < 3) {
    setError(0);
  } else {
    removeError(0);
  }
}

function lastValidate() {
  if (fields[1].value.length < 3) {
    setError(1);
  } else {
    removeError(1);
  }
}

function emailValidate() {
  if (!emailRegex.test(fields[2].value)) {
    setError(2);
  } else {
    removeError(2);
  }
}
