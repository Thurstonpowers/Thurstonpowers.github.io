(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        // Schema for the value
        var cols = [{
            id: "jurisdictionID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "jurisdictionName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "administrativeLevel",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "RegCensus",
            alias: "RegCensus, geography",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.quantgov.org/jurisdictions", function(resp) {
            var feat = resp,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "jurisdictionID": feat[i].jurisdictionID,
                    "jurisdictionName": feat[i].jurisdictionName,
                    "country": feat[i].country,
                    "administrativeLevel": feat[i].administrativeLevel
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
            tableau.connectionName = "RegCensus, geography";
            tableau.submit();
        });
    });
})();