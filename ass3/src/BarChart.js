class BarChart {

	constructor(_data){
	 	this.margin = {top: 20, right: 20, bottom: 110, left: 40};
        this.width = 600 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;
        this.data = _data;
        this.initVis();

	}



	initVis() {
		let vis = this;

		// Select HTML tag with a specific id ``bar", add a SVG container, and set the corresponding attributes.
		//Then add a group and make a translation (e.g., width and height).(5pts)
		
		// To DO
		vis.svg = d3.select("#bar")
		
		.append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			// .attr("width", vis.width + vis.margin.left + vis.margin.right)
			// .attr("height", 50)
		.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Create scales for x any y (15pts)
		// To DO
		vis.nBin = 351;
		vis.w1 = 0;
		vis.w2 = 70;
		vis.l1 = 0;
		vis.l2 = 1200;


		vis.xScaleFocus = d3.scaleLinear()
			.domain([vis.w1, vis.w2])
			.range([0, vis.width]);

		vis.yScaleFocus = d3.scaleLinear()
			.range([vis.height, 0])
			.domain([vis.l1, vis.l2]);

		// Place Axis (i.e., x-axis on the bottom and y-axis on the left)

		vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus);
		vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus);

		// Create a container in svg for drawing bar chart
		vis.focus = vis.svg.append("g")
		               .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


		// Create Axis
		vis.xAxisFocusG = vis.focus.append('g')
		                     .attr('class', 'axis x-axis')
		                     .attr('transform', `translate(0,${vis.height})`);

		vis.yAxisFocusG = vis.focus.append('g')
		.attr('class', 'axis y-axis');

        // Create a bursh variable (5pts). The "bursh" variable will call brushed function
        // To determine whether a brush action is trigger, we can use d3.event.selection to judge
        //so remember to pass this variable into the brushed function


		// Add brushing
		vis.brush = d3.brushX()             
			// .extent( [ [vis.margin.left,0], [vis.width+vis.margin.left, vis.height+vis.margin.top] ] )  
			.extent( [  [0,400], [800, 800] ] )  
			.on("end", vis.brushed.bind(this)) // bind is used to pass the original this node to backcall function  

		vis.area = vis.svg.append('g')
			.attr("clip-path", "url(#clip)")

		// Create an area generator
		var areaGenerator = d3.area()
			.x(function(d) { return vis.xScaleFocus(d.domain) })
			.y0(vis.yScaleFocus(0))
			.y1(function(d) { return vis.yScaleFocus(d.value) })

		// Add the area
		vis.area.append("path")
			.datum(vis.data)
			.attr("class", "myArea")  
			.attr("fill", "#69b3a2")
			.attr("fill-opacity", .3)
			.attr("stroke", "black")
			.attr("stroke-width", 1)
			.attr("d", areaGenerator )


        // Add label for y-axis
        vis.svg.append("text")
               .attr("class", "ylabel")
               .attr("y", 0 - vis.margin.left+15)
               .attr("x", 0 - (vis.height/2))
               .attr("dy", "1em")
               .attr("transform", "rotate(-90)")
               .style("text-anchor", "middle")
               .text("Number of kWhDelivered");

	}

	updateVis(){
		let vis = this;
		// Create a higtogram (5pts) hint: D3.histogram()
		// To DO
		var histogram = d3.histogram()
			.value(function(d) {return d.kWhDelivered;})
			.domain(vis.xScaleFocus.domain())
			.thresholds(vis.xScaleFocus.ticks(vis.nBin))

		// Create bins from the histogram (5pts)
		// To DO
		vis.bins = histogram(vis.data)

		// Set the domains for x and y axis (8pts).
		// To DO
		// domain for x and y already set in initVis, please refer to line 38 and 43
		vis.renderVis();
	}


	renderVis(){
		let vis = this;

		// draw the bar chart from the generated bins (10 pts)
		// To DO
		vis.svg.selectAll("rect")
			.data(vis.bins)
			.join("rect")
			.attr("x", 1)
			.attr("transform", function(d) { return `translate(${vis.margin.left+vis.xScaleFocus(d.x0)} , ${vis.margin.top+vis.yScaleFocus(d.length)})`})
			.attr("width", function(d) { return vis.xScaleFocus(d.x1) - vis.xScaleFocus(d.x0) - 1})
			.attr("height", function(d) { return vis.height - vis.yScaleFocus(d.length); })
			.style("fill", "#69b3a2")
		// console.log(vis.bins)

		// Place x and y axis on the bottom and left, respectively
        vis.xAxisFocusG.call(vis.xAxisFocus);
        vis.yAxisFocusG.call(vis.yAxisFocus);

        // call the brush function
        vis.area
        	.call(vis.brush)
	}





	brushed(selection){
				let vis = this;
				var selection = d3.event.selection;
		
				if (selection) {
					// clean the original variables
					vis.svg.selectAll("rect").remove(); 
					//Convert given pixel coordinates (range: [x0,x1]) into a kw (domain: [number,number]) (10pts)
					// To DO
					var rate1 = 7/54;
		
					vis.w1 = Math.round((selection[0]-40) * rate1);
					vis.w2 = Math.round((selection[1]-40) * rate1);
		
					var tem = vis.bins.slice(vis.w1/70 * 351, vis.w2/70 * 351);
					// console.log(vis.w1, vis.w2)
					vis.nBin = Math.round((selection[1]-selection[0])/2);
					
					var local_max = 0;
					for (let i = 0; i < tem.length; i++) {
						var tep = tem[i].length;
						if (local_max>=tep) continue;
						else local_max=tep;
					}
					// update the y axis
					vis.l2 = local_max;
					vis.xScaleFocus
						.domain([vis.w1, vis.w2])
						.range([0, vis.width]);
					vis.yScaleFocus
						.range([vis.height, 0])
						.domain([vis.l1, vis.l2]);

			var histogram = d3.histogram()
				.value(function(d) {return d.kWhDelivered;})
				.domain(vis.xScaleFocus.domain())
				.thresholds(vis.xScaleFocus.ticks(vis.nBin))
			vis.bins = histogram(vis.data)

			vis.renderVis();
			}
	}


