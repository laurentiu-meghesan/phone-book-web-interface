window.PhoneBook = {

    API_BASE_URL: "http://localhost:8082/agenda",

    getContacts: function () {
        $.ajax({
            url:PhoneBook.API_BASE_URL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
        })
    },

    getContactRow:function (contact) {
        return `<tr>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.phoneNumber}</td>
            <td><a href="#" data-id=${contact.id} class="delete-contact"><button>Delete</button></a></td>

        </tr>`
    }

};

PhoneBook.getContacts();
