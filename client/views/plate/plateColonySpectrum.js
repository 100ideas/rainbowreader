Template.plateColonySpectrum.rendered = function(){

    doc = getSessionDocument();

    data = doc.colonyData;

      /////////////////////////////////////////////////
      //
      // circles
      //
      ////////////////////////////////////////////////

      // radius of circles proportional to (count)^(0.5)
      // determine total width of the visualization vs page width
      var scalingFactor = width / data.map(function(x) {return Math.sqrt(x.count)}).reduce(function(a, b) {return a + b})

      // draw circles
      var circle = d3.select('#circles').selectAll('div')
          .data(data)
      plot.selectAll('div')
          .classed('pulse', false)
      circle.exit().remove()
      circle.enter().append('div')
          .style('background-color', function(d) { return d.color })
      // updated circles should attract attention
      circle
          .style('background-color', 'white')
          .transition().ease('elastic', 8, 0.1)
          .style('width', function(d) { return Math.floor(Math.sqrt(d.count) * scalingFactor) + 'px' })
          .style('height', function(d) { return Math.floor(Math.sqrt(d.count) * scalingFactor) + 'px' })
          .transition().ease('linear').delay(3000)
          .style('background-color', function(d) { return d.color })
          .attr('class', 'pulse')
}