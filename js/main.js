

var EmergencyNumber = document.getElementById("Emergency-Number");
var FavoritesNumber = document.getElementById("Favorites-Number");
var TotalNumber = document.getElementById("Total-Number");
var AddContentBtn = document.getElementById("AddContentBtn");
var addPannel = document.getElementById("addPannel");
var closeXmark = document.getElementById("closeXmark");
var cancelModalBtn = document.getElementById("cancelModalBtn");
var saveModalBtn = document.getElementById("saveModalBtn");
var confirmUpdateBtn = document.getElementById("cofirmModalBtn");
var ContactsSearchInput = document.getElementById("ContactsSearchInput");
var contactName = document.getElementById("contactName");
var Phone = document.getElementById("contactPhone");
var Email = document.getElementById("contactEmail");
var Address = document.getElementById("contactAddress");
var Group = document.getElementById("contactGroup");
var Notes = document.getElementById("contactNotes");
var Favorite = document.getElementById("contactFavorite");
var Emergency = document.getElementById("contactEmergency");
var image = document.getElementById("profile-img");
var addingText = document.getElementById("modal-header-text");
var ContactsGrid = document.getElementById("ContactsGrid");
var contactCount = document.getElementById("contact-count");
var totalcontactCount = document.getElementById("Total-Number");
var emergencycontactCount = document.getElementById("Emergency-Number");
var favoritescontactCount = document.getElementById("Favorites-Number");
var contactscardsfavoritesgrid = document.getElementById("contacts-cards-favorites-grid");
var contactscardsemergencygrid = document.getElementById("contacts-cards-emergency-grid");
var currentIndex = 0;
var Contacts = JSON.parse(localStorage.getItem('Contacts')) || [];
var nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;
var egyPhoneRegex = /^(\+20|0020|20)?0?1[0125][0-9]{8}$/;
var mailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
var contactEmailError = document.getElementById("contactEmailError");
var contactPhoneError = document.getElementById("contactPhoneError");
var contactNameError = document.getElementById("contactNameError");


displayContent(Contacts);

//Events
AddContentBtn.addEventListener("click", function () {
    showAddingPannel();

});
closeXmark.addEventListener("click", function () {
    closeAddingPannel();
    clearPannel();
});
cancelModalBtn.addEventListener("click", function () {
    closeAddingPannel();
    clearPannel();
});
function showAddingPannel() {
    addingText.innerText = "Add New Contact";
    addPannel.classList.remove("d-none");
    clearPannel();
}
function closeAddingPannel() {
    addPannel.classList.add("d-none");
    clearPannel();
}
function getNameWithPhone(phone) {
    for (let i = 0; i < Contacts.length; i++) {
        if (Contacts[i].phoneNumber === phone) {
            return Contacts[i].fullName;
        }
    }
}
function checkInputs() {
    if (contactName.value.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Missing Name",
            text: "Please enter a name for the contact!"
        });
        return false;
    }
    else if (!inputRegexValidation(contactName.value, nameRegex)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Name",
            text: "Name should contain only letters and spaces (2-50 characters)"
        });
        return false;
    }
    else if (Phone.value.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Missing Phone",
            text: "Please enter a phone number!"
        });
        return false;
    }
    else if (!inputRegexValidation(Phone.value, egyPhoneRegex)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone",
            text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)"
        });
        return false;
    }
    else if (!phoneuniquenessCheck(Phone.value)) {
        Swal.fire({
            icon: "error",
            title: "Duplicate Phone Number",
            text: "A contact with this phone number already exists: " + getNameWithPhone(Phone.value)
        });
        return false;
    }
    else if (Email.value.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Missing Email",
            text: "Please enter a Email for the contact!"
        });
        return false;
    }
    else if (!inputRegexValidation(Email.value, mailRegex)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address"
        });
        return false;
    }

    return true;
}

