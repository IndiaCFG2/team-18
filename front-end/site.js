// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: apiKey,
    authDomain: "cfg-team18.firebaseapp.com",
    databaseURL: "https://cfg-team18.firebaseio.com",
    projectId: "cfg-team18",
    storageBucket: "cfg-team18.appspot.com",
    messagingSenderId: "816670917444",
    appId: "1:816670917444:web:195831e13073b41536cd11"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

function getSchools() {
    const schoolRef = firestore.collection("institutionDetails");
    schoolRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id}`);
        });
    });
}
getSchools()

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}

today = yyyy + '-' + mm + '-' + dd;
document.getElementById("date1").setAttribute("max", today);
mindate = document.getElementById("date1").value
document.getElementById("date2").setAttribute("max", today);
document.getElementById("date2").setAttribute("min", mindate);


async function getIdByNameOfInstitution(name) {

    const institutionRef = firestore.collection("institutionDetails").doc(name);
    var data;
    await institutionRef.get().then(function(doc) {
        data = doc.data();

    });
    return data.id;
}

async function getIdByNameOfBoard(name) {
    const boardRef = firestore.collection("boardID").doc(name);
    var data;
    await boardRef.get().then(function(doc) {
        data = doc.data();
    });
    return data.id;
}

async function getDocumentsUsingParametes(instId, brdData, grade, subject, fromDate, toDate) {

    // var listOfKeyValuePairs = [];
    var dict = {};
    const lessonRef = await firestore.collection('lessons').get();
    console.log(lessonRef);
    const lessonRefVal = lessonRef.docs;
    for (const doc of lessonRefVal) {
        var splString = doc.id;
        var l = doc.id.split("_");
        var f1 = true,
            f2 = true,
            f3 = true,
            f4 = true;
        if (instId) {
            if (l[0] == instId)
                f1 = true;
            else
                f1 = false;
        }
        if (brdData) {
            if (l[1] == brdData)
                f2 = true;
            else
                f2 = false;
        }
        if (grade) {
            if (l[2] == grade)
                f3 = true;
            else
                f3 = false;
        }
        if (subject) {
            if (l[3] == subject)
                f4 = true;
            else
                f4 = false;
        }
        if (f1 && f2 && f3 && f4) {
            var datesRefrence = await firestore.collection("lessons").doc(doc.id).collection("dates").get();
            var datesRefrenceVal = datesRefrence.docs;
            for (const doc1 of datesRefrenceVal) {
                // console.log(doc.id, "=>", doc.data());
                // check if doc.id time stamp is between the fromdatestamp and the to datestamp
                // if it is
                // Add the count to the string that is 100-1-grade1-...
                // console.log(doc.data().count);

                function toTimestamp(strDate) {
                    var datum = Date.parse(strDate);
                    return datum / 1000;
                }

                fdts = toTimestamp(fromDate);
                edts = toTimestamp(toDate);

                if (Number(doc1.id) >= fdts && Number(doc1.id) <= edts) {
                    if (dict[splString] != undefined) {
                        dict[splString] += Number(doc1.data().count);
                    } else {
                        dict[splString] = Number(doc1.data().count);
                    }
                }
            };
        };
    }
    return dict;
}




async function chooseOptions() {

    school = $('#school option:selected').text();
    board = $('#board option:selected').text();
    grade = $('#grade option:selected').text();
    subject = $('#subject option:selected').text();
    date1 = document.getElementById("date1").value
    date2 = document.getElementById("date2").value

    //var schoolid = $('#school').val();
    console.log(school, board, grade, subject, date2)

    //fetch data after filtering
    graph_data = await getWrapper(school, board, grade, subject, date1, date2);

    var ls = []
    var highTech = []
    var lowTech = []

    graph_data.forEach(function(obj) {
        for (key in obj) {
            ls.push(key)
            highTech.push(obj[key][0])
            lowTech.push(obj[key][1])
        }
    });

    console.log(ls, highTech, lowTech)
    new Chart(document.getElementById("barchart"), {
        type: 'bar',
        data: {
            labels: ls,
            datasets: [{
                label: "HighTech",
                backgroundColor: "#3e95cd",
                data: highTech
            }, {
                label: "LowTech",
                backgroundColor: "#8e5ea2",
                data: lowTech
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Student viewership'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


// console.log(dict);


var splLinkAndCount;
var out = [];
async function getWrapper(inst, board, grade, sub, sdate, edate) {
    var instId = await getIdByNameOfInstitution(inst);
    console.log(instId);
    var brdData = await getIdByNameOfBoard(board);
    var out = [];
    console.log(brdData);
    var grade = grade;
    var subject = sub;
    splLinkAndCount = await getDocumentsUsingParametes(instId, brdData, grade, subject, sdate, edate);
    console.log(splLinkAndCount);
    for (key in splLinkAndCount) {
        l = key.split("_");
        lessonName = l[4];
        techName = l[5];
        var l2 = [0, 0];
        var f = false;
        for (key in out) {
            console.log(out[key].key)
            if (out[key].key == lessonName) {
                l2[0] = out[key][0];
                l2[1] = out[key][1];
                f = true;
            }
        }
        if (f == false) {
            l2 = [0, 0];
        }
        if (techName == "ht") {
            l2[0] = splLinkAndCount[key];
        } else {
            l2[1] = splLinkAndCount[key];
        }
        var temp = Object({ lessonName: l2 });
        out.push(temp);
    }

    console.log(out);
    return out;
};