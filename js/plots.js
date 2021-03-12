


// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

function LF_PopulateTitles() {
  Plotly.d3.csv('/resources/titles.csv', function(err, rows){
    function unpack(rows, key) {
     return rows.map(function(row) {return row[key]; });
    };
    titleCodes = unpack(rows, 'Title Code');   
    titleNames = unpack(rows, 'Title Name');   
    titlesDict = [];  
    for (var i = 0; i < titleCodes.length; i++) {
      titlesDict.push({
        "Code":  titleCodes[i],                        
        "Name": titleNames[i]
      });
  }

    let selector = d3.select("#selDataset");    
    selector
      .append("option")
      .text("All")
      .property("value", "");
    titlesDict.map(title => title).forEach((t) => {
        selector
            .append("option")
            .text(t.Name)
            .property("value", t.Code);
    });

  });

}

function init() {
    LF_PopulateTitles();
    LF_PopulateTitledPlayersPlot();
  };


function LF_PopulateTitledPlayersPlot() {
  var selectorValue = d3.select("#selDataset").property("value");
  
  console.log("selectorValue " + selectorValue);

  Plotly.d3.csv('/output_data/players_Titled.csv', function(err, rows){
    function unpack(rows, key) {
      var row = rows.map(function(row) {return row[key]; })
      return row;
    };

    countries = unpack(rows, 'country');        
    var uniqueCountries = [];
    var uniqueCountryCounts = [];
    
    var countryCountsDict = {};

    for (var i = 0; i < countries.length; i++) {
        var num = countries[i];
        countryCountsDict[num] = countryCountsDict[num] ? countryCountsDict[num] + 1 : 1;
    }
    for (const [key, value] of Object.entries(countryCountsDict)) {
        //     countryCounts.push({
        //         "country":  key,                        
        //         "count": value
        // });
        
        uniqueCountries.push(key);
        uniqueCountryCounts.push(value);

        //console.log(`${key}: ${value}`);
        };
          
    titles = unpack(rows, 'title');
    followers = unpack(rows, 'followers');
            
    // Trace 1
    var trace1 = {
        x: uniqueCountries,
        y: uniqueCountryCounts,
        name: "Titled Players Count by Country",
        type: "bar"
    };

    var data = [trace1];

    var layout = {
      title: "Titled Players Count by Country",
      xaxis: { title: "Country Code" },
      yaxis: { title: "Titled Player Count"}
    };

    Plotly.newPlot('plot', data, layout);

  });    
};

  // Case statement
function filterTitle(title) {
  // Initialize x and y arrays
  var x = [];
  var y = [];
      console.log("Filter by " + title);
      if (title === 'GM') {
        x = [1, 2, 3, 4, 5];
        y = [1, 2, 4, 8, 16];
      } else if (title === 'IM') {
        x = [10, 20, 30, 40, 50];
        y = [1, 10, 100, 1000, 10000];
      } else if (title === "") {
        LF_PopulateTitledPlayersPlot();
        return xy;
      } else {
        x = [10, 20, 30, 40, 50];
        y = [2333,245,2485,82412,21]
      };

      xy = [x,y];
    return xy;
  };

  // This function is called when a dropdown menu item is selected
  function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
  
    var xy = filterTitle(dataset);
    x = xy[0];
    y = xy[1];

    // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("plot", "x", [x]);
    Plotly.restyle("plot", "y", [y]);
  }
  
  init();