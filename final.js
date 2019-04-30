getData();

function getData() {
  // TODO: replace with proper code to fetch data from the server
  // and transform into JSON format
  return fetch('http://localhost:8080/data/proteins.txt')
  .then(response => response.text().then(function (text){
    var protein_dict = processData(text);
    constructBarGraph(protein_dict);
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

  var margin = 25;
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
      .style("fill", "blue");

  // add x axis
  svgContainer.append("g")
  .attr("transform", "translate(" + margin + "," + (height - margin) + ")")
  .call(d3.axisBottom(xScale));

  // add the y Axis
  svgContainer.append("g")
              .attr("transform", "translate(" + margin +
                                   ",0)")
              .call(d3.axisLeft(yScale));


}
