//Firebase config
const config = {
    apiKey: "AIzaSyDSBuaDZP7vTh--Jhztw6-rGWwIzX4ZXP4",
    authDomain: "train-timetable-78d37.firebaseapp.com",
    databaseURL: "https://train-timetable-78d37.firebaseio.com",
    projectId: "train-timetable-78d37",
    storageBucket: "train-timetable-78d37.appspot.com",
    messagingSenderId: "4449466252"
  };

//Firebase initialize app
firebase.initializeApp(config);

const newTrain = {};

//Add trains to firebase folder
const dbRef = firebase.database().ref("timetable/trains");

//Capture user input for new trains
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

//push user train to database if all fields filled
  if(newTrain.name && newTrain.destination && newTrain.first && newTrain.frequency) {
    dbRef.push(newTrain);

    resetInputs();

    return newTrain;
  }

  else {
    console.log("All values not input.");
  }
});

//Snapshot of dbRef on train addition
dbRef.on("child_added", function(childSnapshot, prevChildKey) {

  // New Train Info
  const newTrain = childSnapshot.val();
  console.log(newTrain);
  
  let time;

//Calculate countdown in minutes to next train
  newTrain.minutesAway = moment(newTrain.first, "HH:mm").diff(moment(), "minutes");

  let countDown = newTrain.minutesAway;
  console.log(Math.sign(countDown));

//If next train time has passed, recalculate minutes until next train
  if(Math.sign(countDown) === -1) {
    let newCountDown = countDown;
    console.log(newCountDown);

//Add frequency of trains until closest to current hour
    while(Math.sign(newCountDown) === -1) {
      console.log(newTrain.frequency);
      newCountDown = newCountDown + parseInt(newTrain.frequency);
      // console.log(newCountDown);
    }

    time = newCountDown;
    newTrain.minutesAway = time;

    console.log(time);
  }

//If next train is still coming, calculate the minutes away
  else {
    console.log(Math.sign(countDown));
    time = countDown;
    console.log(time);
  }

// Calculate the next train time for the schedule
  newTrain.nextArrival = moment().add(time, "minutes").format("HH:mm");
  let nextTrain = newTrain.nextArrival;
  console.log(nextTrain);

// Add each train & info to the table
  $("#train-table > tbody").append(createTrainRow(newTrain));

}, 

//Handling errors case
function(errorObject) {
  console.log("Errors handled; " + errorObject.code);
});

//Create HTML row for each new train
function createTrainRow(train) {
  const trainRow = $("<tr>");
  trainRow.append("<td>" + train.name + "</td>");
  trainRow.append("<td>" + train.destination + "</td>");
  trainRow.append("<td>" + train.frequency + "</td>");
  trainRow.append("<td>" + train.nextArrival + "</td>");
  trainRow.append("<td>" + train.minutesAway + "</td>");

  return trainRow;
}

//Empty form upon train submission
function resetInputs() {
	$(".form-control").val("");
}