function addContent() {
    toggleButtonsPanel(false);
    var Contact = {
        fullName: contactName.value,
        phoneNumber: Phone.value,
        Email: Email.value,
        Address: Address.value,
        Group: Group.value,
        Notes: Notes.value,
        Favorite: Favorite.checked,
        Emergency: Emergency.checked,
        image: image.files[0]?.name || getInitials(contactName.value),
    }

    if (checkInputs()) {
        Contacts.push(Contact);
        handelContactsLocalStorage();
        clearPannel();
        closeAddingPannel();
        Swal.fire({
            icon: "success",
            title: "Added!",
            text: "Contact has been added successfully.",
            timer: 1500,
            showConfirmButton: !1
        });

        displayContent(Contacts);
    }

}
function getInitials(FullName) {
    return FullName
        .split(" ")
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}
function displayContent(displayContacts) {
    var container = "";
    showTotalcontactCount();
    // show Favorite and  Emergency count 
    showFavoritescontactCount();
    showEmergencycontactCount();
    // show Favorite and  Emergency Cards 
    showEmergencyContactCards();
    showFavoriteContactCards();
    if (displayContacts.length == 0) {
        ContactsGrid.innerHTML =
            `
         <div class="col-12 p-5">
                    <div class="empty-state d-flex align-items-center justify-content-center flex-column mt-5">
                        <div class="empty-icon-wrapper p-4 rounded-4  fs-2">
                            <i class="fa-solid fa-address-book"></i>
                        </div>
                        <p class="empty-title fs-6 fw-semibold mt-2">No contacts found</p>
                        <p class="empty-subtitle fs-14 fw-medium">Click "Add Contact" to get started</p>
                    </div>

            </div>
        `;
        return;
    }
    for (let i = 0; i < displayContacts.length; i++) {
        container +=
            `
             <div class="col-12 col-md-6">
                                    <div class="contacts-grid-wrapper stats-card-Total rounded-4">
                                        <div class="contact-card p-3">
                                            <div class="contact-card-body">
                                                <div class="contact-card-header  d-flex gap-3 align-items-center">
                                                    <div class="contact-card-avatar-wrapper">
                                                        <div
                                                            class="contact-card-avatar rounded-3 text-white fw-semibold fs-5 d-flex align-items-center justify-content-center position-relative"> 
                                                            ${imagePrpare(Contacts[i].image, Contacts[i].fullName)}
                                                            <div
                                                               class="floating-avatar ${Contacts[i].Favorite ? '' : 'd-none'}  floating-avatar-star rounded-circle bg-yellow position-absolute fs-8 d-flex align-items-center justify-content-center " >
                                                                <i class="fa-solid fa-star text-white"></i>
                                                            </div>
                                                            <div
                                                                class="floating-avatar  ${Contacts[i].Emergency ? '' : 'd-none'}  floating-avatar-heart rounded-circle bg-red--gradient position-absolute  fs-8 d-flex align-items-center justify-content-center " >
                                                                <i class="fa-solid fa-heart-pulse text-white"></i>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div class="contact-card-info">
                                                        <h2 class="contact-card-name fs-6 fw-semibold">${Contacts[i].fullName}
                                                        </h2>
                                                        <div class="contact-card-phone-row d-flex flex-wrap gap-2 ">
                                                            <div
                                                                class="contact-card-phone-icon  bg-blue-100 d-flex align-items-center justify-content-center rounded-2 p-1 fs-10 ">
                                                                <i class="fa-solid fa-phone text-blue-600 "></i>
                                                            </div>
                                                            <span
                                                                class="contact-card-phone  fs-14 fw-normal  text-gray-muted ">${Contacts[i].phoneNumber}</span>
                                                        </div>

                                                    </div>

                                                </div>

                                                <div class="contact-card-details pt-3">
                                                    <div
                                                        class="contact-card-detail-item d-flex align-items-center gap-2">
                                                        <div
                                                            class="contact-card-detail-icon bg-violet-100  d-flex align-items-center justify-content-center rounded-2 p-2 fs-10 ">
                                                            <i class="fa-solid fa-envelope text-violet-600"></i>
                                                        </div>
                                                        <span
                                                            class="contact-card-detail-text  fs-6 fw-normal fw-normal  text-gray-muted ">
                                                           ${Contacts[i].Email}</span>
                                                    </div>
                                                    <div
                                                        class="contact-card-detail-item d-flex align-items-center gap-2 mt-2">
                                                        <div
                                                            class="contact-card-detail-icon bg-emerald-100  d-flex align-items-center justify-content-center rounded-2 p-2 fs-10 ">
                                                            <i class="fa-solid fa-location-dot text-emerald-600"></i>
                                                        </div>
                                                        <span
                                                            class="contact-card-detail-text  fs-6 fw-normal fw-normal  text-gray-muted ">${Contacts[i].Address}</span>
                                                    </div>
                                                </div>
                                                <div class="contact-card-tags d-flex align-items-center gap-3 mt-3">
                                                   <div
                                                        class="contact-card-emergency-tag  px-2 py-1 rounded-3 fs-12 ${Contacts[i].Group}">
                                                        <span class=" fw-bold">${Contacts[i].Group}</span>
                                                    </div>

                                                    <div
                                                        class="${Contacts[i].Emergency ? '' : 'd-none'} contact-card-tag px-3 py-1 rounded-3 text-rose-600 bg-rose-100 fs-12 ">
                                                        <i class="fa-solid fa-heart-pulse "></i> <span
                                                            class="fw-bold">Emergency</span>
                                                    </div>
                                                </div>

                                            </div>

                                            <div
                                                class="contact-card-footer mt-3 d-flex align-items-center justify-content-between">
                                                <div
                                                    class="contact-card-actions-left d-flex flex-nowrap align-items-center  gap-3">
                                                    <a class="contact-card-action-call   d-flex align-items-center justify-content-center rounded-2 p-2 fs-12 "
                                                        href="tel:${Contacts[i].phoneNumber}">
                                                        <i class="fa-solid fa-phone text-emerald-600 "></i>
                                                    </a>
                                                    <a href="mailto:${Contacts[i].Email}"
                                                        class="contact-card-action-email  d-flex align-items-center justify-content-center rounded-2 p-2 fs-12 ">
                                                        <i class="fa-solid fa-envelope text-violet-600"></i>
                                                    </a>
                                                </div>

                                                <div class="contact-card-actions-right d-flex align-items-center gap-3">
                                                    <a
                                                        class="contact-card-action-favorite  ${Contacts[i].Favorite ? '' : 'd-none'} p-2 rounded-3 cursor-pointer " onclick=" toggleFavorite(${i}) ">
                                                        <i class="fa-solid fa-star "></i>
                                                    </a>
                                                       <button
                                                        class="contact-card-action-favorite  ${Contacts[i].Favorite ? 'd-none' : ''} btn  p-2 rounded-3 cursor-pointer "  onclick="toggleFavorite(${i})">
                                                        <i class="fa-regular fa-star "></i>
                                                    </button>
                                                    <a
                                                        class="contact-card-action-emergency  ${Contacts[i].Emergency ? '' : 'd-none'} p-2 rounded-3 cursor-pointer" onclick="toggleEmergency(${i})">
                                                        <i class="fa-solid fa-heart-pulse  text-rose-600"></i>
                                                    </a>
                                                 
                                                    <button
                                                        class="contact-card-action-emergency ${Contacts[i].Emergency ? 'd-none' : ''} btn p-2 rounded-3 cursor-pointer" onclick="toggleEmergency(${i})" >
                                                        <i class="fa-regular fa-heart "></i>
                                                    </button>

                                                    <a class="contact-card-action-edit  p-2 rounded-3 cursor-pointer" " onclick="updateContent('${i}')">
                                                        <i class="fa-solid fa-pen "></i>
                                                    </a>
                                                    <a
                                                        class="contact-card-action-delete   p-2 rounded-3 cursor-pointer " onclick="deleteContent('${i}')" >
                                                        <i class="fa-solid fa-trash "></i>
                                                    </a>
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                </div>
         `
            ;

    }
    ContactsGrid.innerHTML = container;
}
function imagePrpare(src, fullName) {

    if (typeof src !== "string") {
        return `
            <div class="contact-card-avatar-img">
                <span>${getInitials(fullName)}</span>
            </div>
        `;
    }

    if (
        src.toLowerCase().endsWith(".png") ||
        src.toLowerCase().endsWith(".jpg") ||
        src.toLowerCase().endsWith(".jpeg")
    ) {
        return `
            <div class="contact-card-avatar-img">
                <img class="img-fluid rounded-3"
                     src="./images/${src}"
                     alt="Profile Image">
            </div>
        `;
    }

    return `
        <div class="contact-card-avatar-img">
            <span>${getInitials(fullName)}</span>
        </div>
    `;
}
function imageExists(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);

        img.src = src;
    });
}
function showEmergencycontactCount() {
    showStatsCount("Emergency", emergencycontactCount);

}
function showFavoritescontactCount() {
    showStatsCount("Favorite", favoritescontactCount)

}
function showTotalcontactCount() {
    totalcontactCount.innerHTML = Contacts.length;
    contactCount.innerHTML = Contacts.length;
}
function showStatsCount(statsType, outputPlace) {
    var count = 0;
    for (let i = 0; i < Contacts.length; i++) {
        if (Contacts[i][statsType]) {
            count++;
        }
    }
    outputPlace.innerHTML = count;

}

