
BaseLook =  {
	
	canvas: {
		attr: {
			//width: "98%",
			//height: "100%",	
			//"min-height": "100%"
		},
		style: {
			"background": Colors.white,
			//"border-style": "solid",
			"border-color": Colors.black,
		}
	},
	
	node: {
		style: {
			init: {
				"fill": Colors.black,
				"stroke": "black",
				"stroke-width": 0,
			},
			normal: {
				"fill": Colors.white,
				// default values
				"stroke": "black",
				"stroke-width": 2,
			},
			mouseover: {
				fill: Colors.red,
				"stroke": "black",
				"stroke-width": 2,
			},
			exit: {
				opacity: 0,	
			},
		},
		attr: {
			init: {
				r: 0	
			},
			normal: {
				r: 15,
				cx : function(v)  { return v.x; },
				cy : function(v) { return v.y; },
			},
			exit: {
				r: 0	
			},
			mouseover: {
				r: 15,
			},
		},
		drag: function(obj, d,i) {
			//nothing to do
		},
	},
	
	edge: {
		attr: {
			"d": function(edge) {
				var line_func = d3.svg.line()
					.x(function(d) { return d.x; })
					.y(function(d) { return d.y; });
				return line_func([edge.segment.source, edge.segment.target]);
			},
		},
		style: {
			init: {
				"stroke": function(e) { 
						return Colors.black;	
				},
				"stroke-width": 2,
				"opacity": 0,
			},
			normal: {
				"stroke": function(e) { 
					return Colors.black;	
				},
				"stroke-width": 3,
				"opacity": function(e) {
					return 1;
				},
			},
			mouseover: {
				"stroke-width" : 8,
			},
			exit :{
				"opacity": 0,	
				"stroke-width": 0,
			}
		}
	},
	
	traj: {
		style: {
			normal: {
				"stroke": function(t) {
					//if (t.seg.isSelected()) {
						return Colors.cyan;
					//} else {
						//return Colors.blue;
					//}
					},
				"stroke-width": 5,
				"opacity": 0.2,
				"fill": "none"
			},
			mouseover: {
				"stroke-width": 5,
			},
			exit: {
				"opacity": 0,
			}
		},
		attr: {
			normal: {
				"d": function(d) {
					var line_func = d3.svg.line()
						.x(function(d) { return d.x; })
						.y(function(d) { return d.y; });
					return line_func([d]);
					//return line_func([d.source, d.target]);
				},
			}
		}
	}
};
