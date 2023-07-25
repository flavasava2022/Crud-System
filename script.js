const title = document.getElementById("title");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const totalPerItem = document.getElementById("total-item");
const quantity = document.getElementById("quantity");
const category = document.getElementById("category");
const create = document.getElementById("create");
let tmp;
let btnState = "Create";
let deleteAllbtn = document.getElementById("deleteAll");
let searchValue = "Search By Title";

let totalProducts;
if (localStorage.products) {
  totalProducts = JSON.parse(localStorage.products);
} else totalProducts = [];

function getTotal() {
  if (price.value != "") {
    let results =
      Number(price.value) +
      Number(taxes.value) +
      Number(ads.value) -
      Number(discount.value);
    totalPerItem.innerHTML = results;
  } else {
    totalPerItem.innerHTML = 0;
  }
}

// create function

create.addEventListener("click", () => {
  let product = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value ? taxes.value : 0,
    ads: ads.value ? ads.value : 0,
    discount: discount.value ? discount.value : 0,
    totalPerItem: totalPerItem.innerHTML,
    quantity: quantity.value ? quantity.value : 1,
    category: category.value.toLowerCase(),
  };
  if (title.value && price.value && category.value) {
    if (btnState === "Create") {
      if (product.quantity > 1) {
        for (let i = 0; i < product.quantity; i++) {
          totalProducts.push(product);
        }
      } else totalProducts.push(product);
    } else {
      totalProducts[tmp] = product;
      create.innerText = "Create";
      btnState = "Create";
      quantity.style.pointerEvents = "all";
    }
    localStorage.setItem("products", JSON.stringify(totalProducts));
    clearData();
    fetchData(totalProducts);
    console.log(totalProducts);
  } else {
    title.placeholder = "This Field Is Requierd";
    title.classList.add("placeHolder");
    price.placeholder = "This Field Is Requierd";
    price.classList.add("placeHolder");
    category.placeholder = "This Field Is Requierd";
    category.classList.add("placeHolder");
  }
});

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = 0;
  ads.value = 0;
  discount.value = 0;
  totalPerItem.innerHTML = 0;
  quantity.value = 1;
  category.value = "";
  title.placeholder = "Item Name";
  title.classList.remove("placeHolder");
  price.placeholder = "Price";
  price.classList.remove("placeHolder");
  category.placeholder = "Category";
  category.classList.remove("placeHolder");
}
// fetch data
function fetchData(data) {
  document.getElementById("tbody").innerHTML = "";
  data.forEach((product, index) => {
    let html = `
    <tr>
    <td>${index + 1}</td>
    <td>${product.title}</td>
    <td>${product.price}</td>
    <td>${product.taxes}</td>
    <td>${product.ads}</td>
    <td>${product.discount}</td>
    <td>${product.totalPerItem}</td>
    <td>${product.category}</td>
    <td><button onclick='updateData(${index})' id="update">Update</button></td>
    <td><button onclick='deleteData(${index})' id="delete">Delete</button></td>
    </tr>
    `;
    document.getElementById("tbody").insertAdjacentHTML("beforeend", html);

    if (totalProducts.length > 0) {
      deleteAllbtn.innerHTML = `
          <button onclick="deleteAll()" id="deleteAll">
            Delete All (${totalProducts.length})
          </button>
          `;
    } else {
    }
  });
}
fetchData(totalProducts);
function deleteData(i) {
  totalProducts.splice(i, 1);
  localStorage.products = JSON.stringify(totalProducts);
  fetchData(totalProducts);
  if (totalProducts.length < 1) {
    deleteAllbtn.innerHTML = "";
  }
}
function updateData(i) {
  tmp = i;
  title.value = totalProducts[tmp].title;
  price.value = totalProducts[tmp].price;
  taxes.value = totalProducts[tmp].taxes;
  ads.value = totalProducts[tmp].ads;
  discount.value = totalProducts[tmp].discount;
  category.value = totalProducts[tmp].category;
  totalPerItem.innerHTML = totalProducts[tmp].totalPerItem;
  btnState = "Update";
  create.innerText = "Update";
  quantity.style.pointerEvents = "none";
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

function deleteAll() {
  localStorage.clear();
  totalProducts.splice(0);
  fetchData(totalProducts);
  deleteAllbtn.innerHTML = "";
}

function searchType(value) {
  if (value === "searchTitle") {
    searchValue = "Search By Title";
    document.getElementById("searchTitle").classList.add("clicked");
    document.getElementById("searchCat").classList.remove("clicked");
  } else {
    searchValue = "Search By category";
    document.getElementById("searchTitle").classList.remove("clicked");
    document.getElementById("searchCat").classList.add("clicked");
  }
  document.getElementById("search").placeholder = searchValue;
}

function searchWord(value) {
  if (searchValue === "Search By Title") {
    let searchData = totalProducts.filter((Element) => {
      return Element.title.includes(value.toLowerCase().trim());
    });
    fetchData(searchData);
  } else {
    let searchData = totalProducts.filter((Element) => {
      return Element.category.includes(value.toLowerCase().trim());
    });
    fetchData(searchData);
  }
}
