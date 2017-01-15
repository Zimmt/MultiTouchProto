
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
	}
	, node: {
		style: {
			init: {
				"fill": Colors.black,
				"stroke": "black",
				"stroke-width": 0,
			},
			normal: {
				"fill": function(v) { 
					//if (v.node.p("selected").value) {
						return Colors.white;
					//} else {
						//return Colors[v.node.p("color").value];	
					//}
				}, // default values
				"stroke": "black",
				"stroke-width": 2,
				"opacity": function(v) {
					//if (v.p("invisible") !== undefined && v.p("invisible").value) {
					//	console.log("invisible!");
					//	return 0;
					//} else 
					//if (v.node.p("potentialRemove").value) {
					//    return 0.5;
					//} else {
					//    return 1;
					//}
				},
				//"filter": "url(#drop-shadow)"
			},
			temporary: {
				"fill": Colors.blue,
				"stroke": "black",
				"stroke-width": 2,
				"opacity": 0.5
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
				cx : function(v)  { return v.point.x; },
				cy : function(v) { return v.point.y; },
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
				//var shorten = function(source, target) :any[] {
				//    var vx = target.x - source.x;
				//    var vy = target.y - source.y;
				//    var l = Math.sqrt(vx*vx + vy*vy);
				//    if (l <= 40) { // TODO use radius from interaction model
				//        return [{x: 0, y: 0}, {x: 0, y: 0}];
				//    }
				//    var vx = vx / l; // norm
				//    var vy = vy / l;
				//    var new_sx = source.x + (vx*20);
				//    var new_sy = source.y + (vy*20);
				//    var new_tx = target.x - (vx*20);
				//    var new_ty = target.y - (vy*20);
				//    return [{x: new_sx, y: new_sy}, {x: new_tx, y: new_ty}];
				//};
				//var short_edge = shorten(edge.source, edge.target);
				
				//return line_func(short_edge);
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
				//"filter":"url(#drop-shadow)",
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
			temporary: {
				"stroke": Colors.black,
				"stroke-width": 3,
				"opacity": 0.5
			},
			mouseover: {
				"stroke-width" : 8,
			},
			exit :{
				"opacity": 0,	
				"stroke-width": 0,
			}
		},
	}
	//touch: {
	//    style: {
	//        init: {
	//            "fill": Colors.blue,
	//            "stroke": "blue",
	//            "stroke-width": 2,
	//            "opacity": 1
	//        },
	//        normal: {
	//            "fill": Colors.blue, // default values
	//            "stroke": "blue",
	//            "stroke-width": 2,
	//            "opacity": 0.2
	//         }
	//    },
	//    attr: {
	//        init: {
	//            r: 0	
	//        },
	//        normal: {
	//            r: 40, //TODO use radius from interaction model
	//            cx : function(t)  { return t.x; },
	//            cy : function(t) { return t.y; },
	//        },
	//        exit: {
	//            r: 0	
	//        }
	//    }
	//},
	, traj: {
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
	//trajP: {
	//    style: {
	//        normal: {
	//            "fill": Colors.blue, // default values
	//            "stroke-width": 2,
	//            "opacity": 0.2,
	//        },
	//        mouseover: {
	//             "opacity": 0.5,
	//        }
	//    },
	//    attr: {
	//        normal: {
	//            r: 5,
	//            cx : function(t)  { return t.x; },
	//            cy : function(t) { return t.y; },
	//        },
	//        mouseover: {
	//            r: 10,
	//        }
	//    }
	//},
	
	//alignLine: {
	//    style: {
	//        normal: {
	//            "stroke": Colors.blue,
	//            "stroke-width": 2,
	//            "opacity": 0.2,
	//        }
	//    },
	//    attr: {
	//        normal: {
	//            "d": function(d) {
	//                var line_func = d3.svg.line()
	//                    .x(function(d:any) { return d.x; })
	//                    .y(function(d:any) { return d.y; });
	//                var endless = function(source, target) : any[] {
	//                    //TODO: Make following code work. Do not use code with gradient.
	//                    [>*const eps = 0.0000001
	//                    assert(Math.abs(target.x - source.x) < eps || target.y == source.y, "BaseLook: alignment wrong :(" + source.x + " " + target.x);
	//                    if (target.x == source.x) {
	//                        return [{x: source.x, y: source.y+10000}, 
	//                                        {x: target.x, y: target.y-10000}];
	//                    } else if(target.y == source.y) {
	//                         return [{x: source.x+10000, y: source.y}, 
	//                                        {x: target.x-10000, y: target.y}];
	//                    }**/
						
	//                    var gradient = (target.y - source.y) / (target.x - source.x);
	//                    if (isNaN(gradient) || Math.abs(gradient) == Infinity) { // x-coordinates equal
	//                        return [{x: source.x, y: source.y + 10000}, 
	//                                        {x: target.x, y: target.y - 10000}];
	//                    } else {
	//                        var off = 10000;
	//                        var l = [{x: source.x + off, y: source.y + off * gradient}, 
	//                            {x: target.x - off, y: target.y - off * gradient}];
	//                        return l;
	//                    }
	//                };
	//                var endless_line = endless(d.source, d.target);
				
	//                return line_func(endless_line);
	//            },
	//        }
	//    }
	//},
};
