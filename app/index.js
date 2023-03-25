import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings"; //get watch preferences for time & etc
import { HeartRateSensor } from "heart-rate"; //get the bpm of the user 
import { me as appbit } from "appbit"; //get user
import { today } from "user-activity"; //get the steps/distance/calories of the user
import { battery } from "power"; //get the battery level of the device

//Method to convert time to 24 hour format
function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

//Method to convert Date class' getDay() which represents days from 0-6 & make it say the name of the day
function dayName(j) {
    if (j == 0) { //0 == Sunday
        j = "Sunday";
    } else if (j == 1) { //1 == Monday
        j = "Monday";
    } else if (j == 2) { //2 == Tuesday
        j = "Tuesday";
    } else if (j == 3) { //3 == Wednesday
        j = "Wednesday";
    } else if (j == 4) { //4 == Thursday
        j = "Thursday";
    } else if (j == 5) { //5 == Friday
        j = "Friday";
    } else if (j == 6) { //6 == Saturday
        j = "Saturday";
    }

    return j;
}

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myTime = document.getElementById("myTime");

//Date d = new Date();
const myDate = document.getElementById("myDate");
//dayName(d.getDay());

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
    let todayDate = evt.date;
    let hours = todayDate.getHours();
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hours = hours % 12 || 12;
    } else {
        // 24h format
        hours = zeroPad(hours);
    }
    let mins = zeroPad(todayDate.getMinutes());
    myTime.text = `${hours}:${mins}`;

    //will update the date regularly alongside clock. Uses evt
    let weekday = dayName(todayDate.getDay());
    let parseDateArr = todayDate.toString().split(' '); //0 = weekday, 1 = month, 2 = day, 3 = year, 4 = 24hr clock, 5 = timezone
    myDate.text = `${weekday} - ${parseDateArr[1]} ${parseDateArr[2]}`;

    //STEPS:
    const mySteps = document.getElementById("mySteps");
    if (appbit.permissions.granted("access_activity")) { //permission to get activity from user
        console.log(`${today.adjusted.steps} Steps`);
        mySteps.text = `${today.adjusted.steps}`;
    } else {
        console.log(`Steps permission not shared by user`);
        mySteps.text = `---`;
    }

    //CALS:
    const myCals = document.getElementById("myCals");
    if (appbit.permissions.granted("access_activity")) { //permission to get activity from user
        console.log(`${today.adjusted.calories} Calories`);
        myCals.text = `${today.adjusted.calories}`;
    } else {
        console.log(`Steps permission not shared by user`);
        myCals.text = `---`;
    }

    //DISTANCE:
    const myDistance = document.getElementById("myDistance");
    if (appbit.permissions.granted("access_activity")) { //permission to get activity from user
        console.log(`${today.adjusted.distance} Distance Travelled`);
        myDistance.text = `${today.adjusted.distance}m`; //meters
    } else {
        console.log(`Distance permission not shared by user`);
        myDistance.text = `---`;
    }

    //BATTERY:
    const myBattery = document.getElementById("myBattery");
    let batLevel = Math.floor(battery.chargeLevel);
    myBattery.text = `${batLevel}%`;
}


//Get the Battery life, BPM, Steps, Calories burned, & Distance travelled on foot

//BPM:
const myBPM = document.getElementById("myBPM");

if (HeartRateSensor) { //if device has a heart rate sensor, then get bpm
    let bpm = new HeartRateSensor({ frequency: 1 });
    bpm.addEventListener("reading", () => {
        console.log(`Current heart rate is: ${bpm.heartRate}`);
        myBPM.text = `${bpm.heartRate}`;
    });
    bpm.start();
} else { //put placeholder for no heart beat detected
    console.log(`No heart rate detected.`);
    myBPM.text = `---`;
}
