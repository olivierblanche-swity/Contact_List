const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
const form = document.querySelector("#contact-form");
const contactsCountElement = document.querySelector("#contacts-count");
const contactsTableBody = document.querySelector(".contacts-table tbody");

function appendContactInARRAY(contact) {
  contacts.push(contact);
}

function updatelocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function displayContactsCount() {
  if (contactsCountElement) {
    contactsCountElement.innerText = contacts.length;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const contact = {
    id: Date.now(),
    firstname: formData.get("firstname")?.trim() || "",
    lastname: formData.get("lastname")?.trim() || "",
    email: formData.get("email")?.trim() || "",
  };
  appendContactInARRAY(contact);
  updatelocalStorage();
  displayContactsCount();
  form.reset();
});

function displayContacts() {
    contacts.forEach((contact) => {
        // Implementation for displaying each contact

        
    });
};