function showEmergencyContactCards() {
    var container = "";
    var emergencyFound = false;
    for (let i = 0; i < Contacts.length; i++) {
        if (Contacts[i].Emergency) {
            emergencyFound = true;
            container +=
                `
    <div class="col-12">
                                            <div class="contacts-cards-Emergency-content-wrapper p-1">
                                                <div
                                                    class="contacts-cards-content d-flex gap-3 justify-content-between align-items-center p-2 rounded-3">
                                                    <div
                                                        class="contacts-cards-content-left d-flex gap-2 align-items-center">
                                                        <div
                                                            class="stats-card-icon box-shadow-blue bg-blue--gradient text-white fs-6 rounded-3  d-flex align-items-center justify-content-center ">
                                                            <span id="EmergencyFNameLetters">${imagePrpare(Contacts[i].image, Contacts[i].fullName)}</span>
                                                        </div>
                                                        <div class="stats-card-content d-flex flex-column  ">
                                                            <span class="fs-6 fw-semibold">${Contacts[i].fullName}</span>
                                                            <span
                                                                class="fw-normal fs-12 text-gray-muted ">${Contacts[i].phoneNumber}</span>
                                                        </div>
                                                    </div>
                                                    <div class="contacts-cards-content-right">
                                                        <a id="EmergencyPhoneNumber" href="tel:+${Contacts[i].phoneNumber}"
                                                            class="stats-card-icon fs-6 rounded-3  d-flex align-items-center justify-content-center bg-light-red--gradient rounded-3 ">
                                                            <i class="fa-solid fa-phone  text-danger"></i>
                                                        </a>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
            `;
        }


    }
    if (emergencyFound) {
        contactscardsemergencygrid.innerHTML = container;
    }
    else {
        contactscardsemergencygrid.innerHTML =
            `<div class="col-12 d-flex justify-content-center align-items-center p-5">
          <div class="no-emergency d-flex justify-content-center align-items-center w-100 h-100">
        <p class="text-gray-muted fw-normal  fs-14 ">No emergency contacts</p>
            </div>
            </div>
         `
    }

}
function showFavoriteContactCards() {
    var container = "";
    var favoriteFound = false;
    for (let i = 0; i < Contacts.length; i++) {
        if (Contacts[i].Favorite) {
            favoriteFound = true;
            container +=
                `
             <div class="col-12">
                                            <div class="contacts-cards-Favorites-content-wrapper p-1">
                                                <div
                                                    class="contacts-cards-content d-flex gap-3 justify-content-between align-items-center p-2 rounded-3">
                                                    <div
                                                        class="contacts-cards-content-left d-flex gap-2 align-items-center">
                                                        <div
                                                            class="stats-card-icon box-shadow-blue bg-blue--gradient text-white fs-6 rounded-3  d-flex align-items-center justify-content-center ">
                                                            <span id="FavoritesFNameLetters">
                                                             ${imagePrpare(Contacts[i].image, Contacts[i].fullName)}</span>
                                                        </div>
                                                        <div class="stats-card-content d-flex flex-column  ">
                                                            <span class="fs-6 fw-semibold">${Contacts[i].fullName}</span>
                                                            <span
                                                                class="fw-normal fs-12 text-gray-muted ">${Contacts[i].phoneNumber}</span>
                                                        </div>
                                                    </div>
                                                    <div class="contacts-cards-content-right">
                                                        <a id="FavoritesPhoneNumber" href="tel:+${Contacts[i].phoneNumber}"
                                                            class="stats-card-icon  text-white fs-6 rounded-3  d-flex align-items-center justify-content-center bg-light-green--gradient rounded-3 ">
                                                            <i class="fa-solid fa-phone  text--icon--green"></i>
                                                        </a>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>

            `;
        }

    }
    if (favoriteFound) {
        contactscardsfavoritesgrid.innerHTML = container;
    }
    else {
        contactscardsfavoritesgrid.innerHTML =
            `
            <div class="col-12  p-5">
          <div  class="no-favorites d-flex justify-content-center align-items-center">
        <p class="text-gray-muted fw-normal  fs-14 "> No favorites yet </p>
            </div>
            </div>
         `
    }

}

