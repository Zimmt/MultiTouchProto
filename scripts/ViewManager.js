
function InteractionView(svg, look) {
	this.svg = svg;
	this.look = look;
	this.trajectories = this.svg.append("g").attr("id", "trajectories");

	var line_func = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });

	this.enterTrajactory= function(path) {
		var self = this;
		var t = this.trajectories.selectAll("path").data([path], function(p) { return p.id; });
		var line_func = d3.svg.line()
						.x(function(d) { return d.x; })
						.y(function(d) { return d.y; });
		t.enter()
			.append("path")
			.attr("d", line_func(path.points))
			.style(this.look.traj.style.normal);
			//.transition("trajSeg").duration(500) 
			//.style(this.look.traj.style.exit); 
	}

	this.updateTrajactory = function(path) {
		//console.log("------------");
		var t = this.trajectories.selectAll("path").data([path], function(p) { return p.id; });
		t.attr("d", line_func(path.points)).style(this.look.traj.style.normal);
	}
}


function GraphView(svg, look) {
	this.svg = svg;
	this.look = look;
	this.nodes = this.svg.append("g").attr("id", "nodes");
	this.nodeData = [];

	this.addNode = function(x,y) {
		this.nodeData.push({id: this.nodeData.length, x: x, y: y});
		this.nodes.selectAll("circle").data(this.nodeData, function(v) {return v.id;})
			.enter()
			.append("circle")
			.attr(this.look.node.attr.init)
			.style(this.look.node.style.init)
			.transition("nodes").duration(150)
			.attr(this.look.node.attr.normal)
			.style(this.look.node.style.normal);
	}
	
	this.updateNodes = function() {
		this.nodes.selectAll("circle").data(this.nodeData, function(v) {return v.id;})
		.attr(this.look.node.attr.normal)
		.style(this.look.node.style.normal);
	}

	this.getNodeInReach = function(pos, rr) {
		return this.nodeData.find(function(v) {
			return (Math.abs(pos[0] - v.x) < rr && Math.abs(pos[1] - v.y) < rr);
		}, this);
	}
	
	

}




function ViewManager(look) {
	var self = this;
	
	this.look = look;
	this.svg = d3.select("#graph").append("svg") //TODO listen on group?
		.attr("id", "canvas")
		.attr(this.look.canvas.attr)
		.style(this.look.canvas.style)
		.on("click", function(d,i) {
			console.log("click " + d3.event.pageX + " "+d3.event.pageY);
			self.addNode(d3.event.pageX, d3.event.pageY);
		});
	
	this.interactionView = new InteractionView(this.svg, this.look);
	this.graphView = new GraphView(this.svg, this.look);
	
	this.addNode = function(x, y) {
		this.graphView.addNode(x,y);
	}
	
	this.dragcount = 0;
	this.reachRadius = 20;

	this.drag = d3.behavior.drag()
			.on("dragstart", function(d,i) {
				var p = d3.mouse(self.svg.node());
				console.log("start " + p[0] + " " + p[1] );
				self.dragcount++;
			})
			.on("drag", function(d,i) {
				var p = d3.mouse(self.svg.node());
				console.log("move " + p[0] + " " + p[1] );
				
				if (self.dragcount > 1) {
					console.log("multitouch");
					
				} else {
					if (self.dragcount != 1) console.log("wrong dragcount?");
					console.log("move vertex (if exisiting)");
					
					var v = self.graphView.getNodeInReach(p, self.reachRadius);
					if (v !== undefined) {
						v.x += d3.event.dx;
	        	v.y += d3.event.dy; 
						self.graphView.updateNodes();
					}
				}
			})
			.on("dragend", function(d,i) {
				var p = d3.mouse(self.svg.node());
				console.log("end " + p[0] + " " + p[1] );
				
				self.dragcount--;
			});

		this.svg.call(this.drag);

}
