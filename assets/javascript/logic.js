const config = {
    apiKey: "AIzaSyDSBuaDZP7vTh--Jhztw6-rGWwIzX4ZXP4",
    authDomain: "train-timetable-78d37.firebaseapp.com",
    databaseURL: "https://train-timetable-78d37.firebaseio.com",
    projectId: "train-timetable-78d37",
    storageBucket: "train-timetable-78d37.appspot.com",
    messagingSenderId: "4449466252"
  };

firebase.initializeApp(config);

const newTrain = {};

const dbRef = firebase.database().ref("timetable/trains");

$("#add-train-btn").on("click", function (event) {
	event.preventDefault();

	const newTrain = {
    name: $("#train-name-input").val().trim(),
    destination: $("#destination-input").val().trim(),
    first: $("#first-train-input").val().trim(),
    frequency: $("#frequency-input").val().trim()
  };

  console.log(newTrain.name, "-new train name");
  console.log(newTrain.destination, "-new train destination");
  console.log(newTrain.first, "-new train first train");
  console.log(newTrain.frequency, "-new train frequency");

  dbRef.push(newTrain);

  resetInputs();

  return newTrain;

});

dbRef.on("child_added", function(childSnapshot, prevChildKey) {

  // New Train Info
  const newTrain = childSnapshot.val();
  console.log(newTrain);
  
  let time;

  newTrain.minutesAway = moment(newTrain.first, "HH:mm").diff(moment(), "minutes");

  let countDown = newTrain.minutesAway;
  console.log(Math.sign(countDown));

  if(Math.sign(countDown) === -1) {
    let newCountDown = countDown;
    console.log(newCountDown);

    while(Math.sign(newCountDown) === -1) {
      console.log(newTrain.frequency);
      newCountDown = newCountDown + parseInt(newTrain.frequency);
      // console.log(newCountDown);
    }

    time = newCountDown;
    newTrain.minutesAway = time;

    console.log(time);
  }

  else {
    console.log(Math.sign(countDown));
    time = countDown;
    console.log(time);
  }

  // Calculate the next arrival
  newTrain.nextArrival = moment().add(time, "minutes").format("HH:mm");
  let nextTrain = newTrain.nextArrival;
  console.log(nextTrain);

  // Add each train to the table
  $("#train-table > tbody").append(createTrainRow(newTrain));

}, 

function(errorObject) {
  console.log("Errors handled; " + errorObject.code);
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