///////////////////
// Global Data
///////////////////

// Save existing supplements to localStorage
let supplementStorage = localStorage.getItem("supplements") ? JSON.parse(localStorage.getItem("supplements")) : [];

//Initialize date for Qty countdown
const checkDate = (localStorage.getItem("app_date") !== null)
console.log("checkDate: ", checkDate);

if (checkDate) {
  localStorage.getItem("app_date", JSON.stringify(new Date().toLocaleDateString()));
  //lastUpdateTime.setHours(0, 0, 0, 0);
} else {
  let initialDate = new Date().toLocaleDateString();
  console.log("initialDate: ", initialDate);
  localStorage.setItem("app_date", initialDate);
}

//let lastUpdateTime = JSON.parse(localStorage.getItem("app_date"));
let lastUpdateTime = localStorage.getItem("app_date");
console.log("lastUpdateTime: ", lastUpdateTime);

//ul elements to hold data
const vitamins = document.getElementById("vitamins");
const prescriptions = document.getElementById("prescriptions");

//elements to filter data
const filterVitamins = document.getElementById("filter--vitamins");
const filterPrescriptions = document.getElementById("filter--prescriptions");
const filterAll = document.getElementById("filter--all");

//elements to open/close the create form
const supplementAdd = document.getElementById("add--supplement");
const formModal = document.getElementById("modal--form");
const formClose = document.getElementById("form--close");

//form inputs to some global variables
const supplementForm = document.getElementById("supplement-form");
const supplementName = document.getElementById("supplement-name");
const supplementDosage = document.getElementById("supplement-dosage");
const supplementUnit = document.getElementById("supplement-unit");
const supplementFreq = document.getElementById("supplement-qty-day");
const supplementQty = document.getElementById("supplement-qty");
const supplementCategory = document.querySelectorAll('input[name=category]');
const supplementSave = document.getElementById("supplement-save");

//elements to open/close update form
const modalUpdateForm = document.getElementById("modal--update-form");
const closeUpdateForm = document.getElementById("update-form--close");

//update form inputs to some global variables
const updateForm = document.getElementById("form--update-form");
const updateFormClose = document.getElementById("update-form--close");
const updateName = document.getElementById("update-name");
const updateDosage = document.getElementById("update-dosage");
const updateFreq = document.getElementById("update-freq");
const updateQty = document.getElementById("update-qty");
const supplementUpdate = document.getElementById("supplement-update");

///////////////
// Functions
///////////////

// checks if one day has passed. 
const hasOneDayPassed = () => {
  // get today's currentTime. eg: "7/37/2007"
  let currentTime = new Date().toLocaleDateString();
  console.log("currentTime: ", currentTime);

  // if there's a currentTime in localstorage and it's equal to the above: 
  // inferring a day has yet to pass since both currentTimes are equal.
  if (lastUpdateTime == currentTime) {
    console.log("a day has yet to pass");
    return false;
  } else {
    // this portion of logic occurs when a day has passed
    localStorage.app_date = currentTime;
    return true;
  }
}

// some function which should run once a day
const runOncePerDay = () => {
  console.log("hasOneDayPassed: ", hasOneDayPassed());
  if (!hasOneDayPassed()) return false;

  // your code below
  console.log("a day has passed");
  supplementStorage.forEach(item => {
    item.qty = item.qty - item.freq;
    console.log("qty updated");
  });
}
/*
const qtyCountdown = () => {
  let currentTime = new Date().toLocaleDateString();
  //currentTime.setHours(0, 0, 0, 0);
  if (currentTime - lastUpdateTime >= 24 * 60 * 60 * 1000) {
    supplementStorage.forEach(item => {
      console.log(currentTime - lastUpdateTime);
      lastUpdateTime = currentTime;
      console.log("lastUpdateTime: ", lastUpdateTime.toLocaleString());
      console.log("currentTime: ", currentTime.toLocaleString());
      item.qty = item.qty - item.freq;
      console.log("qty updated");
    })
  } else {
    let test = currentTime - lastUpdateTime;
    console.log(test);
    console.log("currentTime did not change");
    console.log("lastUpdateTime: ", lastUpdateTime.toLocaleString());
    console.log("currentTime: ", currentTime.toLocaleString());
  }
}
*/

// Render current data to DOM, use this whenever data changes
const renderData = () => {
  //qtyCountdown();

  //empty divs of any existing content
  vitamins.innerHTML = "";
  prescriptions.innerHTML = "";

  //loop over the supplements array
  supplementStorage.forEach((item, index) => {
    //console.log(item, index);

    const input = document.createElement("li");
    input.innerHTML = `
    <div id="med" class="med">
      <div class="med--top">
        <p class="med--name"><b>${item.name}</b></p>
        <p><b>|</b></p>
        <p class="med--dosage">${item.dosage}</p>
        <p class="med--freq">${item.freq}x Daily</p>
      </div>
      <div class="med--bottom">
        <p class="med--qty">${item.qty} days remaining</p>
      </div>
    </div>
    `
    if (item.category === "vitamin") {
      vitamins.appendChild(input);
    } else prescriptions.appendChild(input);

    const buttonContainer = document.createElement("aside");
    buttonContainer.id = "med--buttons";

    //Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.id = index;
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", event => {
      //remove the element at current index
      supplementStorage.splice(index, 1);
      renderData();
    })
    buttonContainer.appendChild(deleteButton);

    //Update Button
    const updateButton = document.createElement(`button`);
    updateButton.id = index;
    updateButton.innerText = "Update";
    updateButton.addEventListener("click", event => {
      event.preventDefault();
      console.log(index, "update clicked");
      modalUpdateForm.style.display = "block";
      updateName.value = item.name;
      updateDosage.value = item.dosage;
      updateFreq.value = item.freq;
      updateQty.value = item.qty;
      supplementUpdate.setAttribute("toupdate", index);
    })
    buttonContainer.appendChild(updateButton);
    input.appendChild(buttonContainer);
  })
  localStorage.setItem("supplements", JSON.stringify(supplementStorage));
}

