let preloader = document.querySelector(".preload");
window.addEventListener("load", _ => {
  preloader.classList.add("preload-hide");
});

/* select elements */
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

/* edit option */
let editElement;
let editFlag = false;
let editID = "";


/* event listeners */
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems)
/* functions */
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  /* اول حاله ان يكون الانبوت بتاعي فيه قيمه واكون بضيف كلاس جديد مش بعدل عليه */
  if(value && !editFlag){
    createItem(id,value);
    displayAlert("item added to the list", "success");
    // show container 
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value);
    // set Back To Default
    setBackToDefault();
  }
  /* تانيه حاله ان يكون الانبوت بتاعي فيه قيمه واكون بعدت ع كلاس موجود بالفعل  */
  else if(value && editFlag){
    editElement.textContent = value;
    displayAlert("value changed", "success");

   // edit  local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  }
  else {
    displayAlert("please enter value", "danger");
  }
}
// add alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

// remove alert
  setTimeout(_ => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
// clear Items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if(items.length > 0) {
    items.forEach( (item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
} 
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.parentElement.firstChild;
  grocery.value = editElement.textContent;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.innerHTML = "Edit";
  grocery.focus();
} 
// set Back To Default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// local Storage
function addToLocalStorage(id, value) {
  const grocery = {id, value}  // {id, value} = {id: id, value: value} ولاكن بشكل مختصر  
  let item = getLocalStorage();
  item.push(grocery);
  localStorage.setItem("list", JSON.stringify(item));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value){
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items))
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// setup items
function setupItems() {
  let items = getLocalStorage();
  if(items.length > 0) {
    items.forEach((item) => {
      createItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}
function createItem(id, value) {
  let element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`;
  // delete item and Edit item
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element);
}