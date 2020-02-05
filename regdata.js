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
            id: "periodCode",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "seriesName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "seriesValue",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "Regdata",
            alias: "Regdata, restrictions",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.quantgov.org/values/country?countries=33&countries=38&countries=84&dateIsRange=true&documentType=3&filteredOnly=true&series=1&series=2&summary=true&years=2016&years=2020", function(resp) {
            var feat = resp,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "jurisdictionID": feat[i].jurisdiction.jurisdictionID,
                    "periodCode": feat[i].valuePeriod.periodCode,
                    "seriesName": feat[i].series.seriesName,
                    "seriesValue": feat[i].seriesValue
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
            tableau.connectionName = "RegCensus Explorer";
            tableau.submit();
        });
    });
})();