function clearPannel() {
    contactName.value = "";
    Phone.value = "";
    Email.value = "";
    Address.value = "";
    Group.value = "empty";
    Notes.value = "";
    Favorite.checked = false;
    Emergency.checked = false;
    image.value = "";
}
function handelContactsLocalStorage() {
    localStorage.setItem('Contacts', JSON.stringify(Contacts));
}

function deleteContent(currentElemenIndex) {
    Swal.fire({
        title: "Delete Contact?",
        text: "Are you sure you want to delete " + Contacts[currentElemenIndex].fullName + "? This action cannot be undone.",
        icon: "warning",
        showCancelButton: !0,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            if (currentElemenIndex != -1) {
                Contacts.splice(currentElemenIndex, 1);
                handelContactsLocalStorage();
                displayContent(Contacts);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: !1
                });
            }

        }

    });



}
function showUpdatingPannel() {
    addingText.innerText = "Edit Contact";
    addPannel.classList.remove("d-none");

}
function updateContent(currentElemenIndex) {
    currentIndex = currentElemenIndex;
    toggleButtonsPanel(true);
    showUpdatingPannel();
    contactName.value = Contacts[currentElemenIndex].fullName;
    Phone.value = Contacts[currentElemenIndex].phoneNumber;
    Email.value = Contacts[currentElemenIndex].Email;
    Address.value = Contacts[currentElemenIndex].Address;
    Group.value = Contacts[currentElemenIndex].Group;
    Notes.value = Contacts[currentElemenIndex].Notes;
    Favorite.checked = Contacts[currentElemenIndex].Favorite;
    Emergency.checked = Contacts[currentElemenIndex].Emergency;

}