const createData = () => {
  // Save form inputs in object
  let newSupplement = {};
  newSupplement.name = supplementName.value;
  newSupplement.dosage = supplementDosage.value;
  newSupplement.freq = supplementFreq.value;
  newSupplement.qty = supplementQty.value;
  // radio button values
  supplementCategory.forEach(c => {
    if (c.checked) {
      newSupplement.category = c.value;
    }
  });
  //push the new supplement object into the array
  supplementStorage.push(newSupplement);
  //save to localStorage
  localStorage.setItem("supplements", JSON.stringify(supplementStorage));
  //render the data again so it reflects the new data
  renderData();
  //close the modal
  formModal.style.display = "none";
}

const updateData = event => {
  const index = event.target.getAttribute("toupdate");
  const name = updateName.value;
  const dosage = updateDosage.value;
  const freq = updateFreq.value;
  const qty = updateQty.value;
  const category = supplementStorage[index].category;
  //replace existing object at that index with new updated values
  supplementStorage[index] = { name, dosage, freq, qty, category };
  localStorage.setItem("supplements", JSON.stringify(supplementStorage));
  renderData();
  //close update form modal
}

// When the user clicks on the 'Add Med' button, open the modal
supplementAdd.onclick = function() {
  event.preventDefault();
  formModal.style.display = "block";
}

// When the user clicks on (x), close the modal
formClose.onclick = function() {
  event.preventDefault();
  formModal.style.display = "none";
}

closeUpdateForm.onclick = function() {
  modalUpdateForm.style.display = "none";
}

filterAll.onclick = function() {
  event.preventDefault();
  filterAll.className = "active";
  filterVitamins.className = "filter-link";
  filterPrescriptions.className = "filter-link";
  vitamins.style.display = "block";
  prescriptions.style.display = "block";
}

filterVitamins.onclick = function() {
  event.preventDefault();
  filterVitamins.className = "active";
  filterAll.className = "filter-link";
  filterPrescriptions.className = "filter-link";
  vitamins.style.display = "block";
  prescriptions.style.display = "none";
}

filterPrescriptions.onclick = function() {
  event.preventDefault();
  filterPrescriptions.className = "active"
  filterAll.className = "filter-link";
  filterVitamins.className = "filter-link";
  vitamins.style.display = "none";
  prescriptions.style.display = "block";
}

////////////////////
// Main App Logic
////////////////////

//call the render data function for the initial rendering of the data

runOncePerDay();
renderData();
supplementForm.addEventListener("submit", createData);
supplementUpdate.addEventListener("click", updateData);

///////////////////
// Old Code
///////////////////
/*
// Add new supplement when form is submitted
supplementForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Save form inputs in object
  let newSupplement = {};
  newSupplement.name = supplementName.value;
  newSupplement.dosage = supplementDosage.value;
  newSupplement.freq = supplementFreq.value;
  newSupplement.qty = supplementQty.value;
  // radio button values
  supplementCategory.forEach(c => {
    if (c.checked) {
      newSupplement.category = c.value;
    }
  });

  const newSupplement = {
    name: supplementName.value,
    dosage: supplementDosage.value,
    unit: supplementUnit.value,
    qty: supplementQty.value,
    category: supplementCategory.value,
    // radio button values
  }

  supplementStorage.push(newSupplement);
  localStorage.setItem("supplements", JSON.stringify(supplementStorage));
  //listBuilder();
  formModal.style.display = "none";
  // Clear form
});

// Add supplement to unordered list element in HTML markup
const listBuilder = () => {
  supplementStorage.map(item => {
    const input = document.createElement("li");
    input.innerHTML = `
    <div class="med">
      <div class="med--top">
        <p class="med--name"><b>${item.name}</b></p>
        <p><b>|</b></p>
        <p class="med--dosage">${item.dosage}</p>
        <p class="med--freq">${item.freq} Daily</p>
      </div>
      <div class="med--bottom">
        <p class="med--qty">${item.qty} days remaining</p>
      </div>
    </div>
    <button>Edit</button>
    `
    if (item.category === "vitamin") {
      vitamins.appendChild(input);
    } else prescriptions.appendChild(input);
  });
}

// When the user clicks on the 'Add Med' button, open the modal
supplementAdd.onclick = function() {
  formModal.style.display = "block";
}

// When the user clicks on (x), close the modal
formClose.onclick = function() {
  formModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == formModal) {
    formModal.style.display = "none";
  }
}

//listBuilder();
*/