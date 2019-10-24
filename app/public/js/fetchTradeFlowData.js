// INITALIZING FARMERS DATA TABLE / COLLECTION REFERENCE
var tradeFlowRef = firebase.database().ref().child('productTradeFlowData');


function getTradeFlowData() {

    var rootRef = tradeFlowRef;

    rootRef.on("child_added", function (snap) {

        var fetchedProduct = snap.child("product").val();
        var fetchedTonage = snap.child("tonage").val();
        var fetchedValue = snap.child("value").val();
        var fetchedEnumerator = snap.child("enumerator").val();
        var fetchedDate = snap.child("date").val();
        var fetchedDistFrom = snap.child("district_from").val();
        var fetchedChiefdomFrom = snap.child("chiefdom_from").val();
        var fetchedDistTo = snap.child("district_to").val();
        var fetchedChiefdomTo = snap.child("chiefdom_to").val();

        var row = document.createElement("tr");

        var cell_1 = "";

        // creating and assigning the table data to the element
        cell_1 = document.createElement("td");
        cell_2 = document.createElement("td");
        cell_3 = document.createElement("td");
        cell_4 = document.createElement("td");
        cell_5 = document.createElement("td");
        cell_6 = document.createElement("td");
        cell_7 = document.createElement("td");
        cell_8 = document.createElement("td");
        cell_9 = document.createElement("td");



        // creating and assigning the TextNodes to the table
        var cellAddText1 = document.createTextNode(fetchedProduct);
        var cellAddText2 = document.createTextNode(fetchedTonage);
        var cellAddText3 = document.createTextNode(fetchedValue);
        var cellText_4 = document.createTextNode(fetchedEnumerator);
        var cellText_5 = document.createTextNode(fetchedDate);
        var cellText_6 = document.createTextNode(fetchedDistFrom);
        var cellText_7 = document.createTextNode(fetchedChiefdomFrom);
        var cellText_8 = document.createTextNode(fetchedDistTo);
        var cellText_9 = document.createTextNode(fetchedChiefdomTo);



        // appending the TextNodes to the cells 
        cell_1.appendChild(cellAddText1);
        cell_2.appendChild(cellAddText2);
        cell_3.appendChild(cellAddText3);
        cell_4.appendChild(cellText_4);
        cell_5.appendChild(cellText_5);
        cell_6.appendChild(cellText_6);
        cell_7.appendChild(cellText_7);
        cell_8.appendChild(cellText_8);
        cell_9.appendChild(cellText_9);



        // appending the cells to the rows
        row.appendChild(cell_1);
        row.appendChild(cell_2);
        row.appendChild(cell_3);
        row.appendChild(cell_4);
        row.appendChild(cell_5);
        row.appendChild(cell_6);
        row.appendChild(cell_7);
        row.appendChild(cell_8);
        row.appendChild(cell_9);


        // getting the table ID and prepending the row
        document.getElementById("tradeFlowTableBody").prepend(row);

        // setTimeout(function () {
        //     $(function () {
        //         $('#tradeFlowTableBody').DataTable();
        //     });
        // }, 3000);

    });

}

// calling the tradeFlowData\
getTradeFlowData();