function confirmUpdate() {
    var oldImage = Contacts[currentIndex].image;
    var Contact = {
        fullName: contactName.value,
        phoneNumber: Phone.value,
        Email: Email.value,
        Address: Address.value,
        Group: Group.value,
        Notes: Notes.value,
        Favorite: Favorite.checked,
        Emergency: Emergency.checked,
        image: image.files[0]?.name || getInitials(contactName.value),
    }
    var fileName = image.files[0]?.name?.toLowerCase();

    if (
        fileName?.endsWith(".png") ||
        fileName?.endsWith(".jpg") ||
        fileName?.endsWith(".jpeg")
    ) {
        Contacts[currentIndex] = Contact;
    } else {
        Contact.image = oldImage;
        Contacts[currentIndex] = Contact;
    }

    handelContactsLocalStorage();

    clearPannel();
    closeAddingPannel();
    Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Contact has been updated successfully.",
        timer: 1500,
        showConfirmButton: !1
    });

    displayContent(Contacts);


}
function toggleButtonsPanel(hide) {
    if (hide) {
        saveModalBtn.classList.add('d-none')
        confirmUpdateBtn.classList.remove('d-none')
    }
    else {
        saveModalBtn.classList.remove('d-none')
        confirmUpdateBtn.classList.add('d-none')
    }
}
function toggleFavorite(index) {
    Contacts[index].Favorite = !Contacts[index].Favorite;
    handelContactsLocalStorage();
    displayContent(Contacts);
}
function toggleEmergency(index) {
    Contacts[index].Emergency = !Contacts[index].Emergency;
    handelContactsLocalStorage();
    displayContent(Contacts);
}

function phoneuniquenessCheck(phoneNumber) {
    for (let i = 0; i < Contacts.length; i++) {
        if (Contacts[i].phoneNumber === phoneNumber) {
            return false;
        }
    }
    return true;
}
contactName.addEventListener("keyup", function () {
    checkInputType(contactName, contactNameError, nameRegex);
});
contactPhone.addEventListener("keyup", function () {
    checkInputType(contactPhone, contactPhoneError, egyPhoneRegex);
});
contactEmail.addEventListener("keyup", function () {
    checkInputType(contactEmail, contactEmailError, mailRegex);
});
function checkInputType(inputElemen, errorEle, regex) {
    var inputIsValid = inputRegexValidation(inputElemen.value, regex);

    errorEle.classList.toggle('d-none', inputIsValid);

    inputElemen.style.setProperty(
        'border-color',
        inputIsValid ? '' : 'red',
        'important'
    );

}
function inputRegexValidation(inputValue, Regex) {
    return Regex.test(inputValue);
}

ContactsSearchInput.addEventListener("keyup", function () {
    searchContent();
});
function searchContent() {
    var searchContents = [];
    for (let i = 0; i < Contacts.length; i++) {
        if (
            Contacts[i].fullName.toLocaleLowerCase().includes(ContactsSearchInput.value.toLocaleLowerCase()) ||
            Contacts[i].Email.toLocaleLowerCase().includes(ContactsSearchInput.value.toLocaleLowerCase()) ||
            Contacts[i].phoneNumber.toLocaleLowerCase().includes(ContactsSearchInput.value.toLocaleLowerCase())
        ) {
            searchContents.push(Contacts[i]);
        }
    }
    displayContent(searchContents);
}