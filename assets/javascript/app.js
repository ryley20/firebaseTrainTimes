
    $(document).ready(function(){
        // <!-- The core Firebase JS SDK is always required and must be listed first -->
        src="https://www.gstatic.com/firebasejs/6.1.1/firebase-app.js"

        // <!-- TODO: Add SDKs for Firebase products that you want to use
          https://firebase.google.com/docs/web/setup#config-web-app -->

            // Your web app's Firebase configuration
            var firebaseConfig = {
            apiKey: "AIzaSyCEa2iJtfp9qNFZ9omiUANAU634AH4h4F8",
            authDomain: "myjuneapp.firebaseapp.com",
            databaseURL: "https://myjuneapp.firebaseio.com",
            projectId: "myjuneapp",
            storageBucket: "myjuneapp.appspot.com",
            messagingSenderId: "466450099713",
            appId: "1:466450099713:web:bcfbcc7392045425"
        };
    
        firebase.initializeApp(config);
    
        // A variable to reference the database.
        var database = firebase.database();
    
        // Variables for the onClick event
        var name;
        var destination;
        var firstTrain;
        var frequency = 0;
    
        $("#add-train").on("click", function() {
            event.preventDefault();
            // Storing and retreiving new train data
            name = $("#train-name").val().trim();
            destination = $("#destination").val().trim();
            firstTrain = $("#first-train").val().trim();
            frequency = $("#frequency").val().trim();
    
            // Pushing to database
            database.ref().push({
                name: name,
                destination: destination,
                firstTrain: firstTrain,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
            $("form")[0].reset();
        });
    
        database.ref().on("child_added", function(childSnapshot) {
            var nextArr;
            var minAway;
            // Change year so first train comes before now
            var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
            // Difference between the current and firstTrain
            var diffTime = moment().diff(moment(firstTrainNew), "minutes");
            var remainder = diffTime % childSnapshot.val().frequency;
            // Minutes until next train
            var minAway = childSnapshot.val().frequency - remainder;
            // Next train time
            var nextTrain = moment().add(minAway, "minutes");
            nextTrain = moment(nextTrain).format("hh:mm");
    
            $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                    "</td><td>" + childSnapshot.val().destination +
                    "</td><td>" + childSnapshot.val().frequency +
                    "</td><td>" + nextTrain + 
                    "</td><td>" + minAway + "</td></tr>");
    
                // fix errors
            }, function(errorObject) {
                console.log("Errors handled: " + errorObject.code);
        });
    
        database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
            // Change the HTML to show
            $("#train-name").html(snapshot.val().name);
            $("#destination").html(snapshot.val().destination);
            $("#first-train").html(snapshot.val().firstTrain);
            $("#frequency").html(snapshot.val().frequency);
        });
    });