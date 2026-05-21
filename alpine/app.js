function contactsApp() {
  return {
    contacts: JSON.parse(localStorage.contacts || "[]"),

    search: "",

    currentSort:"",
    currentDirection:"asc",

    newContact: {
      firstname: "",
      lastname: "",
      email: "",
    },

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

    editContact(contact) {
      contact.isEditing = true;
    },

    saveContact(contact) {
      contact.isEditing = false;
    },

    deleteContact(contact) {
      this.contacts = this.contacts.filter((item) => item.id !== contact.id);
    },

    watcher() {
      this.$watch("contacts", (newValue, oldValue) => {
        localStorage.contacts = JSON.stringify(this.contacts);
      });
    },

    contactCounter() {
      return this.contacts.length;
    },

    sortById() {
     this.contacts.sort((a, b) => a.id - b.id); 
    },


    sort(column) {
      if (this.currentSort === column) {
        this.currentDirection = this.currentDirection === "asc" ? "desc" : "asc";
      } else {
        this.currentSort = column;
        this.currentDirection = "asc";
      }
      this.contacts.sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
        if (this.currentDirection === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    
  };
}
