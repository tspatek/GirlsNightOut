var config = {
    apiKey: "AIzaSyAZVk8YI5PR8nfXyoSjvCbBTBB01_RhbTY",
    authDomain: "meetpie-3c64a.firebaseapp.com",
    databaseURL: "https://meetpie-3c64a.firebaseio.com",
    projectId: "meetpie-3c64a",
    storageBucket: "meetpie-3c64a.appspot.com",
    messagingSenderId: "941417946944"
};
firebase.initializeApp(config);

var database = firebase.database();

var displayName = "";
var email = "";
var address = "";
var city = "";
var state = "";
var zipcode = "";
var uid = "";
var userRef = "";

function chooseForm() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (user !== null) {
                displayName = firebase.auth().currentUser.displayName;
                email = firebase.auth().currentUser.email;
                uid = firebase.auth().currentUser.uid;

                database.ref("users/").once("value", function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (uid === childSnapshot.val().uid) {
                            console.log(uid);
                            console.log(childSnapshot.val().uid);
                            userRef = childSnapshot;

                            $("#user-info").append(`
                                <button type="submit" class="btn btn-primary" id="update-user">
                                    Update User
                                </button>
                            `);

                            $("#display-name").val(childSnapshot.val().displayName);
                            $("#email").val(childSnapshot.val().email);
                            $("#address").val(childSnapshot.val().address);
                            $("#city").val(childSnapshot.val().city);
                            $("#state").val(childSnapshot.val().state);
                            $("#zipcode").val(childSnapshot.val().zipcode);
                        }
                        else {
                            $("#user-info").append(`
                                <button type="submit" class="btn btn-primary" id="create-user">
                                    Create User
                                </button>
                            `);

                            $("#display-name").val(displayName);
                            $("#email").val(email);
                        }
                    })
                });
            }
        } else {
            console.log("Not logged in");
            window.location.replace("https://tspatek.github.io/Project-1/login.html");
        }
    }), function (error) {
        console.log(error);
    }
}

function createUser(event) {
    event.preventDefault();

    displayName = $("#display-name").val().trim();
    email = $("#email").val().trim();
    address = $("#address").val().trim();
    city = $("#city").val().trim();
    state = $("#state").val().trim();
    zipcode = $("#zipcode").val().trim();

    if (displayName === null) {
        console.log("All fields are required");
    } else if (email === null) {
        console.log("All fields are required");
    } else if (address === null) {
        console.log("All fields are required");
    } else if (city === null) {
        console.log("All fields are required");
    } else if (state === null) {
        console.log("All fields are required");
    } else if (zipcode === null) {
        console.log("All fields are required");
    }

    var user = {
        displayName: displayName,
        email: email,
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        uid: uid
    };

    userRef = database.ref("users/").push(user);
    window.location.replace("https://tspatek.github.io/Project-1/index.html");
}

function updateUser(event) {
    event.preventDefault();

    displayName = $("#display-name").val().trim();
    email = $("#email").val().trim();
    address = $("#address").val().trim();
    city = $("#city").val().trim();
    state = $("#state").val().trim();
    zipcode = $("#zipcode").val().trim();

    if (displayName === null) {
        console.log("All fields are required");
    } else if (address === null) {
        console.log("All fields are required");
    } else if (city === null) {
        console.log("All fields are required");
    } else if (state === "N/A") {
        console.log("All fields are required");
    } else if (zipcode === null) {
        console.log("All fields are required");
    } else {

        database.ref("users/" + userRef.key + "/location").update({
            displayName: displayName,
            email: email,
            address: address,
            city: city,
            state: state,
            zipcode: zipcode
        });
        window.location.replace("https://tspatek.github.io/Project-1/index.html");
    }
}

$(window).on("load", chooseForm);

$("div").on("click", "#create-user", createUser);

$("div").on("click", "#update-user", updateUser);

