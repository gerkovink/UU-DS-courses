

// !preview r2d3 data =data, d3_version = 4

// Based on https://bl.ocks.org/mbostock/4063269

// Initialization


svg.attr("font-family", "sans-serif")
  .attr("font-size", "18")
  .attr("text-anchor", "middle");
    
var svgSize = 600;
var pack = d3.pack()
  .size([svgSize, svgSize])
  .padding(6);
    
var format = d3.format(",d");
var color = d3.scaleOrdinal(d3.schemeCategory20c);

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
      .style("fill", function(d) { return color(d.id); });
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
    .data(function(d) { return d.id.split(/(?=[A-Z][^A-Z])/g); }) //d.short.split(/(?=[A-Z][^A-Z])/g); })
    .enter()
    .append("tspan")
      .transition().duration(400)
      .attr("x", 0)
      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
      .transition()
      .duration(400)
      .text(function(d) { return d; });

  node.append("title")
      .text(function(d) { return d.id + "\n Total of: " + format(d.value)+" courses"+"\n Click on me to see details"; });
  r2d3.resize(width, height);
});

