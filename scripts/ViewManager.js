
function InteractionView(svg, look) {
	
	this.svg = svg;
	this.look = look;
	this.trajectories = this.svg.append("g").attr("id", "trajectories");

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
			.attrs(this.look.node.attr.normal)
			.styles(this.look.node.style.normal);
	}
	
	this.updateNodes = function() {
		this.nodes.selectAll("circle").data(this.nodeData, function(v) {return v.id;})
		.attrs(this.look.node.attr.normal)
		.styles(this.look.node.style.normal);
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
	
	this.svg = d3.select("#graph").append("svg")
		.attr("id", "canvas")
		.attrs(this.look.canvas.attr)
		.styles(this.look.canvas.style);
	
	this.interactionView = new InteractionView(this.svg, this.look);
	this.graphView = new GraphView(this.svg, this.look);
	
	this.doubleGesture = undefined;
	
	this.dragcount = 0;
	this.dragEps = 10;
	
	this.singleDrag = function(d, mousePos) {
		console.log("singleDrag");
		var p = d3.mouse(self.svg.node());
		
		var v = self.graphView.getNodeInReach(p, self.reachRadius);
		if (v !== undefined) {
			console.log("move vertex");
			v.x += d3.event.dx;
	  	v.y += d3.event.dy; 
			self.graphView.updateNodes();
		}
	}
	
	this.doubleDrag = function(d, mousPos) {
		console.log("doubleDrag");
		var p = d3.mouse(self.svg.node());
		// TODO: nothing detected when one finger fix and the other moves
		// only automatic zoom is performed
		
		if (d3.event.dx < self.dragEps && d3.event.dy < self.dragEps) { // fix position
			if (self.doubleGesture === undefined) {
				self.doubleGesture = {name: "fix", pos: p, id: d3.event.identifier};
				
			} else if (self.doubleGesture.name == "fix" 
				&& self.doubleGesture.id != d3.event.identifier) {
					self.doubleGesture = {name: "doubleFix", 
						pos1: self.doubleGesture.pos, id1: self.doubleGesture,
						pos2: p, id2: d3.event.identifier};
				
			} else if (self.doubleGesture.name == "move"
				&& self.doubleGesture.id != d3.event.identifier) {
					self.doubleGesture = {name: "rotate", 
						center: p, idc: d3.event.identifier,
						rotPos: self.doubleGesture.pos, idr: self.doubleGesture.id};
			
			} // for doubleFix, doubleMove or rotate 
			  //nothing is to do as the position didn't change that much
			
		} else { // moving position
			if (self.doubleGesture === undefined) {
				self.doubleGesture = {name: "move", pos: p, id: d3.event.identifier};
				
			} else if (self.doubleGesture.name == "fix") {
				if (self.doubleGesture.id != d3.event.identifier) {
						self.doubleGesture = {name: "rotate", 
							center: self.doubleGesture.pos, idc: self.doubleGesture,
							rotPos: p, idr: d3.event.identifier};
				} else {
					self.doubleGesture.name = "move";
					self.doubleGesture.pos = p;
				}
				
			} else if (self.doubleGesture.name == "move"
				&& self.doubleGesture.id != d3.event.identifier) {
					self.doubleGesture = {name: "doubleMove", 
						pos1: p, id1: d3.event.identifier,
						pos2: self.doubleGesture.pos, id2: self.doubleGesture.id};
						
			} else if (self.doubleGesture.name == "doubleFix") {
				if (self.doubleGesture.id1 == d3.event.identifier) {
					self.doubleGesture = {name: "rotate",
						center: self.doubleGesture.pos2, idc: self.doubleGesture.id2,
						rotPos: p, idr: d3.event.identifier};
						
				} else if (self.doubleGesture.id2 == d3.event.identifier) {
					self.doubleGesture = {name: "rotate",
						center: p, idc: d3.event.identifier,
						rotPos: self.doubleGesture.pos2, idr: self.doubleGesture.id2};
						
				} else {
					condole.log("there are more than two drag gestures");
				}
			} else if (self.doubleGesture.name == "rotate") {
				if (self.doubleGesture.idr == d3.event.identifier) {
					self.doubleGesture.rotPos = p;
				} else if (self.doubleGesture.center == d3.event.identifier) {
					self.doubleGesture = {name: "doubleMove",
						pos1: self.doubleGesture.rotPos, id1: self.doubleGesture.idr,
						pos2: p, id2: d3.event.identifier};
				} else {
					console.log("more thatn two drag gestures...");
				}
			} else {
				console.log("There is something wrong with the identifiers");
			}
		}
		console.log("double gesture: " + self.doubleGesture.name);
	}
	
	this.dragcount = 0;
	this.reachRadius = 20;

	this.drag = d3.drag()
	
			.filter(function() {
				// maybe this is useful?
				return !d3.event.button; // default
				// ignores mousedown events on secondary buttons
				// events that don't pass the filter shouldn't create a drag behavior
			})
	
			.on("start", function(d,i) {
				//console.log("start " + d3.event.identifier);
				self.dragcount = d3.event.active + 1; // d3.event has exposes several useful fields...

				var p = d3.mouse(self.svg.node());
				var v = self.graphView.getNodeInReach(p, self.reachRadius);
				if (v === undefined) {
					console.log("add node at pos " + p[0] + " " + p[1]);
					self.graphView.addNode(p[0], p[1]);
				}
			})
			
			.on("drag", function(d,i) {
			//	console.log("drag " + d3.event.type);
				if (self.dragcount == 1) {
					self.singleDrag(d, d3.mouse);
				} else if (self.dragcount == 2) {
					self.doubleDrag(d, d3.mouse);
				}
			})
			
			.on("end", function(d,i) {
				this.dragcount = d3.event.active; // number of active drag gestures not including this one
			});

		this.svg.call(this.drag);
}
