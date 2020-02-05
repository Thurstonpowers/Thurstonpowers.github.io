(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        // Schema for the value
        var cols = [{
            id: "industryID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "industryName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "industryCode",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "US_regtracker",
            alias: "US regtracker, industry meta",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.quantgov.org/industries?filteredOnly=true&jurisdiction=38", function(resp) {
            var feat = resp,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "industryID": feat[i].industryID,
                    "industryName": feat[i].industryName,
                    "industryCode": feat[i].industryCode
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "US Regtracker, industry meta";
            tableau.submit();
        });
    });
})();