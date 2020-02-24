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

        console.log(requestBody);

        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id=" + id,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(requestBody)

        }).done(function () {
            PhoneBook.getContacts();
            PhoneBook.cancelEdit();
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
        contacts.forEach(contact => tableBody += PhoneBook.getContactRow(contact));
        $("#contacts-table tbody").html(tableBody);
    },

    bindEvents: function () {

        var firstName, lastName, phoneNumber, id;

        $("#contacts-table").on("click", ".edit", function () {

            id = $(this).data('id');
            var currentRow = $(this).closest("tr");

            firstName = currentRow.find("td:eq(0)").text();
            lastName = currentRow.find("td:eq(1)").text();
            phoneNumber = currentRow.find("td:eq(2)").text();

            document.getElementById("firstName").value = firstName;
            document.getElementById("lastName").value = lastName;
            document.getElementById("phone").value = phoneNumber;

        });

        $("#save-button").click(function (event) {
            event.preventDefault();
            console.log("Edited contact nr." + id + " : " + firstName + " " + lastName + " " + phoneNumber);
            PhoneBook.editContact(id);
        });

        $("#new-contact-form").submit(function (event) {
            event.preventDefault();
            PhoneBook.createContact();
        });

        $("#search-delete").delegate(".delete-button", "click", function (event) {
            event.preventDefault();
            PhoneBook.deleteAllContacts();
        });

        $("#contacts-table").delegate(".delete-contact", "click", function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");
            PhoneBook.deleteContact(contactId);
        });

        $('#search').keyup(function () {

            let $rows = $('#contacts-table tbody tr');
            let val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

            $rows.show().filter(function () {
                var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                return !~text.indexOf(val);
            }).hide();
        });

    },

    cancelEdit: function () {
        document.querySelector('.add-form').reset();
        PhoneBook.getContacts();
    },

    cancelAdd: function () {
        document.querySelector('.new-contact-form').reset();
        PhoneBook.getContacts();
    }

};

console.info('loading contacts');
PhoneBook.getContacts();
PhoneBook.bindEvents();