(function () {

    $(document).ready(function () {

        $('.item-delete').on('click', function (e) {
            var self = this;

            $.prompt('This user would be deleted. Are you sure?', {
                title: "Delete User",
                buttons: {
                    "Yes, Delete User": true,
                    "No, Lets Wait": false
                },
                overlayspeed: "fast",
                submit: function (e, v, m, f) {
                    // use e.preventDefault() to prevent closing when needed or return false. 
                    // e.preventDefault(); 
                    if (v) {
                        var id = $(self).attr('data-user');
                        $.ajax({
                            url: '/admin/user/deleteUser',
                            type: 'DELETE',
                            data: JSON.stringify({
                                user: id
                            }),
                            contentType: 'application/json',
                            success: function (status) {
                                if (status.deleted) {
                                    $(self).closest('.user-item').remove();
                                } else {
                                    $.prompt("Unable to Delete User. Try after some time :)");
                                }
                            }
                        });
                    }
                }
            });
        });

        $('.item-deactivate').on('click', function (e) {
            var self = this;

            $.prompt('This user would be deactivated. Are you sure?', {
                title: "Deactivate User",
                buttons: {
                    "Yes, Deactivate User": true,
                    "No, Lets Wait": false
                },
                overlayspeed: "fast",
                submit: function (e, v, m, f) {
                    // use e.preventDefault() to prevent closing when needed or return false. 
                    // e.preventDefault(); 
                    if (v) {
                        var id = $(self).attr('data-user');
                        $.ajax({
                            url: '/admin/user/changeStatus',
                            type: 'PUT',
                            data: JSON.stringify({
                                user: id,
                                isActive: false
                            }),
                            contentType: 'application/json',
                            success: function (status) {
                                if (status.hasChanged) {
                                    $(self).closest('.user-item').remove();
                                } else {
                                    $.prompt("Unable to Deactivate User. Try after some time :)");
                                }
                            }
                        });
                    }
                }
            });
        });

        $('.item-activate').on('click', function (e) {
            var self = this;

            $.prompt('This user would be activated. Are you sure?', {
                title: "Activate User",
                buttons: {
                    "Yes, Activate User": true,
                    "No, Lets Wait": false
                },
                overlayspeed: "fast",
                submit: function (e, v, m, f) {
                    // use e.preventDefault() to prevent closing when needed or return false. 
                    // e.preventDefault(); 
                    if (v) {
                        var id = $(self).attr('data-user');
                        $.ajax({
                            url: '/admin/user/changeStatus',
                            type: 'PUT',
                            data: JSON.stringify({
                                user: id,
                                isActive: true
                            }),
                            contentType: 'application/json',
                            success: function (status) {
                                if (status.hasChanged) {
                                    $(self).closest('.user-item').remove();
                                } else {
                                    $.prompt("Unable to Activate User. Try after some time :)");
                                }
                            }
                        });
                    }
                }
            });
        });

        $('.item-disown').on('click', function (e) {
            var self = this;

            $.prompt('This book will be removed from users owned list. Are you sure?', {
                title: "Disown Books",
                buttons: {
                    "Yes, Disown Book": true,
                    "No, Lets Wait": false
                },
                overlayspeed: "fast",
                submit: function (e, v, m, f) {
                    // use e.preventDefault() to prevent closing when needed or return false. 
                    // e.preventDefault(); 
                    if (v) {
                        var user = $(self).attr('data-user'),
                            book = $(self).attr('data-book');

                        $.ajax({
                            url: '/api/books/disown',
                            type: 'POST',
                            data: JSON.stringify({
                                user: user,
                                book: book
                            }),
                            contentType: 'application/json',
                            success: function (status) {
                                if (status) {
                                    $(self).closest('.book-item').remove();
                                } else {
                                    $.prompt("Unable to Disown the book. Try after some time :)");
                                }
                            }
                        });
                    }
                }
            });
        });
    });
})()