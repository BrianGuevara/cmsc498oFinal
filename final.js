getData();
var selectedBar = null;

function getData() {
  // TODO: replace with proper code to fetch data from the server
  // and transform into JSON format
  return fetch('http://localhost:8080/data/rna.txt')
  .then(response => response.text().then(function (text){
    var aminoAcids = translate(text);
    var protein_dict = processData(aminoAcids);
    constructBarGraph(protein_dict);
    listProteins(aminoAcids);

    var aa = document.getElementsByClassName("aa")
  
    for(i = 0; i < aa.length; i++){
      aa[i].addEventListener("click", function(event){
        var selectedAA = getSelectedAA(this)
        
        updateSpectrum(selectedAA)
      })
    }

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

  var formula = d3.select("#formula");
  formula.text(target["formula"]);

  var weight = d3.select("#weight");
  weight.text(target["weight"]);

}

function listProteins(proteins) {
  var numChars = proteins.length;

  var newHTML = "";

  for(i = 0; i <= numChars; i++){
    newHTML += ("<span class=\"aa\">" + proteins[i] + "</span>");
  }

  document.getElementById("proteins").innerHTML = newHTML;

}

function translate(rna){
  var aminoAcids = ""

  var i = 0;

  while(i < rna.length){
      var codon = rna.substring(i, i+3);
      aminoAcids += getAA(codon);
      i = i+3;
  }

  return aminoAcids;
}

function getAA(codon){
  switch(codon) {
    case "GCA": return "A";
    case "GCC": return "A";
    case "GCG": return "A";
    case "GCU": return "A";
    case "UGC": return "C";
    case "UGU": return "C";
    case "GAC": return "D";
    case "GAU": return "D";
    case "GAA": return "E";
    case "GAG": return "E";
    case "UUC": return "F";
    case "UUU": return "F";
    case "GGA": return "G";
    case "GGC": return "G";
    case "GGG": return "G";
    case "GGU": return "G";
    case "CAC": return "H";
    case "CAU": return "H";
    case "AUA": return "I";
    case "AUC": return "I";
    case "AUU": return "I";
    case "AAA": return "K";
    case "AAG": return "K";
    case "CUA": return "L";
    case "CUC": return "L";
    case "CUG": return "L";
    case "CUU": return "L";
    case "UUA": return "L";
    case "UUG": return "L";
    case "AUG": return "M";
    case "AAC": return "N";
    case "AAU": return "N";
    case "CCA": return "P";
    case "CCC": return "P";
    case "CCG": return "P";
    case "CCU": return "P";
    case "CAA": return "Q";
    case "CAG": return "Q";
    case "AGA": return "R";
    case "AGG": return "R";
    case "CGA": return "R";
    case "CGC": return "R";
    case "CGG": return "R";
    case "CGU": return "R";
    case "AGC": return "S";
    case "AGU": return "S";
    case "UCA": return "S";
    case "UCC": return "S";
    case "UCG": return "S";
    case "UCU": return "S";
    case "ACA": return "T";
    case "ACC": return "T";
    case "ACG": return "T";
    case "ACU": return "T";
    case "GUA": return "V";
    case "GUC": return "V";
    case "GUG": return "V";
    case "GUU": return "V";
    case "UGG": return "W";
    case "UAC": return "Y";
    case "UAU": return "Y";
    case "UGA": return "";
    case "UAA": return "";
    case "UAG": return "";
    default:    return "-1";
  }
}

function getSelectedAA(selected){
  /* Courtesy of https://css-tricks.com/highlight-certain-number-of-characters/ */

  var aa = document.getElementsByClassName("aa");
  for(var i = 0; i < aa.length; i++){
    aa[i].classList.remove("selected")
  }
  selected.classList.add("selected");

  var nextSpan = selected;
  var allSelected = selected.innerHTML;

  for(i = 1; i < 10; i++){
    nextSpan = nextSpan.nextSibling;
    nextSpan.classList.add("selected")
    allSelected += nextSpan.innerHTML;
    
  }

  return allSelected;
}

function updateSpectrum(selectedAA){
  fetch('http://localhost:8080/proteins.json')
 .then(response => response.json().then(json => {
    updatePeptide(selectedAA)
    var weights = getWeights(json, selectedAA)
    var spectrum = createSpectrum(weights)
    console.log(weights)

    spectrumGraph(spectrum)
    //console.log(spectrum)

    var slider = document.getElementById("myRange")
    updateSlider(slider.value, weights)
    slider.oninput = function() {
      updateSlider(this.value, weights)
    }
 })
 )
}

function getWeights(json, selectedAA){
  var individualWeights = selectedAA.split("").map(aa => {
    var weight;
     for(var i = 0; i < json.length; i++){
       if(json[i]["symbol-1"] === aa){
         weight = json[i].weight
       }
     }
    return weight
  })
  
  return individualWeights
}

function createSpectrum(weights){
  var spectrum = [];

  for(var i = 0; i < weights.length; i++){
    leftArray = weights.slice(0, i+1)
    rightArray = weights.slice(i+1, weights.length)

    leftSum = +(leftArray.reduce(getSum).toFixed(2))
    spectrum.push(leftSum)

    if(rightArray.length !== 0){
      rightSum = +(rightArray.reduce(getSum).toFixed(2))
      spectrum.push(rightSum)
    }
    
    /*console.log(leftArray)
    console.log(leftSum)
    console.log(rightArray)
    console.log(rightSum)*/

  }

  function getSum(sum, num){
    return sum + num
  }

  return spectrum
}

function spectrumGraph(spectrum){
  var massSpectrum = calcOccurences(spectrum)

  var occurrences = Object.values(massSpectrum)
  var mass = Object.keys(massSpectrum)
  var svg = d3.select("#spectrum_svg")

  mass = mass.map(i => parseFloat(i))

  removeChildren(document.getElementById("spectrum_svg"));


  var margin = 50
  var height = 200
  var width = 500

  var xScale = d3.scaleLinear()
                 .domain([0, (d3.max(mass) + 100)])
                 .range([0, width - margin]);
  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(occurrences)])
                 .range([height - margin, 0]);

  svg.selectAll("rect")
      .data(mass)
      .enter()
      .append("rect")
      .attr("id", d => "m" + d)
      .attr("x", d => (xScale(d) + margin))
      .attr("y", d => yScale(parseInt(massSpectrum[d])))
      .attr("width", "3px")
      .attr("height", d => height - margin - yScale(parseInt(massSpectrum[d])))
      .attr("fill", "#2B81C6")

  svg.append("g")
      .attr("transform", "translate(" + margin + "," + (height - margin) + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

  /*svg.append("g")
      .attr("transform", "translate(" + margin + ",0)")
      .call(d3.axisLeft(yScale));*/
      

}

function calcOccurences(spectrum){
  var result = {};

  for (var i = 0; i < spectrum.length; i++){
    var mass = spectrum[i];

    if (mass in result){
      result[mass] = result[mass] + 1;
    } else {
      result[mass] = 1;
    }
  }

  return result;
}

function updatePeptide(selectedAA){
  var newHTML = "";

  for(i = 0; i < selectedAA.length; i++){
    newHTML += ("<span class=\"peptideChar\">" + selectedAA[i] + "</span>");
  }

  document.getElementById("peptide").innerHTML = newHTML;
}

function updateSlider(value, weights){
  var pepChars = document.getElementsByClassName("peptideChar")
      for(var i = 0; i < pepChars.length; i++){
        pepChars[i].classList.remove("selectedPeps")
      }

      if(value <= 10){
        pepChars[0].classList.add("selectedPeps")
        d3.select("#spectrum_svg").select("rect:nth-child(1)").attr("fill", "#F25757")
      } else if(value <= 20){
        for(var i = 0; i < 2; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }else if(value <= 30){
        for(var i = 0; i < 3; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }else if(value <= 40){
        for(var i = 0; i < 4; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }else if(value <= 50){
        for(var i = 0; i < 5; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }else if(value <= 60){
        for(var i = 0; i < 6; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }else if(value <= 70){
        for(var i = 0; i < 7; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }else if(value <= 80){
        for(var i = 0; i < 8; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }else if(value <= 90){
        for(var i = 0; i < 9; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }else if(value <= 100){
        for(var i = 0; i < 10; i++){
          pepChars[i].classList.add("selectedPeps")
        }
      }
}

function removeChildren(el) {
  while(el.firstChild) {
    el.removeChild(el.firstChild);
  }
}