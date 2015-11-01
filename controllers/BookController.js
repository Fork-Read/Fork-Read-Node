// var
//     express = require('express'),
//     mongoose = require("mongoose"),
//     async = require('async'),
//     UserModel = require('../models/UserModel'),
//     UserBookModel = require('../models/UserBookModel'),
//     BookModel = require('../models/BookModel');

// var BookController = {
//     getUserBooks: function (user, callback) {
//         var returnObj = [];

//         UserBookModel.find({
//             'user_id': user,
//             'isOwner': true
//         }, function (err, books) {
//             if (err) {
//                 return console.error(err);
//             }

//             if (books) {
//                 async.each(books,
//                     // 2nd param is the function that each item is passed to
//                     function (bookItem, next) {
//                         BookModel.findOne({
//                             '_id': bookItem.book_id
//                         }, function (err, book) {
//                             if (err) return console.error(err);

//                             if (book) {
//                                 returnObj.push(book);
//                                 next();
//                             }
//                         });
//                     },
//                     // 3rd param is the function to call when everything's done
//                     function (err) {
//                         // All tasks are done now
//                         callback(returnObj);
//                     }
//                 );
//             } else {
//                 callback(returnObj);
//             }
//         });
//     },
//     addToOwnList: function (user, books, elasticClient, callback) {

//         /*
//                 Expected Object Structure
//                 {
//                   "user": "5490787185864eb1119845f7",
//                   "books": [
//                     {
//                       "isbn": "123456",
//                       "title": "Lord of the Rings",
//                       "authors": [
//                         "J. R. R. Tolkien",
//                         "Prateek Agarwal"
//                       ],
//                       "genre": [
//                         "Fiction",
//                         "Thriller"
//                       ],
//                       "publishers": "My Publishing House",
//                       "publishedDate": "12-1-2014",
//                       "thumbnail": "http://www.google.com",
//                       "description":""
//                     },
//                     {
//                       "isbn": "1234567889",
//                       "title": "Game of Thrones",
//                       "authors": [
//                         "George R. R. Martin",
//                         "Prateek Agarwal"
//                       ],
//                       "genre": [
//                         "Fiction",
//                         "Thriller"
//                       ],
//                       "publishers": "My Publishing House",
//                       "publishedDate": "12-2-2014",
//                       "thumbnail": "http://www.gmail.com",
//                       "description":""
//                     }
//                   ]
//                 }
//             */

//         UserModel.findOne({
//             '_id': user
//         }, function (err, user) {
//             if (err) {
//                 return console.error(err);
//             }

//             if (user) {
//                 async.each(books,
//                     // 2nd param is the function that each item is passed to
//                     function (bookItem, next) {
//                         BookModel.findOne({
//                             'isbn': bookItem.isbn
//                         }, function (err, book) {
//                             if (err) return console.error(err);

//                             if (book) {
//                                 UserBookModel.findOne({
//                                     'user_id': user._id,
//                                     'book_id': book._id
//                                 }, function (err, userBook) {
//                                     if (err) return console.error(err);

//                                     if (userBook) {
//                                         next();
//                                     } else {
//                                         var newUserBook = new UserBookModel({
//                                             user_id: user._id,
//                                             book_id: book._id,
//                                             isOwner: true,
//                                             isLiked: false,
//                                             isWished: false
//                                         });

//                                         newUserBook.save(function (err, newUserBook) {
//                                             if (err) return console.error(err);
//                                             next();
//                                         });
//                                     }
//                                 });
//                             } else {
//                                 var newBook = new BookModel({
//                                     isbn: bookItem.isbn,
//                                     title: bookItem.title,
//                                     authors: bookItem.authors,
//                                     genre: bookItem.genre,
//                                     publishers: bookItem.publishers,
//                                     publishedDate: bookItem.publishedDate,
//                                     thumbnail: bookItem.thumbnail,
//                                     description: bookItem.description
//                                 });

//                                 newBook.save(function (err, newBook) {
//                                     if (err) return console.error(err);

//                                     // Index Book Details
//                                     elasticClient.index({
//                                         index: 'forkread',
//                                         type: 'books',
//                                         id: newBook._id + '',
//                                         body: {
//                                             _id: newBook._id,
//                                             isbn: newBook.isbn,
//                                             title: newBook.title,
//                                             authors: newBook.authors,
//                                             genre: newBook.genre,
//                                             publishers: newBook.publishers,
//                                             publishedDate: newBook.publishedDate,
//                                             thumbnail: newBook.thumbnail,
//                                             description: newBook.description
//                                         }
//                                     }, function (err, resp) {
//                                         UserBookModel.findOne({
//                                             'user_id': user._id,
//                                             'book_id': newBook._id
//                                         }, function (err, userBook) {
//                                             if (err) return console.error(err);

//                                             if (userBook) {
//                                                 next();
//                                             } else {
//                                                 var newUserBook = new UserBookModel({
//                                                     user_id: user._id,
//                                                     book_id: newBook._id,
//                                                     isOwner: true,
//                                                     isLiked: false,
//                                                     isWished: false
//                                                 });

