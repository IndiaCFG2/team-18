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

async function getDocumentsUsingParametes(instId, brdData, grade, subject) {

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
                // console.log(dict, splString, doc1.data().count();
                if (dict[splString] != undefined) {
                    dict[splString] += doc1.data().count;
                } else {
                    dict[splString] = doc1.data().count;
                }
            };
        };
    }
    return dict;
}




// console.log(dict);


var splLinkAndCount;
async function getWrapper() {
    var instId = await getIdByNameOfInstitution("NIE");
    console.log(instId);
    var brdData = await getIdByNameOfBoard("CBSE");
    console.log(brdData);
    var grade = "grade2";
    var subject = "eng";
    splLinkAndCount = await getDocumentsUsingParametes(instId, brdData, grade, subject);
    console.log(splLinkAndCount);
    var out = [];
    for (key in splLinkAndCount) {
        l = key.split("_");
        lessonName = l[4];
        techName = l[5];
        var l2 = [0, 0];
        if (techName == "ht") {
            l2[1] = splLinkAndCount[key];
        } else {
            l2[0] = splLinkAndCount[key];
        }
        var temp = Object({ lessonName: l2 });
        out.push(temp);
    }
    console.log(out);
}
getWrapper();