getData();

function getData() {
  // TODO: replace with proper code to fetch data from the server
  // and transform into JSON format
  return fetch('http://localhost:8080/')
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

  var margin = 25;
  var height = document.getElementById("bar_svg").clientHeight;
  var width = document.getElementById("bar_svg").clientWidth;
}                                                                                                                                                                                                                                                   
