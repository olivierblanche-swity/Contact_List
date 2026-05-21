const contacts = JSON.parse(localStorage.contacts || "[]");
const form = document.querySelector("#contact-form");
const contactsCountElement = document.querySelector("#contacts-count");
const contactsTableBody = document.querySelector("#contacts-list");

// Fonction pour ajouter un contact dans le tableau des contacts
function appendContactInARRAY(contact) {
  contacts.push(contact);
}

// Fonction pour mettre à jour le localStorage
function updatelocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Fonction pour afficher le nombre de contacts
function displayContactsCount() {
  if (contactsCountElement) {
    contactsCountElement.innerText = contacts.length;
  }
}

// Fonction pour afficher les contacts dans le DOM
function addContactInDOM(contacts) {
  if (!contactsTableBody) return;
  contactsTableBody.innerHTML = "";

  contacts.forEach((contact) => {
    const listItem = document.createElement("tr");
    contactsTableBody.appendChild(listItem);
    listItem.outerHTML = ` <tr class="contact-row">
      <td class="p-4">
        <span class="isEditing-hidden">${contact.firstname}</span>
        <input
          type="text"
          class="input-firstname isEditing-visible w-full mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value="${contact.firstname}"
        />
      </td>
      <td class="p-4">
        <span class="isEditing-hidden">${contact.lastname}</span>
        <input
          type="text"
          class="input-lastname isEditing-visible w-full mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value="${contact.lastname}"
        />
      </td>
      <td class="p-4">
        <span class="isEditing-hidden">${contact.email}</span>
        <input
          type="text"
          class="input-email isEditing-visible w-full mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value="${contact.email}"
        />
      </td>
      <td class="p-4">
        <div class="flex justify-end space-x-2">
          <button
            class="btn-check isEditing-visible bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md"
            data-id="${contact.id}"
          >
            <i class="fa-solid fa-check"></i>
          </button>
          <button
            class="btn-edit isEditing-hidden bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-md"
            data-id="${contact.id}"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            class="btn-delete isEditing-hidden bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
            data-id="${contact.id}"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`;
  });

  displayContactsCount();
}

// Affiche les contacts existants au chargement de la page
addContactInDOM(contacts);

// pour afficher le nouveau contact

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const firstname = formData.get("firstname")?.trim() || "";
  const lastname = formData.get("lastname")?.trim() || "";
  const email = formData.get("email")?.trim() || "";

  // Empêcher l'ajout si tous les champs sont vides
  if (!firstname && !lastname && !email) {
    alert("VVeuillez remplir tous les champs");
    return;
  }

  const contact = {
    id: Date.now(),
    firstname,
    lastname,
    email,
  };
  appendContactInARRAY(contact);
  updatelocalStorage();
  addContactInDOM(contacts);
  form.reset();
});

// pour supprimer un contact
contactsTableBody.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".btn-delete");
  if (!deleteBtn) return;
  const id = deleteBtn.dataset.id;
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(id),
  );
  if (index !== -1) {
    contacts.splice(index, 1);
    updatelocalStorage();
    addContactInDOM(contacts);
  }
});

// pour modifier un contact
contactsTableBody.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".btn-edit");
  if (!editBtn) return;
  const id = editBtn.dataset.id;
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(id),
  );
  const contactRow = e.target.closest(".contact-row");
  if (contactRow) {
    contactRow.classList.toggle("isEditing");
    console.log("Toggled edit for", id, contactRow);
  }
});
// pour sauvegarder les modifications (bouton check)
contactsTableBody.addEventListener("click", (e) => {
  const saveBtn = e.target.closest(".btn-check");
  if (!saveBtn) return;
  const id = saveBtn.dataset.id;
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(id),
  );
  if (index === -1) return;
  const row = saveBtn.closest(".contact-row");
  if (!row) return;
  const inputFirstname = row.querySelector(".input-firstname");
  const inputLastname = row.querySelector(".input-lastname");
  const inputEmail = row.querySelector(".input-email");
  contacts[index].firstname = inputFirstname
    ? inputFirstname.value.trim()
    : contacts[index].firstname;
  contacts[index].lastname = inputLastname
    ? inputLastname.value.trim()
    : contacts[index].lastname;
  contacts[index].email = inputEmail
    ? inputEmail.value.trim()
    : contacts[index].email;
  updatelocalStorage();
  addContactInDOM(contacts);
});

// pour valider la modification d'un contact
contactsTableBody.addEventListener("click", (e) => {
  const checkBtn = e.target.closest(".btn-check");
  if (!checkBtn) return;
  const id = checkBtn.dataset.id;
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(id),
  );
  const contactRow = e.target.closest(".contact-row");
  if (contactRow) {
    contactRow.classList.toggle("isEditing");
    console.log("Toggled edit for", id, contactRow);
  }
});

// Recherche en direct dans la barre de recherche
const searchInput = document.querySelector(
  'input[placeholder="Search a contact"]',
);
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const search = e.target.value.trim().toLowerCase();
    if (!search) {
      addContactInDOM(contacts);
      return;
    }
    const filteredContacts = contacts.filter((contact) => {
      return (
        (contact.firstname || "").toLowerCase().includes(search) ||
        (contact.lastname || "").toLowerCase().includes(search) ||
        (contact.email || "").toLowerCase().includes(search)
      );
    });
    addContactInDOM(filteredContacts);
  });
}

// Tri des contacts par ordre alphabétique

