import React from 'react'
var d3 = require("d3")


export class HostGraph extends React.Component {

  constructor(args){
    super(args)

    this.state = {
      clkHostId: ''
    }

    this.handleClkAction      = this.handleClkAction.bind(this)

    this.apiCmd = {
      token:  window.localStorage.getItem('token'),
      get:    'hostlink_get'
    }




    // Grapf ----------------------------------------------
    this.forceDirectedGraph = (layer) => {
      // https://bl.ocks.org/mbostock/4062045
      var self = this

      var svg = d3.select(this.node),
          width = +svg.attr("width"),
          height = +svg.attr("height");

      svg.selectAll("*").remove()

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().distance(60).id(function(d) { return d.id; }))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(width / 2, height / 2));

      function dragstarted(d) {
        self.setState({clkHostId: d.id})
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      this.props.swgClient.apis.Data[this.apiCmd.get]({token: this.apiCmd.token, layer: layer })
      .then((res) => {

        if (res.status === 200) {
          var graph = res.body

          var link = svg.append("g")
              .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
              .attr("stroke-width", function(d) { return Math.sqrt(d.value); })

          var node = svg.append("g")
              .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
              .attr("r", 8)
              .attr("fill", function(d) { return color(d.group); })
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended))

          node.append("title")
            .text(function(d) { return d.id; })

          var ttt = svg.append("g")
              .attr("class", "texts")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
              .attr("fill", function(d) { return color(d.group); })
              .text(function(d) {
                let sss = d.id.split('.')
                return sss[0];
              })

          simulation
              .nodes(graph.nodes)
              .on("tick", ticked);

          simulation.force("link")
              .links(graph.links);

          function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; })

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })

            ttt
                .attr("x", function(d) { return d.x-5; })
                .attr("y", function(d) { return d.y-10; })
          }

        }
        else {
          console.log(res.body)
        }

      })

    }

  }




  handleClkAction(event) {
    this.forceDirectedGraph(event.target.value)
  }




  render() {
    console.log('HostGraph render')

    var finalTemplate =
    <div className='host-graph-win'>
      <pre className='std-item-header'>HostGraph {this.state.clkHostId}</pre>

      <pre> 
        <button className='get-bttn' onClick={this.handleClkAction} value='L1'>L1</button>
        <button className='get-bttn' onClick={this.handleClkAction} value='L2'>L2</button>
        <button className='get-bttn' onClick={this.handleClkAction} value='L3'>L3</button>
      </pre>

      <svg ref={node => this.node = node} width={800} height={600}></svg>
    </div>

    return finalTemplate

  }

}