// 	brushed(selection){
// 		let vis = this;
// 		var selection = d3.event.selection;

// 		if (selection) {
// 			// clean the original variables
// 			vis.svg.selectAll("rect").remove(); 
// 			//Convert given pixel coordinates (range: [x0,x1]) into a kw (domain: [number,number]) (10pts)
// 			// To DO
// 			var rate1 = 7/54;

// 			vis.w1 = Math.round((selection[0]-40) * rate1);
// 			vis.w2 = Math.round((selection[1]-40) * rate1);

// 			var tem = vis.bins.slice(vis.w1/70 * 351, vis.w2/70 * 351);
// 			// console.log(vis.w1, vis.w2)
// 			vis.nBin = Math.round((selection[1]-selection[0])/2);
			
// 			var local_max = 0;
// 			for (let i = 0; i < tem.length; i++) {
// 				var tep = tem[i].length;
// 				if (local_max>=tep) continue;
// 				else local_max=tep;
// 			}
// 			// update the y axis
// 			vis.l2 = local_max;

// 			vis.xScaleFocus
// 				.domain([vis.w1, vis.w2])
// 				.range([0, vis.width]);

// 			vis.yScaleFocus
// 				.range([vis.height, 0])
// 				.domain([vis.l1, vis.l2]);
// 			// vis.area.select(".brush").call(brush.move, null);

// 			// Update x-axis  accordingly (4pts)
// 			// To DO
// 			// x-axis already updated before, please refer to line 160 and 161


// 	// Based on the selected region to filter the bins (5pts) Hint: use filter() function
// 	// To Do
// 	// i use for loop to filter the max y length, please refer to line 167~174
// 	var histogram = d3.histogram()
// 		.value(function(d) {return d.kWhDelivered;})
// 		.domain(vis.xScaleFocus.domain())
// 		.thresholds(vis.xScaleFocus.ticks(vis.nBin))
// 	vis.bins = histogram(vis.data)
// 	//Redraw the bar chart (10pts)
// 	// To DO
// 	vis.renderVis();

//     // Update y-axis accordingly (5pts)
//     // To DO
// 	// the y-axis already updated before, please refer to line 174

//     // vis.xAxisFocusG.call(vis.xAxisFocus);
//     // vis.yAxisFocusG.call(vis.yAxisFocus);

// 	}
//   }

}