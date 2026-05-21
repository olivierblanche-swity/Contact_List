const contacts = JSON.parse(localStorage.contacts || "[]");
const form = document.querySelector("#contact-form");
const contactsCountElement = document.querySelector("#contacts-count");
const contactsTableBody = document.querySelector("#contacts-list");
const footerYear = document.querySelector("#footer-year");

// Fonction pour afficher les contacts dans le DOM
function addContactInDOM(contacts) {
  if (!contactsTableBody) return;
  contactsTableBody.innerHTML = "";

  contacts.forEach((contact) => {
    const listItem = document.createElement("tr");
    contactsTableBody.append(listItem);
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

// Affiche l'année actuelle dans le footer
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// Fonction pour ajouter un contact dans le tableau des contacts
function appendContactInARRAY(contact) {
  contacts.push(contact);
}

// Fonction pour mettre à jour le localStorage
function updatelocalStorage() {
  localStorage.contacts = JSON.stringify(contacts);
}

// Fonction pour afficher le nombre de contacts
function displayContactsCount() {
  if (contactsCountElement) {
    contactsCountElement.innerText = contacts.length;
  }
}

// pour afficher le nouveau contact

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const firstname = formData.get("firstname")?.trim(); // le ? permet d'éviter une erreur si le champ est absent
  const lastname = formData.get("lastname")?.trim();
  const email = formData.get("email")?.trim();

  // Empêcher l'ajout si tous les champs sont vides (required mis dans le html donc pas nécessaire mais ça ajoute une sécurité supplémentaire)
  if (!firstname && !lastname && !email) {
    alert("Veuillez remplir tous les champs");
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
  // Réinitialise le formulaire après l'ajout du contact
  form.reset();
});

// pour supprimer un contact
contactsTableBody.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".btn-delete");
  if (!deleteBtn) return;
  const id = Number(deleteBtn.dataset.id);
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index !== -1) {
    // Vérifie que le contact existe avant de tenter de le supprimer si -1 le contact n'existe pas
    contacts.splice(index, 1);
    updatelocalStorage();
    addContactInDOM(contacts);
  }
});

// pour modifier un contact
contactsTableBody.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".btn-edit");
  if (!editBtn) return;
  const id = Number(editBtn.dataset.id); // Récupère l'ID du contact à partir de l'attribut data-id du bouton et le convertit en nombre
  const index = contacts.findIndex((contact) => contact.id === id);
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
  const id = Number(saveBtn.dataset.id);
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return;
  const row = saveBtn.closest(".contact-row");
  if (!row) return;
  const inputFirstname = row.querySelector(".input-firstname");
  const inputLastname = row.querySelector(".input-lastname");
  const inputEmail = row.querySelector(".input-email");
  // Met à jour les valeurs du contact dans le tableau en utilisant les valeurs des champs de saisie si elles sont présentes, sinon conserve les anciennes valeurs
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

// Recherche en direct dans la barre de recherche

const searchInput = document.querySelector("#search-input");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const search = e.target.value.trim().toLowerCase();
    if (!search) {
      addContactInDOM(contacts);
      return;
    }
    const filteredContacts = contacts.filter((contact) => {
      return (
        contact.firstname.toLowerCase().includes(search) ||
        contact.lastname.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search)
      );
    });
    addContactInDOM(filteredContacts);
  });
}

// Tri des contacts par ordre asc  ou desc en cliquant sur les en-têtes de colonne

const sortFirstname = document.querySelector("#sort-firstname");
const sortLastname = document.querySelector("#sort-lastname");
const sortEmail = document.querySelector("#sort-email");

// état de la direction de tri: 1 = ASC, -1 = DESC on les mets tous en ASC au départ

const sortDirections = {
  firstname: 1,
  lastname: 1,
  email: 1,
};

// tri par firstname
if (sortFirstname) {
  sortFirstname.addEventListener("click", (e) => {
    e.preventDefault();
    const dir = sortDirections.firstname;
    // Inverse la direction pour le prochain clic
    sortDirections.firstname *= -1;

    addContactInDOM(
      contacts.sort((a, b) => a.firstname.localeCompare(b.firstname) * dir),
    );
  });
}

// tri par lastname
if (sortLastname) {
  sortLastname.addEventListener("click", (e) => {
    e.preventDefault();
    const dir = sortDirections.lastname;
    // Inverse la direction pour le prochain clic
    sortDirections.lastname *= -1;

    addContactInDOM(
      contacts.sort((a, b) => a.lastname.localeCompare(b.lastname) * dir),
    );
  });
}

// tri par email
if (sortEmail) {
  sortEmail.addEventListener("click", (e) => {
    e.preventDefault();
    const dir = sortDirections.email;
    // Inverse la direction pour le prochain clic
    sortDirections.email *= -1;

    addContactInDOM(
      contacts.sort((a, b) => a.email.localeCompare(b.email) * dir),
    );
  });
}
