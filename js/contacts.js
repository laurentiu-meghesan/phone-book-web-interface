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

    updateContact: function(id){

        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id=" + id,
            method: "PUT",
            contentType: "application/json",

        }).done(function () {
            PhoneBook.getContacts()
        })
    },

    getContactRow: function (contact) {

        return `<tr>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.phoneNumber}</td>
            <td><a href="#" data-id=${contact.id} class="delete-contact"><i class="fas fa-user-slash"></i></a></td>
        </tr>`
    },

    displayContacts: function (contacts) {
        var tableBody = '';

        contacts.forEach(contact => tableBody += PhoneBook.getContactRow(contact))

        $("#contacts-table tbody").html(tableBody);
    },

    bindEvents: function () {

        $("#new-contact-form").submit(function (event) {
            event.preventDefault();

            PhoneBook.createContact();
        });


        $("#contacts-table").delegate(".delete-contact", "click", function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");

            PhoneBook.deleteContact(contactId);
        })

    }
};

PhoneBook.getContacts();
PhoneBook.bindEvents();
