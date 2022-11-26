

// !preview r2d3 data =data, d3_version = 4

// Based on https://bl.ocks.org/mbostock/4063269

// Initialization


svg.attr("font-family", "sans-serif")
  .attr("font-size", "18")
  .attr("text-anchor", "middle");
    
var svgSize = 800;
var pack = d3.pack()
  .size([svgSize, svgSize])
  .padding(15);
    
var format = d3.format(",d");

var colors = new Map([["Study design", "black"], ["Statistical models", "white"], ["Epidemiology", "blue"],["Data Collection methods", "yellow"],["Specific Data Analysis","green"]])

//var color = d3.scaleOrdinal(d3.schemeCategory20c);

var group = svg.append("g");

// Resize
r2d3.onResize(function(width, height) {
  var minSize = Math.min(width, height);
  var scale = minSize / svgSize;
  
  group.attr("transform", function(d) {
    return "" +
      "translate(" + (width - minSize) / 2 + "," + (height - minSize) / 2 + ")," +
      "scale(" + scale + "," + scale + ")";
  });
});

// Rendering
r2d3.onRender(function(data, svg, width, height, options) {

  group.selectAll("g").remove();

  var root = d3.hierarchy({children: data})
    .sum(function(d) { return d.value; })
    .each(function(d) {
      if (short = d.data.short) {
        var short, i = short.lastIndexOf(".");
        d.short = short;
      }
      if (id = d.data.id) {
        var id, i = id.lastIndexOf(".");
        d.id = id;
      }
    });
  var dacol = ["Strong theoretical base of data science practice and ethics",	"Causal inference",	"Data Collection methods",	"Database Management",	"nonSQL databases",	"Relational databases",	"Data Imputation"	,"Supervised Machine Learning","Data wrangling",	"Deep learning",	"Network science",	"Unsupervised Machine Learning",	"Programming", 	"SQL",	"Python", 	"Data clean-up",	"QGIS",	"PCRaster",	"R	Rmardown",	"Epidemiology",	"Bayesian statistics",	"Statistical models",	"Stochastic Modeling",	"Explorative Data Analysis",	"Specific Data Analysis",	"Simulation models",	"PAC",	"Data mining",	"Big data",	"Visualizations",	"Graph Analysis/Graph construction",	"Data manipulation",	"SPSS",	"Complex systems",	"MAL",	"HLM",	"Text mining",	"Study design",	"Stata",	"JASP",	"Haskell",	"Mplus","Visual Studio"]
  var myColor = d3.scaleOrdinal().domain(dacol)
  .range(["#48bf8e", "#48bf8e", "#2c4e2f", "#1f3e9e", "#78ee5a", "#9c1a54", "#a3c541", "#6f1996", "#d595d9", "#573f56", "#eb67f9", "#6f85a6", "#77d1fd", "#21a708", "#9a2a06", "#f7b8a2", "#683d0d", "#fe8f06", "#fd2c3b", "#cdd9b8", "#2580fe", "#7212ff", "#ffce54", "#ff0087", "#a27c59","#69ef7b", "#cb1775", "#528f7a", "#992a13", "#d0d2f0", "#154e56", "#e78361", "#77d6cf", "#6e334f", "#afd35a", "#b97eac", "#f0d27e", "#f231fc", "#5b8313", "#6146ca", "#b28b28", "#ee80fe", "#19a71f", "#0494fb", "#fc2c44", "#6108e8", "#55450a", "#1a4fa3"])
 //var color = d3.scaleOrdinal(d3.schemeCategory20c)

  
  var node = group.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("package", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .transition()
      .ease(d3.easeExp)
      .attr("id", function(d) { return d.id; })
      .transition()
      .duration(400)
      .ease(d3.easeExp)
      .attr("r", function(d) { return d.r; })
      .attr("fill", function(d){return myColor(d.id) });
     // .style("fill", function(d) { return color(d.id); });
  node.on("click", function(d) {
        var message = d.id;
        Shiny.onInputChange("click_event",message)
    });
      
      
  node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });
      
  node.append("text")
    .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
    .selectAll("tspan")
    .data(function(d) { return d.short.split(/(?=[A-Z][^A-Z])/g); })
    .enter()
    .append("tspan")
      .transition().duration(400)
      .attr("x", 0)
      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 12; })
      .transition()
      .duration(400)
      .text(function(d) { return d; });

  node.append("title")
      .text(function(d) { return d.id + "\n Total of: " + format(d.value)+" courses"+"\n Click on me to see details"; });
  r2d3.resize(width, height);
});

