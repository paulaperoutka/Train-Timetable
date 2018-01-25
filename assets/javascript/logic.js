const config = {
    apiKey: "AIzaSyDSBuaDZP7vTh--Jhztw6-rGWwIzX4ZXP4",
    authDomain: "train-timetable-78d37.firebaseapp.com",
    databaseURL: "https://train-timetable-78d37.firebaseio.com",
    projectId: "train-timetable-78d37",
    storageBucket: "train-timetable-78d37.appspot.com",
    messagingSenderId: "4449466252"
  };

firebase.initializeApp(config);

// var trainName = "";
// var destination = "";
// var frequency = "";
// var nextArrival = "";
// var minutesAway = "";

const dbRef = firebase.database().ref("timetable/trains");

$("#add-train-btn").on("click", function (event) {
	event.preventDefault();

	const newTrain = {
    name: $("#train-name-input").val().trim(),
    destination: $("#destination-input").val().trim(),
    first: moment($("#first-train-input").val().trim(), "HH:mm").format("HH:mm"),
        // first: moment($("#first-train-input").val().trim(), "HH:mm:ss").format("X"),
    frequency: $("#frequency-input").val().trim()
  };

  console.log(newTrain.name, ", new train name");
  console.log(newTrain.destination, ", new train destination");
  console.log(newTrain.first, ", new train first train");
  console.log(newTrain.frequency, ", new train frequency");

  dbRef.push(newTrain);

  resetInputs();

  return newTrain;

});

console.log(newTrain, ", newTrain object");

dbRef.on("child_added", function(childSnapshot, prevChildKey) {

  // Employee Info
  const newTrain = childSnapshot.val();
  console.log(newTrain);
  
  // Calculate the next arrival using hardcore math
  newTrain.nextArrival = moment("HH:mm").diff(moment(newTrain.first, "HH:mm"), "nextArrival");
  console.log(newTrain.nextArrival);

  newTrain.nextArrival = moment.unix(newTrain.nextArrival).format("HH:mm")
  
  // // Prettify the employee start (after using it to calculate months...)
  // newEmp.start = moment.unix(newEmp.start).format("MM/DD/YY");

  // (now-firsttrain)/frequency=x | x
  // newTrain.minutesAway = newTrain.nextArrival - moment().format("HH:mm");
  // console.log(newEmp.billed);

  // Add each employee's data into the table
  $("#train-table > tbody").append(createTrainRow(newTrain));
});

function createTrainRow(train) {
  const trainRow = $("<tr>");
  trainRow.append("<td>" + train.name + "</td>");
  trainRow.append("<td>" + train.destination + "</td>");
  trainRow.append("<td>" + train.frequency + "</td>");
  trainRow.append("<td>" + train.nextArrival + "</td>");
  trainRow.append("<td>" + train.minutesAway + "</td>");

  return trainRow;
}

function resetInputs() {
	$(".form-control").val("");
}