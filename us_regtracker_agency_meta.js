(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        // Schema for the value
        var cols = [{
            id: "agencyID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "agencyName",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "US_regtracker",
            alias: "US regtracker, agency meta",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.quantgov.org/agencies", function(resp) {
            var feat = resp,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "agencyID": feat[i].agencyID,
                    "agencyName": feat[i].agencyName
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
            tableau.connectionName = "US Regtracker, agency meta";
            tableau.submit();
        });
    });
})();