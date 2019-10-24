// INITALIZING FARMERS DATA TABLE / COLLECTION REFERENCE
var stockRef = firebase.database().ref().child('stockLevelData');

function getStockLevelData() {

    var rootRef = stockRef;

    rootRef.on("child_added", function (snap) {

        // getting the values
        var fetchDistrict = snap.child('district').val();
        var fetchMarketPlace = snap.child('market_Place').val();
        var fetchMarketLocality = snap.child('marketLocality').val();
        var fetchProductCategory = snap.child('productCategory').val()
        var fetchProductName = snap.child('productName').val();
        var fetchMarketType = snap.child('marketType').val();
        var fetchMarketPrice = snap.child('marketPrice').val();

        //tm
        var fetchQuantityStore = snap.child('quantityStore').val();
        var fetchQuantityUnit = snap.child('quantityUnit').val();
        var fetchQuantitySold = snap.child('quantitySold').val();
        var fetchStockLevel = snap.child('stockLevel').val();
        var fetchDestination = snap.child('destination').val();
        //tsc
        var fetchgrandTotal = snap.child('grandTotal').val();
        var fetchrent = snap.child('rent').val();
        var fetchtransportCost = snap.child('transportCost').val();
        var fetchelectricity = snap.child('electricity').val();
        var fetchsecurityOwn = snap.child('securityOwn').val();
        //ssd
        var fetchsecurityMarketOwn = snap.child('securityMarketOwn').val();
        var fetchfumigation = snap.child('fumigation').val();
        var fetchchemicalTreatment = snap.child('chemicalTreatment').val();
        var fetchaverageCost = snap.child('averageCost').val();


        // console.log(fetchedDistrict+ ' ' + fetchedWHS_Price);

        var row = document.createElement("tr");

        var cell = "";

        // creating and assigning the table data to the element
        // MSU
        cell = document.createElement("td");
        cell_2 = document.createElement("td");
        cell_3 = document.createElement("td");
        cell_4 = document.createElement("td");
        cell_5 = document.createElement("td");
        cell_6 = document.createElement("td");
        cell_7 = document.createElement("td");
        //TM
        cell_8 = document.createElement("td");
        cell_9 = document.createElement("td");
        cell_10 = document.createElement("td");
        cell_11 = document.createElement("td");
        //TSC
        cell_12 = document.createElement("td");
        cell_13 = document.createElement("td");
        cell_14 = document.createElement("td");
        cell_15 = document.createElement("td");
        cell_16 = document.createElement("td");
        // SSD

        cell_17 = document.createElement("td");
        cell_18 = document.createElement("td");
        cell_19 = document.createElement("td");
        cell_20 = document.createElement("td");
        cell_21 = document.createElement("td");
        //SC


        // creating and assigning the TextNodes to the table
        // MSU
        var cellText = document.createTextNode(fetchDistrict);
        var cellText_2 = document.createTextNode(fetchMarketPlace);
        var cellText_3 = document.createTextNode(fetchMarketLocality);
        var cellText_4 = document.createTextNode(fetchProductCategory);
        var cellText_5 = document.createTextNode(fetchProductName);
        var cellText_6 = document.createTextNode(fetchMarketType);
        var cellText_7 = document.createTextNode(fetchMarketPrice);
        // TM
        var cellText_8 = document.createTextNode(fetchQuantityStore);
        var cellText_9 = document.createTextNode(fetchQuantityUnit);
        var cellText_10 = document.createTextNode(fetchQuantitySold);
        var cellText_11 = document.createTextNode(fetchStockLevel);
        var cellText_12 = document.createTextNode(fetchDestination);
        //TSC          
        var cellText_13 = document.createTextNode(fetchgrandTotal);
        var cellText_14 = document.createTextNode(fetchrent);
        var cellText_15 = document.createTextNode(fetchtransportCost);
        var cellText_16 = document.createTextNode(fetchelectricity);
        var cellText_17 = document.createTextNode(fetchsecurityOwn);
        // SSD
        var cellText_18 = document.createTextNode(fetchsecurityMarketOwn);
        var cellText_19 = document.createTextNode(fetchfumigation);
        var cellText_20 = document.createTextNode(fetchchemicalTreatment);
        var cellText_21 = document.createTextNode(fetchaverageCost);

        // appending the TextNodes to the cells 
        // MSU
        cell.appendChild(cellText);
        cell_2.appendChild(cellText_2);
        cell_3.appendChild(cellText_3);
        cell_4.appendChild(cellText_4);
        cell_4.appendChild(cellText_4);
        cell_5.appendChild(cellText_5);
        cell_6.appendChild(cellText_6);
        cell_7.appendChild(cellText_7);
        //TM
        cell_8.appendChild(cellText_8);
        cell_9.appendChild(cellText_9);
        cell_10.appendChild(cellText_10);
        cell_11.appendChild(cellText_11);
        // TSC
        cell_12.appendChild(cellText_12);
        cell_13.appendChild(cellText_13);
        cell_14.appendChild(cellText_14);
        cell_15.appendChild(cellText_15);
        cell_16.appendChild(cellText_16);
        //SSD
        cell_17.appendChild(cellText_17);
        cell_18.appendChild(cellText_18);
        cell_19.appendChild(cellText_19);
        cell_20.appendChild(cellText_20);
        cell_21.appendChild(cellText_21);
        // appending the cells to the rows
        row.appendChild(cell);
        row.appendChild(cell_2);
        row.appendChild(cell_3);
        row.appendChild(cell_4);
        row.appendChild(cell_4);
        row.appendChild(cell_5);
        row.appendChild(cell_6);
        row.appendChild(cell_7);
        // TM
        row.appendChild(cell_8);
        row.appendChild(cell_9);
        row.appendChild(cell_10);
        row.appendChild(cell_11);
        //TSC
        row.appendChild(cell_12);
        row.appendChild(cell_13);
        row.appendChild(cell_14);
        row.appendChild(cell_15);
        row.appendChild(cell_16);
        // SSD

        row.appendChild(cell_17);
        row.appendChild(cell_18);
        row.appendChild(cell_19);
        row.appendChild(cell_20);
        row.appendChild(cell_21);
        // getting the table ID and prepending the row
        document.getElementById("stockLevelTableBody").prepend(row);


        setTimeout(function () {
            $(function () {
                $('#stockLevelTableBody').DataTable();
            });
        }, 3000);


        // $(".js-exportable'").DataTable().row.add([dataSet]).draw();

        $(function () {


            // $.ajax({
            //     type: 'GET',
            //     url: 'http://localhost:3000/api/riceMarketApi.json',
            //     mimeType: 'json',
            //     success: function(data) {
            //         $.each(data, function(i, data) {
            //             var body = "<tr>";
            //             body    += "<td>" + data.district + "</td>";
            //             body    += "<td>" + data.price + "</td>";
            //             // body    += "<td>" + data.fetchedProduct + "</td>";
            //             // body    += "<td>" + data.fetchedDate + "</td>";
            //             // body    += "<td>" + data.fetchedWHS_Price + "</td>";
            //             body    += "</tr>";
            //             $( ".js-exportable tbody" ).append(body);
            //         });
            //         /*DataTables instantiation.*/
            //         $( ".js-exportable" ).DataTable();
            //     },
            //     error: function() {
            //         alert('Fail!');
            //     }
            // });

            // //Exportable table
            // $('.js-exportable tbody').DataTable({
            //     dom: 'Bfrtip',
            //     responsive: true,
            //     bJQueryUI: true,
            //     destroy: true,
            //     aaData: data,
            //     Columns: [
            //         { data: 'locality' },
            //         { data: 'district' },
            //         { data: 'product' },
            //         { data: 'date' },
            //         { data: 'wholesale_price' },
            //         { data: 'retail_price' }
            //     ],
            //     buttons: [
            //         'copy', 'csv', 'excel', 'pdf', 'print'
            //     ]
            // });

            // console.log(data);
        });

    });


}

// calling the stock Level Data function
getStockLevelData();