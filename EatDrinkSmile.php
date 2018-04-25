<?php
    #uses database
    $link = mysqli_connect("0.0.0.0", "hemilpatel", "", "EatDrinkSmileDB");
    
    $restaurant = $_REQUEST['restaurant'];
    if($link){ //check if connection was established
        if($_GET) { #if so, if a GET perform these actions
            //pull comments
            $comments = mysqli_query($link, "SELECT * FROM TBL_Comments WHERE restaurantID = " . $restaurant);
                class comment {
                    var $firstName; 
                    var $lastInit; 
                    var $comment;
                }
                class rating {
                    var $rating;
                }
                
                $commentsArray = Array();
                /*
                go through each row in the returned array from the query
                and set the comment object up and append it to an array of comment objects
                */
                while ($row = mysqli_fetch_assoc($comments)) {
                    $comment = new comment;
                    $comment->firstName = $row["firstName"];
                    $comment->lastInit = $row["lastInit"];
                    $comment->comment = $row["restaurantComment"];
                    $commentsArray[] = $comment;
                }
                
                //pull the rating for that restaurant by getting all the ratings for the restaurant and averaging
                $ratings = mysqli_query($link, "SELECT AVG(restaurantRating) AS rating FROM TBL_Ratings WHERE restaurantID = " . $restaurant);
                while($row = mysqli_fetch_assoc($ratings)) {
                    $rating = new rating;
                    $rating->rating = $row["rating"];
                }
                
                class returnObject {
                    var $comments;
                    var $rating;
                }
                $returningObject = new returnObject;
                $returningObject->comments = $commentsArray;
                $returningObject->rating = $rating;
                
                $returningJSONObject = json_encode($returningObject);
                echo $returningJSONObject;
                
                mysqli_free_result($comments);
                mysqli_free_result($ratings);
                
        } else if ($_POST) { //else if a POST, perform these actions
            $restaurant = $_REQUEST['restaurant'];
            $rating = $_REQUEST['rating'];
            
            if($restaurant != "") {
                if($rating == 0 || $rating == "") {
                    $firstName = $_REQUEST['firstName'];
                    $lastInit = $_REQUEST['lastInit'];
                    $comment = $_REQUEST['comment'];
                    $insert = mysqli_query($link, "INSERT INTO TBL_Comments(restaurantID, restaurantComment, firstName, lastInit) VALUES ('" . $restaurant . "', '" . $comment . "', '" . $firstName .  "', '" . $lastInit . "')");
                } else if($rating >= 1 && $rating <=5) {
                    $rating = mysqli_query($link, "INSERT INTO TBL_Ratings(restaurantID, restaurantRating) VALUES ('" . $restaurant . "', '" . $rating . "')");
                }
            }
        }
        echo mysqli_error($link);
    }
    
    mysqli_close($link)
?>