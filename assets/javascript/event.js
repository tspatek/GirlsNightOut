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

var eventName = "";
var eventDate = "";
var eventTime = "";

var eventRef = "";
var isMember = false;

var userEmail = "";

function addEvent(event) {
    event.preventDefault();

    eventName = $("#event-name").val().trim();
    eventDate = $("#event-date").val().trim();
    eventTime = $("#event-time").val().trim();

    if (!moment(eventDate, "MM/DD/YY").isValid()) {
        console.log("Date must be in format MM/DD/YY");
    } else if (!moment(eventDate, "hh:mmA").isValid()) {
        console.log("Time must be in format hh:mmAM or hh:mmPM")
    } else {
        var event = {
            eventname: eventName,
            eventdate: eventDate,
            eventtime: eventTime
        };

        eventRef = database.ref("events/").push(event);

        changeForm();
    }
}

function changeForm() {
    $("#event-name").prop("readonly", "true");
    $("#event-name").prop("value", eventName);

    $("#event-date").prop("readonly", "true");
    $("#event-date").prop("value", eventDate);

    $("#event-time").prop("readonly", "true");
    $("#event-time").prop("value", eventTime);

    $("#create-event").detach();

    $("#event-form").append(`
        <div class="form-group">
            <label for="member-email">Enter Event Member Email</label>
            <input type="email" class="form-control" id="member-email">
        </div>
        <div class="form-group">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Display Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Remove</th>
                    </tr>
                 </thead>
                 <tbody id="event-members>
                 </tbody>
            </table>   
        </div>
        <button type="submit" class="btn btn-primary" id="add-member">Add Member</button>
        <a class="button btn btn-primary" href="badplaces.html">Done</a>
    `)
}

function addEventMember(event) {
    event.preventDefault();
    userEmail = $("#member-email").val().trim();

    database.ref("users/").once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            isMember = database.ref("events/" + eventRef.key + "users" + 
                                    childSnapshot.key.val());

            if (userEmail === childSnapshot.val().email) {
                if (!isMember) {
                    $("#event-members").append(`
                    <tr id="${childSnapshot.key}">
                        <td>${childSnapshot.val().displayName}</td>
                        <td>${childSnapshot.val().email}</td>
                        <td>
                            <button type="submit" class="btn btn-danger remove-member" 
                                data-key="${childSnapshot.key}">
                                    Remove Member
                            </button>
                    </tr>
                `);
                    database.ref("users/" + childSnapshot.key + "/events").update({
                        [eventRef.key]: true
                    });
                    database.ref("events/" + eventRef.key + "/users").update({
                        [childSnapshot.key]: true
                    });
                } else {
                    console.log("user is already a member of this event");
                }
                $("#member-email").val("");
            } else {
                console.log("user not found");
            }
        })
    });
}

function removeEventMember() {
    var removedMember = $(this).attr("data-key");
    $(`#${removedMember}`).detach();

    database.ref("users/" + removedMember + "/events").update({
        [eventRef.key]: false
    });
    database.ref("events/" + eventRef.key + "/users").update({
        [removedMember]: false
    });
}

$("#create-event").on("click", addEvent);

$("form").on("click", "#add-member", addEventMember);

$("table").on("click", ".remove-member", removeEventMember);

