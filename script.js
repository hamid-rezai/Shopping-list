const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const addBtn = document.querySelector(".btn");
const itemList = document.querySelector("#item-list");
const itemFilter = document.querySelector("#filter");
const clearBtn = document.querySelector("#clear");
let isEditMode = false;

// Display item
function displayItem() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
}
function onAddItemSubmit(e) {
  e.preventDefault();

  // Validate input
  if (itemInput.value === "") {
    alert("Please add an item!");
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(itemInput.value)) {
      alert("That item exists in the item list!");
      itemInput.value = "";
      return;
    }
  }

  // Add item to DOM
  addItemToDOM(itemInput.value);

  // Add item to local storage
  addItemToStorage(itemInput.value);

  checkUI();

  itemInput.value = "";
}

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  // Add item to DOM
  itemList.appendChild(li);
  checkUI();
}

// Creating new button
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}
// Creating icon in button
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function getItemFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemFromStorage();
  // Add new item to array
  itemsFromStorage.push(item);
  // Converting to string and add to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList.querySelectorAll("li").forEach((i) => {
    i.classList.remove("edit-mode");
  });
  item.classList.add("edit-mode");
  addBtn.innerHTML = " <i class='fa-solid fa-pen'> </i>   Update Item";
  addBtn.style.backgroundColor = "#228b22";
  itemInput.value = item.textContent;
}

// Remove items
function removeItem(item) {
  if (confirm("Are you sure?")) {
    // Remove from DOM
    item.remove();
    //Remove from Storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();
  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  // Re-set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}
// Clear items
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // Clear from local storage
  localStorage.removeItem("items");

  checkUI();
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}

// Filter Item
function filterItem(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
// Check UI
function checkUI() {
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  addBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

// Even listeners
itemForm.addEventListener("submit", onAddItemSubmit);
itemList.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", filterItem);
document.addEventListener("DOMContentLoaded", displayItem);

checkUI();
