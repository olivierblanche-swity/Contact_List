function contactsApp() {
  return {
    contacts: JSON.parse(localStorage.contacts || "[]"),

    search: "",

    currentSort: "",

    currentDirection: "asc",

    newContact: {
      firstname: "",
      lastname: "",
      email: "",
    },

    // filtrage des contacts en fonction de la recherche
    get filteredContacts() {
      return this.contacts.filter((contact) => {
        const search = this.search.toLowerCase().trim();
        return (
          contact.firstname.toLowerCase().includes(search) ||
          contact.lastname.toLowerCase().includes(search) ||
          contact.email.toLowerCase().includes(search)
        );
      });
    },

    // Ajout d'un nouveau contact
    addContact() {
      if (
        !this.newContact.firstname &&
        !this.newContact.lastname &&
        !this.newContact.email
      ) {
        alert("Veuillez remplir tous les champs");
        return;
      }
      this.contacts.push({
        id: Date.now(),
        firstname: this.newContact.firstname,
        lastname: this.newContact.lastname,
        email: this.newContact.email,
        isEditing: false,
      });
      this.newContact.firstname = "";
      this.newContact.lastname = "";
      this.newContact.email = "";
    },

    // Edition d'un contact
    editContact(contact) {
      contact.isEditing = true;
    },

    // Sauvegarde des modifications d'un contact
    saveContact(contact) {
      contact.isEditing = false;
    },

    // Suppression d'un contact
    deleteContact(contact) {
      this.contacts = this.contacts.filter((item) => item.id !== contact.id);
    },

    // Watcher pour sauvegarder les contacts dans le localStorage à chaque modification
    watcher() {
      this.$watch("contacts", (newValue, oldValue) => {
        localStorage.contacts = JSON.stringify(this.contacts);
      });
    },

    // Compteur de contacts
    contactCounter() {
      return this.contacts.length;
    },

    // Tri des contacts par ID
    sortById() {
      this.contacts.sort((a, b) => a.id - b.id);
    },

    // Tri des contacts par ordre asc  ou desc en cliquant sur les en-têtes de colonne
    sort(column) {
      if (this.currentSort === column) {
        this.currentDirection =
          this.currentDirection === "asc" ? "desc" : "asc";
      } else {
        this.currentSort = column;
        this.currentDirection = "asc";
      }
      this.contacts.sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
        if (this.currentDirection === "asc") {
          return aValue.localeCompare(bValue); // localeCompare est mieux pour rechercher dans des chaînes de caractères
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    },
  };
}

document.addEventListener("alpine:init", () => {
  Alpine.data("footerComponent", () => ({
    annee: new Date().getFullYear(),
  }));
});
