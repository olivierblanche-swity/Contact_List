function contactsApp() {
  return {
    contacts: JSON.parse(localStorage.contacts) || "[]",

    newContact: {
      firstname: "",
      lastname: "",
      email: "",
    },

    addContact() {
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
  };
}
