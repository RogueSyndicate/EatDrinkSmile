var restaurants = [
    ["Sophie's Bistro", 40.491497, -74.472267 , 0],
    ["Old Man Rafferty's", 40.496649, -74.443847 , 1],
    ["Veganized", 40.495796, -74.445219 , 2],
    ["Clydz", 40.495390, -74.445400 , 3],
    ["Due Mari", 40.496808, -74.442487 , 4],
    ["Steakhouse 85", 40.496582, -74.443330 , 5],
    ["Stuff Yer Face", 40.498314, -74.448948 , 6],
    ["KBG Korean BBQ and Grill", 40.497027, -74.447115 , 7],
    ["The Frog and The Peach", 40.495265, -74.440923 , 8],
    ["Harvest Moon Brewery", 40.496235, 74.444299 , 9]
    ];

var map;
  function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.49903, lng: -74.45186},
            zoom: 15
        });
    }
    
    function setOneMarker(map, restaurantSelected, restaurantName, restaurantAddress) {
        for(var i = 0; i < restaurants.length; i++) {
            var restaurant = restaurants[i];
            if(restaurant[3] == restaurantSelected) {
                var contentString = '<div id = "markerRestaurantName">' + restaurantName + '</div>' + '<div id = "markerAddress">' + restaurantAddress + '</div>';
                
                var infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    maxWidth: 200
                });
                
                var marker = new google.maps.Marker({
                    position: {lat: restaurant[1], lng: restaurant[2]},
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: restaurant[0],
                    zIndez: restaurant[3]
                });
                
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
                break;
            }
        }
    }

