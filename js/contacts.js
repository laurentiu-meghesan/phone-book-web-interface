var editId;
var contacts = [];

window.PhoneBook = {

    API_BASE_URL: "http://localhost:8082/agenda",

    getContacts: function () {
        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            PhoneBook.displayContacts(JSON.parse(response));
        })
    },

    deleteContact: function (id) {
        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id=" + id,
            method: "DELETE"
        }).done(function () {
            PhoneBook.getContacts();
        })
    },

    deleteAllContacts: function () {
        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method: "DELETE"
        }).done(function () {
            PhoneBook.getContacts();
        })
    },

    createContact: function () {

        let firstNameValue = $("#firstName-field").val();
        let lastNameValue = $("#lastName-field").val();
        let phoneNumberValue = $("#phoneNumber-field").val();

        let requestBody = {
            firstName: firstNameValue,
            lastName: lastNameValue,
            phoneNumber: phoneNumberValue
        };

        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            PhoneBook.getContacts();
        })
    },

    editContact: function (id) {

        let firstNameValue = $("#firstName").val();
        let lastNameValue = $("#lastName").val();
        let phoneNumberValue = $("#phone").val();

        let requestBody = {
            firstName: firstNameValue,
            lastName: lastNameValue,
            phoneNumber: phoneNumberValue
        };

        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id=" + id,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(requestBody)

        }).done(function (response) {
            if (response.success) {
                PhoneBook.cancelEdit();
                PhoneBookLocalActions.update(id)
                PhoneBook.getContacts();
            }
        })
    },

    getContactRow: function (contact) {

        return `<tr>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.phoneNumber}</td>
            <td>
            <a href="#" data-id=${contact.id} class="edit"><i class="fas fa-user-edit"></i></a>
            
            <a href="#" data-id=${contact.id} class="delete-contact"><i class="fas fa-user-slash"></i></a>
            </td>
        </tr>`
    },

    displayContacts: function (contacts) {
        var tableBody = '';

        contacts.forEach(contact => tableBody += PhoneBook.getContactRow(contact))

        $("#contacts-table tbody").html(tableBody);
    },


    bindEvents: function () {

        $("#contacts-table").delegate('.edit', 'click', function () {
            var id = $(this).data('id');
            PhoneBook.startEdit(id);
        });

        $("#new-contact-form").submit(function (event) {
            event.preventDefault();
            PhoneBook.createContact();
        });

        $("#search-delete").delegate(".delete-button", "click", function () {
            event.preventDefault();
            PhoneBook.deleteAllContacts();
        })

        $("#contacts-table").delegate(".delete-contact", "click", function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");

            PhoneBook.deleteContact(contactId);
        });

        $("#add-form").submit(function (event) {
            event.preventDefault();
            const contact = {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                phoneNumber: $('input[name=phoneNumber]').val(),
            };

            let id = $(this).data("id");

            if (editId) {
                contact.id = editId;
                PhoneBook.editContact(contact);
            } else {
                PhoneBook.createContact(contact);
            }
        });

        $('#search').keyup(function () {

            var $rows = $('#contacts-table tbody tr')
            var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

            $rows.show().filter(function () {
                var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                return !~text.indexOf(val);
            }).hide();
        });

        /*     document.getElementById('search').addEventListener('input', function() {
                 //const value = document.getElementById('search').value;
                 const value = this.value;
                 PhoneBook.search(value);
             });*/
        document.querySelector('.add-form').addEventListener('reset', function () {
            PhoneBook.search("");
        });

    },

    startEdit: function (id) {
        var editContact = contacts.find(function (contact) {
            console.log(contact.firstName);
            return contact.id == id;
        });
        console.debug('startEdit', editContact);

        $("input[name=firstName]").val(editContact.firstName);
        $('input[name=lastName]').val(editContact.lastName);
        $('input[name=phone]').val(editContact.phone);
        editId = id;
        PhoneBook.editContact(id);
        PhoneBook.getContacts();

    },

    cancelEdit: function () {
        editId = '';
        document.querySelector('.add-form').reset();
        PhoneBook.getContacts();
    },

};

window.PhoneBookLocalActions = {
    load: (contacts) => {
        // save in persons as global variable
        window.contacts = contacts;
    },
    // ES6 functions (one param - no need pharanteses for arguments)
    add: contact => {
        contact.id = new Date().getTime();
        contacts.push(contact);
        PhoneBook.getContacts();
    },

    update: contact => {
        const id = contact.id;
        var contactToUpdate = contacts.find(contact => contact.id === id);
        contactToUpdate.firstName = contact.firstName;
        contactToUpdate.lastName = contact.lastName;
        contactToUpdate.phoneNumber = contact.phoneNumber;
        PhoneBook.getContacts();
    }
};

console.info('loading contacts');
PhoneBook.getContacts();
PhoneBook.bindEvents();
