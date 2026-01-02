// DOM Elements
const productList = document.getElementById("productList");
const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const categoryInput = document.getElementById("category");
const search = document.getElementById("search");
const productForm = document.getElementById("productForm");

// Data
let products = JSON.parse(localStorage.getItem("products")) || [];
let editId = null;

/* =======================
   LOCAL STORAGE
======================= */
function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
}

/* =======================
   ADD / UPDATE PRODUCT
======================= */
productForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addProduct();
});

function addProduct() {
    const title = titleInput.value.trim();
    const price = Number(priceInput.value);
    const image = imageInput.value.trim() || "assets/images/headphone.jpg";
    const category = categoryInput.value;

    if (!title || !price || !category) {
        alert("Please fill all required fields");
        return;
    }

    if (editId === null) {
        products.push({
            id: Date.now(),
            title,
            price,
            image,
            category
        });
    } else {
        const index = products.findIndex(p => p.id === editId);
        products[index] = { id: editId, title, price, image, category };
        editId = null;
        productForm.querySelector("button").innerText = "Save Product";
    }

    saveData();
    displayProducts(products);
    clearInputs();
}

// function addProduct() {
//     const title = titleInput.value.trim();
//     const price = Number(priceInput.value);
//     const category = categoryInput.value;
//     const file = imageInput.files[0];

//     if (!title || !price || !category) {
//         alert("Please fill all required fields");
//         return;
//     }

//     if (file) {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = function () {
//             saveProduct(reader.result);
//         };
//     } else {
//         saveProduct("assets/images/headphone.jpg");
//     }
// }

// function saveProduct(image) {
//     if (editId === null) {
//         products.push({
//             id: Date.now(),
//             title: titleInput.value,
//             price: Number(priceInput.value),
//             image,
//             category: categoryInput.value
//         });
//     } else {
//         const index = products.findIndex(p => p.id === editId);
//         products[index] = {
//             id: editId,
//             title: titleInput.value,
//             price: Number(priceInput.value),
//             image,
//             category: categoryInput.value
//         };
//         editId = null;
//         productForm.querySelector("button").innerText = "Save Product";
//     }

//     saveData();
//     displayProducts(products);
//     clearInputs();
// }


/* =======================
   CLEAR FORM
======================= */
function clearInputs() {
    titleInput.value = "";
    priceInput.value = "";
    imageInput.value = "";
    categoryInput.value = "";
}

/* =======================
   DISPLAY PRODUCTS
======================= */
function displayProducts(list) {
    productList.innerHTML = "";

    if (list.length === 0) {
        productList.innerHTML = `<p class="text-center text-muted">No products found</p>`;
        return;
    }

    list.forEach(p => {
        productList.innerHTML += `
        <div class="col-md-3 mb-4">
            <div class="card product-card h-100">
               <img src="${p.image || 'assets/images/headphone.jpg'}" class="card-img-top"
               onerror="this.src='assets/images/headphone.jpg'">

                <div class="card-body">
                    <h5 class="card-title">${p.title}</h5>
                    <p class="fw-bold">₹${p.price}</p>
                   <span class="badge ${p.category}">${p.category}</span>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-success btn-sm" onclick="editProduct(${p.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
    });
}

function editProduct(id) {
    const p = products.find(p => p.id === id);
    titleInput.value = p.title;
    priceInput.value = p.price;
    imageInput.value = p.image;
    categoryInput.value = p.category;
    editId = id;
    productForm.querySelector("button").innerText = "Update Product";
}


function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    products = products.filter(p => p.id !== id);
    saveData();
    displayProducts(products);
}

/* =======================
   SORT
======================= */
function sortProducts(type) {
    let sorted = [...products];
    if (type === "low") sorted.sort((a, b) => a.price - b.price);
    if (type === "high") sorted.sort((a, b) => b.price - a.price);
    displayProducts(sorted);
}

/* =======================
   SEARCH
======================= */
function searchProduct() {
    const val = search.value.toLowerCase();
    displayProducts(
        products.filter(p => p.title.toLowerCase().includes(val))
    );
}


function filterCategory(cat) {
    displayProducts(
        cat ? products.filter(p => p.category === cat) : products
    );
}


displayProducts(products);
