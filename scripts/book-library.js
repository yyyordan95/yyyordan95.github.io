function startApp() {
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_r11QOPsMd";
    const kinveyAppSecret = "5a8c8675b64b4834a0ed70e7f7f85114";
    const kinveyAppAuthHeaders = {
        "Authorization": "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret)
    };

    sessionStorage.clear();
    showHideMenuLinks();
    showView('viewHome');

    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);

    $('#buttonLoginUser').click(loginUser);
    $('#buttonRegisterUser').click(registerUser);

    // TODO
    $('#linkListBooks').click(listBooks);
    $('#linkCreateBook').click(showCreateBookView);
    $('#linkLogout').click(logoutUser);



    $('#buttonCreateBook').click(createBook);
    $('#buttonEditBook').click(editBook);

    function showHideMenuLinks() {
        $('#linkHome').show();

        if (sessionStorage.getItem('authToken')) {
            $('#linkLogin').hide();
            $('#linkRegister').hide();

            $('#linkListBooks').show();
            $('#linkCreateBook').show();
            $('#linkLogout').show();
        } else {
            $('#linkLogin').show();
            $('#linkRegister').show();

            $('#linkListBooks').hide();
            $('#linkCreateBook').hide();
            $('#linkLogout').hide();
        }
    }

    function showView(viewName) {
        $('main > section').hide();
        $('#' + viewName).show();
    }

    function showHomeView() {
        showView('viewHome');
    }

    function showLoginView() {
        showView('viewLogin');
        $('#formLogin').trigger('reset');
    }

    function showRegisterView() {
        showView('viewRegister');
        $('#formRegister').trigger('reset');
    }

    function showCreateBookView() {
        // todo
    }

    function loginUser() {
        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val(),
        };

        console.log({
            userData
        });

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: loginSuccess,
            error: handleAjaxError
        });

        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('Login successful!');
        }
    }

    function registerUser() {
        // todo
    }

    function saveAuthInSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        console.log({
            userAuth
        });
        sessionStorage.setItem('authToken', userAuth);

        let userId = userInfo._id;
        console.log({
            userId
        });
        sessionStorage.setItem('userId', userId);

        let userName = userInfo.username;
        $('#loggedInUser').text("Welcome, " + userName);
    }

    function handleAjaxError(response) {
        alert("An error with the http request has occured!");
    }

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(errorMsg) {
        // todo
    }

    function logoutUser() {
        // todo
    }

    function listBooks() {
        $('#books').empty();
        showView('viewBooks');

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
            headers: getKinveyUserAuthHeaders(),
            success: loadBooksSuccess,
            error: handleAjaxError
        });

        function loadBooksSuccess(books) {
            if (books.length == 0) {
                $('#books').text("No books in the library.")
            } else {
                alert("books: " + books.length);

                let booksTable = $('<table>')
                .append($('<tr>').append('<th>Title</th><th>Author</th><th>Description</th><th>Actions</th>'));

                for(let book of books){
                    appendBookRow(book, booksTable);
                }

                $('#books').append(booksTable);
            }

            function appendBookRow(book, booksTable) {
                booksTable
                .append(
                    $('<tr>')
                    .append(
                        $('<td>').text(book.title),
                        $('<td>').text(book.author),
                        $('<td>').text(book.description),
                        $('<td>').text('links')));
            }
        }
    }

    function getKinveyUserAuthHeaders() {
        return {
            "Authorization": "Kinvey " + sessionStorage.getItem('authToken')
        };
    }

    function createBook() {
        // todo
    }

    function loadBookForEdit(book) {
        // todo
    }

    function editBook() {
        // todo
    }

    function deleteBook(book) {
        // todo
    }
}