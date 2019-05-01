getData();
var selectedBar = null;

function getData() {
  // TODO: replace with proper code to fetch data from the server
  // and transform into JSON format
  return fetch('http://localhost:8080/data/proteins.txt')
  .then(response => response.text().then(function (text){
    var protein_dict = processData(text);
    constructBarGraph(protein_dict);
    listProteins(text);
  }))
  .catch(function (error){
    console.log("Error fetching data. ", error.message);
  });
}

// Processes the sting into a dictionary counting occurrences
function processData(protein_string){
  var result = {};

  for (var i = 0; i < protein_string.length; i++){
    var char = protein_string.charAt(i);

    if (char in result){
      result[char] = result[char] + 1;
    } else {
      result[char] = 1;
    }
  }

  return result;
}

function constructBarGraph(protein_dict) {
  var occurrences = Object.values(protein_dict)
  var proteins = Object.keys(protein_dict);
  var svgContainer = d3.select("#bar_svg");

  var margin = 50;
  var height = document.getElementById("bar_svg").clientHeight;
  var width = document.getElementById("bar_svg").clientWidth;

  var xScale = d3.scaleBand()
                 .domain(proteins)
                 .range([0, width - margin])
                 .padding(0.1);
  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(occurrences)])
                 .range([height - margin, 0]);

  svgContainer.selectAll("rect")
      .data(proteins)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d) + margin)
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(parseInt(protein_dict[d])))
      .attr("height", d => height - margin - yScale(parseInt(protein_dict[d])))
      .attr("fill", "#2B81C6")
      .on("mouseover", function(d) {
            d3.select(this)
            	.attr("fill", "#F25757");
        })
      .on("mouseout", function(d, i) {
            if (this != selectedBar){
              d3.select(this).attr("fill", function() {
                  return "#2B81C6";
              });
            }
        })
      .on("click", function(d){
        if (selectedBar){
          d3.select(selectedBar).attr("fill", "#2B81C6");
        }
        d3.select(this).attr("fill", "#F25757")
        selectedBar = this;
        getProteinData(d);
      });

  // add x axis
  svgContainer.append("g")
  .attr("transform", "translate(" + margin + "," + (height - margin) + ")")
  .call(d3.axisBottom(xScale));

  // add the y Axis
  svgContainer.append("g")
              .attr("transform", "translate(" + margin +
                                   ",0)")
              .call(d3.axisLeft(yScale));

  svgContainer.append("text")
              .attr("transform", "rotate(-90)")
              .attr("x", 0 - (height / 2))
              .attr("y", -25 + margin / 2)
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Number of Occurences");
}

function getProteinData(selected_protein) {
  fetch('http://localhost:8080/proteins.json')
 .then(response => response.json().then(json => updateInfoPanel(json, selected_protein)))
 .catch(function (error){
   console.log("Error fetching data. ", error.message);
 });
}

function updateInfoPanel(protein_info, selected_protein){
  console.log(protein_info);
  console.log(selected_protein);
  var target = null;

  for (var i = 0; i < protein_info.length; i++){
    var protein = protein_info[i];

    if (protein["symbol-1"] === selected_protein){
      target = protein;
      break;
    }
  }
  var header = d3.select("#protein_name_header");
  header.text(target["name"]);

  var imgContainer = d3.select("#protein_image");
  imgContainer.attr("src", target["structure"]);

  var proteinName = d3.select("#protein_name");
  proteinName.text(target["name"]);

  var symbol3 = d3.select("#symbol3");
  symbol3.text(target["symbol-3"]);

  var symbol1 = d3.select("#symbol1");
  symbol1.text(target["symbol-1"]);

  var weight = d3.select("#weight");
  weight.text(target["weight"]);

}

function listProteins(proteins) {
  document.getElementById("proteins").innerHTML = proteins;
}