//                                                 newUserBook.save(function (err, newUserBook) {
//                                                     if (err) return console.error(err);
//                                                     next();
//                                                 });
//                                             }
//                                         });
//                                     });
//                                 });
//                             }
//                         });
//                     },
//                     // 3rd param is the function to call when everything's done
//                     function (err) {
//                         // All tasks are done now
//                         callback({});
//                     }
//                 );
//             } else {
//                 callback({});
//             }
//         });
//     },
//     search: function (user, filter, radius, search_location, elasticClient, callback) {
//         /* Search Requst Structure
//     {
//       "user": "54db950b3d7415b4183262f5",
//       "radius": 5,
//       "book_filter": {
//         "type": "isbn",
//         "value": "123456"
//       },
//       "search_location": {
//         "position": {
//           "latitude": "12.940882",
//           "longitude": "77.6292825"
//         },
//         "address": {
//           "location": "jhgfvjdsf",
//           "street": "isfjskdf",
//           "city": "Bangalore",
//           "state": "Karnataka",
//           "country": "India",
//           "zipcode": "560029",
//           "formatted_address": "kjdfbdbnfbdfng"
//         }
//       }
//     }*/

//         var searchedLocation;

//         if (search_location) {
//             searchedLocation = search_location;
//         }

//         var searchedFilter = {},
//             searchResult = {
//                 results: []
//             };

//         searchedFilter[filter.type] = filter.value;

//         switch (filter.type) {
//         case 'title':
//             searchedFilter = {
//                 title: filter.value
//             };
//             break;
//         case 'isbn':
//             searchedFilter = {
//                 'isbn': filter.value
//             };
//             break;
//         case 'genre':
//             searchedFilter = {
//                 genre: filter.value
//             };
//             break;
//         case 'author':
//             searchedFilter = {
//                 'authors': filter.value
//             };
//             break;
//         default:
//             searchedFilter = {
//                 title: filter.value
//             };
//             break;
//         }

//         elasticClient.search({
//             index: 'forkread',
//             type: 'books',
//             size: 50,
//             body: {
//                 query: {
//                     match: searchedFilter
//                 }
//             }
//         }).then(function (resp) {

//             var books = resp.hits.hits;

//             if (!books.length) {
//                 // Send searchResult as empty array
//                 res.set('Content-Type', 'application/json');
//                 res.send(JSON.stringify(searchResult));
//                 return;
//             }

//             async.each(books,
//                 // 2nd param is the function that each item is passed to
//                 function (bookItem, next) {

//                     // Reset Item for every new book
//                     var searchResultItem = {};
//                     bookItem = bookItem._source;

//                     searchResultItem['book'] = bookItem;
//                     searchResultItem['owners'] = [];

//                     UserBookModel.find({
//                         book_id: bookItem._id
//                     }, function (err, userBooks) {
//                         if (err) return console.error(err);

//                         async.each(userBooks, function (userBookItem, iterate) {
//                             // Skip the user who made the search
//                             if (userBookItem.user_id === user) {
//                                 iterate();
//                             } else {
//                                 UserModel.findOne({
//                                     '_id': userBookItem.user_id,
//                                     'homeLocation.address.city': searchedLocation.address.city,
//                                     'homeLocation.address.state': searchedLocation.address.state,
//                                     'homeLocation.address.country': searchedLocation.address.country,
//                                 }, function (err, userItem) {
//                                     if (err) return console.error(err);
//                                     var dist = getDistance(userItem.homeLocation.position.latitude, userItem.homeLocation.position.longitude, searchedLocation.position.latitude, searchedLocation.position.longitude);
//                                     if (dist < parseFloat(radius)) {
//                                         searchResultItem.owners.push(userItem);
//                                         iterate();
//                                     }
//                                 });
//                             }
//                         }, function (err) {
//                             searchResult.results.push(searchResultItem);
//                             next();
//                         });
//                     })
//                 },
//                 // 3rd param is the function to call when everything's done
//                 function (err) {
//                     if (err) return console.error(err);
//                     // All tasks are done now. Send the searchResult Object
//                     callback(searchResult);
//                 }
//             );
//         }, function (error) {
//             console.trace(error.message);
//         });
//     }
// }

// // Calculates Distance in Km
// function getDistance(lat1, lon1, lat2, lon2) {
//     var radlat1 = Math.PI * lat1 / 180
//     var radlat2 = Math.PI * lat2 / 180
//     var radlon1 = Math.PI * lon1 / 180
//     var radlon2 = Math.PI * lon2 / 180
//     var theta = lon1 - lon2
//     var radtheta = Math.PI * theta / 180
//     var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//     dist = Math.acos(dist)
//     dist = dist * 180 / Math.PI
//     dist = dist * 60 * 1.1515
//     dist = dist * 1.609344
//     return dist
// }

// module.exports = BookController;