$(document).ready(function() {
    /*
    - Get Google Maps API working
    */
    
    $('#restaurantRating').empty();
    
    var allowAjaxHide = false;
    $('#ajaxIndicator').on('hide.bs.modal', function(event) {
        if (!allowAjaxHide) {
            event.preventDefault(); 
            allowAjaxHide = false;
        }
    });
    
    //Twitter API, Tweet Retrieval based on '%23EatDrinkSmile' OR '#EatDrinkSmile'
    $.ajax({
        url: '/api/index.php/TwitterAppOnly/search/tweets.json',
        type: 'GET',
        dataType: 'JSON',
        data: {
            q: "%23EatDrinkSmile",
        },
        success: function(serverResponse) {
            try {
                console.log(serverResponse);
                var statuses = serverResponse.statuses;
                console.log(statuses);
                
                /*
                Initialize the myHTML string to append each list object to,
                and then append the final string of HTML list object to the #twitterFeed css selector
                */
                var myHTML = '';
                for(var i = 0; i < statuses.length; i++){
                    myHTML += '<li class="tweet list-group-item">';
                    myHTML += '<span class="profilePicture"> <img src="' + statuses[i].user.profile_image_url + '"></span>';
                    myHTML += '<span class="user">' + statuses[i].user.screen_name + '</span>';
                    myHTML += '- <span class="body">' + statuses[i].text + '</span>';
                    myHTML += '<span class="badge retweets">' + statuses[i].retweet_count + '</span>';
                    myHTML += '<span class="badge favorites">' + statuses[i].favorite_count + '</span>';
                    myHTML += '</li>';
                }
                $('#twitterFeed').append(myHTML);
            }
            catch (ex) {
                console.error(ex);
                console.log("An error occurred processing the data from Twitter");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (errorThrown == 'Service Unavailable') {
                console.log("Your cloud 9 instance isn't running!");
            }
            else {
                console.log('An unknown error occurred: ' + errorThrown);
            }
        },
        complete: function() {
            console.log("LOG: Tweet Retrieval complete.")
        }
    });
    
    /*
    line 116: setup instagram connection
    */
    $.ajax({
        url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=ACCESS-TOKEN',
        type: 'GET',
        dataType: 'JSONP',
        data: {
            ACCESS_TOKEN: "209369514.1677ed0.f8139a25ddfc4d129495d659c9769beb",
            q: 'EatDrinkSmile'
        },
        success: function(serverResponse) {
            try {
                console.log(serverResponse);
                var posts = serverResponse.data;
                console.log(posts);
                
                var myHTML = "";
                for(var i = 0; i < posts.length; i++) {
                    myHTML += '<li class = "post list-group-item">';
                    myHTML += '<span class = "profilePicture"> <img src="' + posts[i].profile_picture + '"></span>';
                    myHTML += '<span class = "user">' + posts[i].username + '</span>';
                    myHTML += '<div class = "image"> <img src="' + posts[i].images.low_resolution.url + '"></span>';
                    myHTML += '<div class = "caption">' + posts[i].caption.text + '</div>';
                    myHTML += '<span class = "badge likes">' + posts[i].likes.count + '</span>';
                    myHTML += '</li>';
                }
                $('#instaFeed').append(myHTML);
            }
            catch (ex) {
                console.error(ex);
                console.log("An error occurred processing the data from Twitter");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('An unknown error occurred: ' + errorThrown);
        },
        complete: function() {
            console.log("LOG: Insta Retrieval complete.")
        }
    })
      
    $('#restaurantSelected').change(function(event) {
        $('#restaurantRating').empty();
        $('#errorSection').empty();
        $('#errorSectionRating').empty();
        $('#restaurantInformation').empty();
        $('#hoursOfOperation').empty();
        $('#commentsSectionList').empty();
        $('#successSection').empty();
        $('#successSectionRating').empty();
        
        
        
        var myHTMLInformation = "";
        var myHTMLHours = "";
        var error = false;
        
        switch (true) {
            case ($('#restaurantSelected').val() == ""):
                initMap();
                myHTMLInformation = "";
                break;
            case ($('#restaurantSelected').val() == "0"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "Sophie's Bistro", "700 Hamilton St, Somerset, NJ 08873");
                myHTMLInformation += '<div class = "description">Bistro offering French comfort foods in a country antiques-adorned space with outdoor seating.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 545-7778</div>';
                myHTMLHours += '<li class = "closedDay">Monday: CLOSED</li>';
                myHTMLHours += '<li>Tuesday 11:30AM–3PM, 5–9:30PM</li>';
                myHTMLHours += '<li>Wednesday 11:30AM–3PM, 5–9:30PM</li>';
                myHTMLHours += '<li>Thursday 11:30AM–3PM, 5–9:30PM</li>';
                myHTMLHours += '<li>Friday 11:30AM–3PM, 5–10:30PM</li>';
                myHTMLHours += '<li>Saturday 5–10:30PM</li>';
                myHTMLHours += '<li>Sunday 4–9PM</li>';
                break;
            case ($('#restaurantSelected').val() == "1"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "Old Man Rafferty's", "106 Albany St, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">Family-friendly American restaurant with big menu of hearty fare, outdoor seating & pub-type feel.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 846-6153</div>';
                myHTMLHours += '<li>Monday 11:30AM–11PM</li>';
                myHTMLHours += '<li>Tuesday 11:30AM–11PM</li>';
                myHTMLHours += '<li>Wednesday 11:30AM–11PM</li>';
                myHTMLHours += '<li>Thursday 11:30AM–11PM</li>';
                myHTMLHours += '<li>Friday 11:30AM–11PM</li>';
                myHTMLHours += '<li>Saturday 11AM–11PM</li>';
                myHTMLHours += '<li>Sunday 11AM–11PM</li>';
                break;
            case ($('#restaurantSelected').val() == "2"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "Veganized", "9 Spring St, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">Low-key joint dispensing casual vegan grub, including pasta, wraps & salads, plus weekend brunch.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 342-7412</div>';
                myHTMLHours += '<li>Monday 11AM–9:30PM</li>';
                myHTMLHours += '<li>Tuesday 11AM–9:30PM</li>';
                myHTMLHours += '<li>Wednesday 11AM–9:30PM</li>';
                myHTMLHours += '<li>Thursday 11AM–9:30PM</li>';
                myHTMLHours += '<li>Friday 11AM–9:30PM</li>';
                myHTMLHours += '<li>Saturday 11AM–9:30PM</li>';
                myHTMLHours += '<li>Sunday 11AM–9:30PM</li>';
                break;
            case ($('#restaurantSelected').val() == "3"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "Clydz", "55 Paterson St, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">Underground restaurant with American fare including exotic meats plus notable martinis & a busy bar.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 846-6521</div>';
                myHTMLHours += '<li>Monday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Tuesday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Wednesday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Thursday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Friday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Saturday 4PM–2AM</li>';
                myHTMLHours += '<li>Sunday 7PM–2AM</li>';
                break;
            case ($('#restaurantSelected').val() == "4"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "Due Mari", "78 Albany St, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">Elegant Italian dining spot with consulting chef Michael Whites seafood & housemade pasta dishes.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 296-1600</div>';
                myHTMLHours += '<li>Monday 11:30AM–9PM</li>';
                myHTMLHours += '<li>Tuesday 11:30AM–9PM</li>';
                myHTMLHours += '<li>Wednesday 11:30AM–9PM</li>';
                myHTMLHours += '<li>Thursday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Friday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Saturday 11AM–10:30PM</li>';
                myHTMLHours += '<li>Sunday 11AM–9PM</li>';
                break;
            case ($('#restaurantSelected').val() == "5"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "Steakhouse 85", "85 Church St, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">Steakhouse with a surf and turf menu in an upscale space with live jazz on some nights.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 247-8585</div>';
                myHTMLHours += '<li>Monday 11:30AM–9PM</li>';
                myHTMLHours += '<li>Tuesday 11:30AM–9PM</li>';
                myHTMLHours += '<li>Wednesday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Thursday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Friday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Saturday 5–10PM</li>';
                myHTMLHours += '<li>Sunday 4–9PM</li>';
                break;
            case ($('#restaurantSelected').val() == "6"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "Stuff Yer Face", "49 Easton Ave, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">Bi-level spot with stromboli sandwiches & loads of international beer, plus burgers, pizza & more.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 247-1727</div>';
                myHTMLHours += '<li>Monday 11AM–2AM</li>';
                myHTMLHours += '<li>Tuesday 11AM–2AM</li>';
                myHTMLHours += '<li>Wednesday 11AM–2AM</li>';
                myHTMLHours += '<li>Thursday 11AM–2AM</li>';
                myHTMLHours += '<li>Friday 11AM–2AM</li>';
                myHTMLHours += '<li>Saturday 11AM–2AM</li>';
                myHTMLHours += '<li>Sunday 11AM–2AM</li>';
                break;
            case ($('#restaurantSelected').val() == "7"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "KBG Korean BBQ and Grill", "6 Easton Ave, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">A low-key counter-serve joint specializing in create-your-own Korean tacos, burritos & rice bowls.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 626-5406</div>';
                myHTMLHours += '<li>Monday 12–10PM</li>';
                myHTMLHours += '<li>Tuesday 12–10PM</li>';
                myHTMLHours += '<li>Wednesday 12–10PM</li>';
                myHTMLHours += '<li>Thursday 12–10PM</li>';
                myHTMLHours += '<li>Friday 12–10PM</li>';
                myHTMLHours += '<li>Saturday 12–10PM</li>';
                myHTMLHours += '<li>Sunday 12–10PM</li>';
                break;
            case ($('#restaurantSelected').val() == "8"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "The Frog and The Peach", "29 Dennis St, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">Gourmet American restaurant offering creative seasonal cuisine, fine wines & a coveted garden room.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 846-3216</div>';
                myHTMLHours += '<li>Monday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Tuesday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Wednesday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Thursday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Friday 11:30AM–10PM</li>';
                myHTMLHours += '<li>Saturday 5–10PM</li>';
                myHTMLHours += '<li>Sunday 4:30–9PM</li>';
                break;
            case ($('#restaurantSelected').val() == "9"):
                initMap();
                setOneMarker(map, $('#restaurantSelected').val(), "Harvest Moon Brewery", "392 George St, New Brunswick, NJ 08901");
                myHTMLInformation += '<div class = "description">Relaxed place with exposed-brick walls serving an eclectic pub menu alongside house-brewed beers.</div>';
                myHTMLInformation += '<div class = "phone">Phone: (732) 249-6666</div>';
                myHTMLHours += '<li>Monday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Tuesday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Wednesday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Thursday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Friday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Saturday 11:30AM–2AM</li>';
                myHTMLHours += '<li>Sunday 11:30AM–2AM</li>';
                break;
            default:
                break;
        }
        $('#restaurantInformation').append(myHTMLInformation);
        $('#hoursOfOperation').append(myHTMLHours);
        
        if($('#restaurantSelected').val() == "") {
            error = true;
        }
        
        if(error) {
            return false;
        }
        
        $.ajax({
            url: 'EatDrinkSmile.php',
            type: 'GET',
            dataType: 'JSON',
            data: {
                restaurant: $('#restaurantSelected').val()
            },
            success: function(serverResponse) {
                console.log(serverResponse);
                var comments = serverResponse.comments;
                console.log(comments);
                
                var myHTML = "";
                if($('#restaurantSelected').val() == "") {
                    myHTML = '';
                }
                else if(comments.length == 0) {
                    myHTML += '<div>No comments for this restaurant. Post one!'
                } else {
                    for(var i = 0; i < comments.length; i++) {
                        myHTML += '<li class = "comment list-group-item">';
                        myHTML += '<div class = "commentNames">' + comments[i].firstName + " " + comments[i].lastInit + '</div>';
                        myHTML += '<div class = "commentBody">' + comments[i].comment + '</div>';
                        myHTML += '</li>';
                    }
                }
                $('#commentsSectionList').append(myHTML);
                
                var myHTMLRating = "";
                var ratingRoundedToTenth = parseFloat(serverResponse.rating.rating).toFixed(1);
                myHTMLRating += '<h3>Restaurant\'s Rating:</h3>';
                switch (true) {
                    case (ratingRoundedToTenth <= 1.9):
                        myHTMLRating += '<span class = "currentRestaurantRating" id = "badRating">' + ratingRoundedToTenth + '</span>';
                        break;
                    case (ratingRoundedToTenth <= 2.9 && ratingRoundedToTenth > 1.9):
                        myHTMLRating += '<span class = "currentRestaurantRating" id = "poorRating">' + ratingRoundedToTenth + '</span>';
                        break;
                    case (ratingRoundedToTenth <=3.9 && ratingRoundedToTenth > 2.9):
                        myHTMLRating += '<span class = "currentRestaurantRating" id = "okayRating">' + ratingRoundedToTenth + '</span>';
                        break;
                    case (ratingRoundedToTenth <= 4.4 && ratingRoundedToTenth > 3.9):
                        myHTMLRating += '<span class = "currentRestaurantRating" id = "goodRating">' + ratingRoundedToTenth + '</span>';
                        break;
                    case (ratingRoundedToTenth > 4.5):
                        myHTMLRating += '<span class = "currentRestaurantRating" id = "greatRating">' + ratingRoundedToTenth + '</span>';
                        break;
                    default:
                        myHTMLRating += '<span class = "currentRestaurantRating" id = "NARating">N/A</span>';
                        break;
                    
                }
                myHTMLRating += '<span class = "currentRestaurantRating">/5</span>';
                $('#restaurantRating').append(myHTMLRating);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#errorSection').append('<p>' + errorThrown + '</p>');
            },
            complete: function(){
                console.log("LOG: Restaurant Retrieval Complete.");
            }
        });
    });
    
    $('#firstName').focusout(function (event) {
        $('#errorSection').empty();
        
        var firstName = $('#firstName').val();
        var lastInit = $('#lastInit').val();
        var comment = $('#commentBody').val();
        
        var namePattern = /^([A-Z]|[a-z]){1}[a-z]{0,19}?$/; 
        var initPattern = /^[A-Za-z][\.]?$/;
        var error = false;
        
        if(firstName != "" || lastInit != "" || comment != "") {
            if(!namePattern.test(firstName)) {
                $('#errorSection').append('<p>First name must start with capital letter/at most 19 characters</p>');
                error = true;
            }
            if(!initPattern.test(lastInit)) {
                $('#errorSection').append('<p>Last initial must be only 1 character (\'.\' optional)</p>');
                error = true;
            }
            if(comment.length <= 0) {
                $('#errorSection').append('<p>Comment must contain at least 1 character</p>');
                error = true;
            } else if (comment.length > 500) {
                $('#errorSection').append('<p>Comment must be under 500 characters</p>');
                error = true;
            }
        }
        if(error) {
            return false;
        }
    });
    
    $('#lastInit').focusout(function (event) {
        $('#errorSection').empty();
        
        var firstName = $('#firstName').val();
        var lastInit = $('#lastInit').val();
        var comment = $('#commentBody').val(); 
        
        var namePattern = /^([A-Z]|[a-z]){1}[a-z]{0,19}?$/; 
        var initPattern = /^[A-Za-z][\.]?$/;
        var error = false;
        
        if(firstName != "" || lastInit != "" || comment != "") {
            if(!namePattern.test(firstName)) {
                $('#errorSection').append('<p>First name must start with capital letter/at most 19 characters</p>');
                error = true;
            }
            if(!initPattern.test(lastInit)) {
                $('#errorSection').append('<p>Last initial must be only 1 character (\'.\' optional)</p>');
                error = true;
            }
            if(comment.length <= 0) {
                $('#errorSection').append('<p>Comment must contain at least 1 character</p>');
                error = true;
            } else if (comment.length > 500) {
                $('#errorSection').append('<p>Comment must be under 500 characters</p>');
                error = true;
            }
        }
        if(error) {
            return false;
        }
        
    });
    
    $('#commentBody').focusout(function (event) {
        $('#errorSection').empty();
        
        var firstName = $('#firstName').val();
        var lastInit = $('#lastInit').val();
        var comment = $('#commentBody').val();
        
        var namePattern = /^([A-Z]|[a-z]){1}[a-z]{0,19}?$/;
        var initPattern = /^[A-Za-z][\.]?$/;
        var error = false;
        
        if(firstName != "" || lastInit != "" || comment != "") {
            if(!namePattern.test(firstName)) {
                $('#errorSection').append('<p>First name must start with capital letter/at most 19 characters</p>');
                error = true;
            }
            if(!initPattern.test(lastInit)) {
                $('#errorSection').append('<p>Last initial must be only 1 character (\'.\' optional)</p>');
                error = true;
            }
            if(comment.length <= 0) {
                $('#errorSection').append('<p>Comment must contain at least 1 character</p>');
                error = true;
            } else if (comment.length > 500) {
                $('#errorSection').append('<p>Comment must be under 500 characters</p>');
                error = true;
            }
        }
        if(error) {
            return false;
        }
    });
    
    var ratingToSubmit;
    $('.ratingC').click(function (event){
        ratingToSubmit = $('input[name="rating"]:checked').val();
    });
    
    $('#ratingSelected').submit(function (event) {
        $('#errorSectionRating').empty();
        $('#successSectionRating').empty();
        event.preventDefault();
        
        var error = false;
        
        if($('#restaurantSelected').val() == "") {
            $('#errorSectionRating').append('<p>Restaurant Not Selected</p>');
            error = true;
        }
        
        if(ratingToSubmit == null || ratingToSubmit == "") {
            $('#errorSectionRating').append('<p>No Rating Selected</p>')
            error = true;
        }
        
        if(error) {
            return false;
        }
        
        $.ajax({
            url: 'EatDrinkSmile.php',
            type: 'POST',
            dataType: 'HTML',
            data: {
                restaurant: $('#restaurantSelected').val(),
                rating: ratingToSubmit
            },
            success: function(serverResponse) {
                console.log(serverResponse);
                $('#successSectionRating').append('<p>Rating Submitted!</p>')
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#errorSectionRating').append('<p>' + errorThrown + '</p>');
            },
            complete: function() {
                console.log("LOG: Restaurant Rating Complete.");
            }
        });
    });
    
    $('#commentSubmit').submit(function (event) {
        event.preventDefault();
        $('#successSection').empty();
        $('#errorSection').empty();
        
        var firstName = $('#firstName').val();
        var lastInit = $('#lastInit').val();
        var comment = $('#commentBody').val();
        
        var namePattern = /^([A-Z]|[a-z]){1}[a-z]{0,19}?$/;
        var initPattern = /^[A-Za-z][\.]?$/;
        var error = false;
        
        if ($('#restaurantSelected').val() == "") {
            $('#errorSection').append('<p>No restaurant selected. Please select a restaurant before submitting your comment.')
            error = true;
        } else if ($('#restaurantSelected').val() != "") {
            error = false;
        }
        if(!namePattern.test(firstName)) {
            $('#errorSection').append('<p>First name must start with capital letter/at most 19 characters</p>');
            error = true;
        }
        if(!initPattern.test(lastInit)) {
            $('#errorSection').append('<p>Last initial must be only 1 character (\'.\' optional)</p>');
            error = true;
        }
        if(comment.length <= 0) {
            $('#errorSection').append('<p>Comment must contain at least 1 character</p>');
            error = true;
        } else if (comment.length > 500) {
            $('#errorSection').append('<p>Comment must be under 500 characters</p>');
            error = true;
        }
        
        if(error) {
            return false;
        }
        
        $.ajax({
            url: 'EatDrinkSmile.php',
            type: 'POST',
            dataType: 'HTML',
            data: {
                restaurant: $('#restaurantSelected').val(),
                firstName: firstName,
                lastInit: lastInit,
                comment: comment,
                rating: 0
            },
            success: function(serverResponse) {
                console.log(serverResponse);
                if(error != true) {
                    $('#successSection').append('<p>Comment Submitted! (Reload page to see)</p>');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#errorSection').append('<p>' + errorThrown + '</p>');
            },
            complete: function() {
                console.log("LOG: Comment Submission Complete.");
            }
        });
    });
    
});