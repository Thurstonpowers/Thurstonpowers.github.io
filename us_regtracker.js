(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        // Schema for the value
        var cols = [{
            id: "seriesName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "seriesValue",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "jurisdictionID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "agencyID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "industryCode",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "periodCode",
            dataType: tableau.dataTypeEnum.date
        }];

        var tableSchema = {
            id: "US_regtracker",
            alias: "US regtracker, restrictions",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.quantgov.org/values/agencies?jurisdiction=38&date=2016-01-01,2020-02-03&documentType=5&series=91,92,1,9&industry=0,111,112,113,114,115,211,212,213,221,236,237,238,311,312,313,314,321,322,323,324,325,326,327,331,332,333,334,335,336,337,339,423,424,425,441,442,443,444,445,446,447,448,451,452,453,454,481,482,483,484,485,486,487,488,493,511,512,515,517,518,519,521,522,523,524,525,531,532,541,551,561,562,611,621,622,623,624,711,712,713,721,722,811,812,813,814,921,922,924,928&agency=0,216,66,147,209,159,99,170,255,80,110,219,225,197,188,156,206,203,129,257,111,240,164,168,143,121,184,154,189,68,186,244,90,74,113", function(resp) {
            var feat = resp,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "seriesName": feat[i].series.seriesName,
                    "seriesValue": feat[i].seriesValue,
                    "jurisdictionID": feat[i].jurisdiction.jurisdictionID,
                    "agencyID": feat[i].agency.agencyID,
                    "industryCode": feat[i].industry.industryCode,
                    "periodCode": feat[i].valuePeriod.periodCode
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
            tableau.connectionName = "US Regtracker";
            tableau.submit();
        });
    });
})();