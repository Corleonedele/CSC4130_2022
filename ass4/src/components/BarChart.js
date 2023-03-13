import React from 'react';
import * as d3 from 'd3';
import { tree } from 'd3';

const BarChart = ({
    config:{
        colorScale,
        containerWidth,
        containerHeight,
        margin
    },
    data,
    setFilterCategory,
}) => {

    const svgRef = React.useRef();
    const chart = React.useRef();
    const xAxisG = React.useRef();
    const yAxisG = React.useRef();
    const bars = React.useRef();

    // These calculated intermidiate data should be
    // cleaned up to React-styled code.
    // that is, to combine all below refs and the "initialized" state into a single state
    const _colorScale = React.useRef();
    const width = React.useRef();
    const height = React.useRef();
    const xScale = React.useRef();
    const yScale = React.useRef();
    const xAxis = React.useRef();
    const yAxis = React.useRef();
    const _containerWidth = React.useRef();
    const _containerHeight = React.useRef();
    const [ initialized, setInitialized ] = React.useState(false)

    // Cannot dynamically change. If dynamically chaning is needed, these code can be modified.
    
    const _margin = React.useRef();

    const orderedKeys = ['Easy', 'Intermediate', 'Difficult'];
    var singleFC = [];
    // const [ singleFC, setSingleFC ] = React.useState([])
    var E_t = "#6B6D87";
    var E_f = "#a0a1e2";
    var E_status = true;
    var I_t = "#54799B";
    var I_f = "#6495ed";
    var I_status = true;
    var D_t = "#068613";
    var D_f = "#04ea17"
    var D_status = true;
  

    // Intialize the bar plot (5pts)
    React.useEffect(()=>{
        initVis();
    },[])
    // To DO

    // Update rendering result (5pts)
    React.useEffect(()=>{
   
        updateVis();

    },[initialized, data])
    // To DO


    const initVis = () => {
        let svg = d3.select(svgRef.current);
        _containerWidth.current = containerWidth || 260;
        _containerHeight.current =  containerHeight || 300;
        svg.attr('width', _containerWidth.current).attr('height', _containerHeight.current);
        _margin.current = margin || {top: 25, right: 20, bottom: 20, left: 40};
        width.current = _containerWidth.current - _margin.current.left - _margin.current.right;
        height.current = _containerHeight.current - _margin.current.top - _margin.current.bottom;
        xScale.current = d3.scaleBand().range([0, width.current]).paddingInner(0.2);
        yScale.current = d3.scaleLinear().range([height.current, 0]);
        xAxis.current = d3.axisBottom(xScale.current).ticks(['Easy', 'Intermediate', 'Difficult']).tickSizeOuter(0);
        yAxis.current = d3.axisLeft(yScale.current).ticks(6).tickSizeOuter(0);
        chart.current = svg.append('g').attr('transform', `translate(${_margin.current.left},${_margin.current.top})`);
        xAxisG.current = chart.current.append('g').attr('class', 'axis x-axis').attr('transform', `translate(0,${height.current})`);
        yAxisG.current = chart.current.append('g').attr('class', 'axis y-axis');
        svg.append('text').attr('class', 'axis-title').attr('x', 0).attr('y', 0).attr('dy', '.71em').text('Trails');

        _colorScale.current = d3.scaleOrdinal()
            .range(['#a0a1e2', '#6495ed', '#04ea17']) // light green to dark green
            .domain(['Easy','Intermediate','Difficult']);

        setInitialized(true);
    }

    const updateVis = () => {
   
        
        const aggregatedDataMap = d3.rollups(data, v => v.length, d => d.difficulty);
        let aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));
        aggregatedData = aggregatedData.sort((a,b) => {
            return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
        });
        let colorValue = d => d.key;
        let xValue = d => d.key;
        let yValue = d => d.count;
        xScale.current.domain(aggregatedData.map(xValue))
        yScale.current.domain([0, d3.max(aggregatedData, yValue)]);


        // renderVis()
        bars.current = chart.current.selectAll('.bar')
        .data(aggregatedData, xValue)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale.current(xValue(d)))
        .attr('width', xScale.current.bandwidth())
        .attr('height', d => height.current - yScale.current(yValue(d)))
        .attr('y', d => yScale.current(yValue(d)))
        .attr('fill', d => _colorScale.current(colorValue(d)))
        .on('click', function(event, d) {
            // Check if current category is active and toggle class (5pts)
            if (d.key === 'Easy'){
                if (E_status === true){
                    E_status = false;
                    // pop from filterCategory
                    singleFC.pop("Easy")
                    // setSingleFC(singleFC.pop("Easy"))
                }else{
                    E_status = true;
                    // push to filterCategory
                    singleFC.push("Easy")
                    // setSingleFC(singleFC.push("Easy"))
                }
            }else if (d.key === 'Intermediate'){
                if (I_status === true){
                    I_status = false;
                    // pop from filterCategory
                    singleFC.pop("Intermediate")
                    // setSingleFC(singleFC.pop("Intermediate"))
                }else{
                    I_status = true;
                    // push to filterCategory
                    singleFC.push("Intermediate")
                    // setSingleFC(singleFC.push("Intermediate"))
                }
            }else{
                if (D_status === true){
                    D_status = false;
                    // pop from filterCategory
                    singleFC.pop("Difficult")
                    // setSingleFC(singleFC.pop("Difficult"))
                }else{
                    D_status = true;
                    // push to filterCategory
                    singleFC.push("Difficult")
                    // setSingleFC(singleFC.push("Difficult"))
                }
            }
            
            if (E_status === true){
                E_t = "#6B6D87";
                E_f = "#a0a1e2";
            }else{
                E_t = "#a0a1e2";
                E_f = "#6B6D87";
            }
            if (I_status === true){
                I_t = "#54799B";
                I_f = "#6495ed";
            }else{
                I_t = "#6495ed";
                I_f = "#54799B";
            }

            if (D_status === true){
                D_t = "#068613";
                D_f = "#04ea17"
            }else{
                D_t = "#04ea17";
                D_f = "#068613"
            }


            if (E_status === true){
                
                if (I_status === true){
                    // [I_f, I_t] = [I_t, I_f];
                    if (D_status === true){
                        setFilterCategory(["Easy","Intermediate", "Difficult"]);
                    }else{
                        setFilterCategory(["Easy","Intermediate"]);
                    }
                }else{
                    if (D_status === true){
                        setFilterCategory(["Easy", "Difficult"]);
                    }else{
                        setFilterCategory(["Easy"]);
                    }
                }
            }else{

                if (I_status === true){
                    if (D_status === true){
                        setFilterCategory(["Intermediate", "Difficult"]);
                    }else{
                        setFilterCategory(["Intermediate"]);
                    }
                }else{
                    if (D_status === true){
                        setFilterCategory([, "Difficult"]);
                    }else{
                        setFilterCategory([]);
                    }
                }
            }


            // Get the names of all active/filtered categories (10pts)

            // To DO
           
            
            // Change parent node's React State with the selected category names (5pts)

            // To DO
            
        })



        bars.current = chart.current.selectAll('.bar')
        .filter(function (d, i) { return i === 0;})
        .on("mouseover", function(d) {
            d3.select(this).attr("r", 10).style("fill", E_t);
        })   
        .on("mouseout", function(d) {
            d3.select(this).attr("r", 10).style("fill", E_f);
            
        })  

        bars.current = chart.current.selectAll('.bar')
        .filter(function (d, i) { return i === 1;})
        .on("mouseover", function(d) {
            d3.select(this).attr("r", 10).style("fill", I_t);
        })   
        .on("mouseout", function(d) {
            d3.select(this).attr("r", 10).style("fill", I_f);
        })  

        bars.current = chart.current.selectAll('.bar')
        .filter(function (d, i) { return i === 2;})
        .on("mouseover", function(d) {
            d3.select(this).attr("r", 10).style("fill", D_t);
        })   
        .on("mouseout", function(d) {
            d3.select(this).attr("r", 10).style("fill", D_f);
        })  


        // .on('mouseover', function(event, d){
            
        //     // console.log(chart.current.selectAll("rect.bar").nodes()[0])
        //     // console.log(d)
        //     // console.log(chart.current.select(d.key))

        //     // chart.current.select(d.key).attr("fill", "#ffffff")
            
        //     // this.props.attr("fill", "#ffffff")
            
        //     chart.current.select(chart.current.selectAll("rect.bar").nodes())
        //         .filter(function (d, i) {
        //             if (i === 2){
        //                 return d
        //             }
        //         })
        
        //         // .filter(":nth-child(even)") 

        
        // })
        // .on("mouseout", function(event, d){
        //     chart.current.selectAll("rect.bar")
        //     .style('fill', d => _colorScale.current(colorValue(d)))
        // });


        xAxisG.current.call(xAxis.current);
        yAxisG.current.call(yAxis.current);
    }




    return (
        <svg ref={svgRef}></svg>
    );
}

export default BarChart;