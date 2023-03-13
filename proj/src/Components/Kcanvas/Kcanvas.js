import React from 'react'
import './Kcanvas.css'
import * as d3 from 'd3';
import { data } from 'clusters';
import toast, { Toaster } from 'react-hot-toast';
import data_e from './data';

// import * as clusters from 'clusters'
var clusterMaker = require('clusters');



var Kcanvas = () =>{

    const svgRef = React.useRef();
    // const [ k, setK] = React.useState(2);
    // const [ iteration, setIteration] = React.useState(1);
    // const [ dataSize, setDataSize] = React.useState(10);
    const [ init, setInit ] = React.useState(false)
    const [ currentData, setCurrentData ] = React.useState([])
    const colors = ["#ff9933", "#66ccff", "#cc6699", "#00cc00", "#6600ff", "#E3E3E3","#ff6600", "#FFD8B3", "#F32BE6", "#FFFF3D"];


    var k = 2;
    var iteration = 1;
    var dataSize = 30;
    var offsetX = 0
    var offsetY = 0



    
    const initVis = () => {
        let svg = d3.select(svgRef.current);
        svg.attr('width', 600).attr('height', 600);
        // console.log(svg)
        setInit(true);
        offsetX = svgRef.current.getBoundingClientRect().x
        offsetY = svgRef.current.getBoundingClientRect().y
        // console.log(offsetX, offsetY)
    }

    const generateData = (number) => {
        let data = [];
        for (var i = 0; i < number; i++){
            data.push([Math.ceil(Math.random()*600), Math.ceil(Math.random()*600)])
        }
        // console.log(data);
        return data
    }

    const textShowing = () => {
        document.getElementById("K_showing").innerHTML = k;
        document.getElementById("Iteration_showing").innerHTML = iteration;
        document.getElementById("DataSize_showing").innerHTML = dataSize;
    }



    // function getMousePos(event) {
    //     var e = event || window.event;
        
    //     var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    //     var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    //     var x = e.pageX || e.clientX + scrollX;
    //     var y = e.pageY || e.clientY + scrollY;
    //     //alert('x: ' + x + '\ny: ' + y);
    //     return { 'x': x, 'y': y };
    // }


    const updateVis = (updateDataStatus=false, data_d) =>{
        console.log("K:", k, "Iteartion:", iteration)
        if (k > 10){
            k=10;
            const notify = () => toast.error('Cluster At Most 10');
            notify()
        }else if (k < 1){
            k=1;
            const notify = () => toast.error('Cluster At Least 1');
            notify();
        }

        if (iteration < 1){
            iteration=1;
            const notify = () => toast.error('Iteration At Least 1');
            notify()
        }
        



        clusterMaker.k(k);
        textShowing();
        clusterMaker.iterations(iteration);
        
        if (updateDataStatus){
            clusterMaker.data(generateData(dataSize));
            console.log(generateData(dataSize))
        }else{
            clusterMaker.data(data_d);
        }
        updateCluster(clusterMaker.clusters());
    }

    const updateCentroid = (coord, index) => {
        let svg = d3.select(svgRef.current);
        
        svg.append("circle")        // attach a circle
            .attr("cx", parseInt(coord[0]))           // position the x-centre
            .attr("cy", parseInt(coord[1]))           // position the y-centre
            .attr("r", 8)  
            // .style('fill',"transparent")          
            // .style('stroke-width',4)
            // .style("stroke", colors[index]); 
            // .call(d3.drag().on("drag", function(event){
            //     // console.log("before",coord[0], coord[1])
            //     coord[0]=event.x
            //     coord[1]=event.y
            //     // console.log(event.x, event.y)
                
            //     let current = d3.select(this)
            //     // console.log(current )
            //     current
            //         .attr("cx", coord[0])
            //         .attr("cy", coord[1]) 
          
            //     // updateVis();
            //     console.log("YHW")
            // }))
            .style("fill", colors[index]);

        // svg.selectAll("circle").call(d3.drag()
        //     .on("drag", function(){
        //         var mousePosition = d3.pointer()
        //         console.log(mousePosition)
        //     })
        // );
    }

    const updatePoints = (points, index) => {
        let svg = d3.select(svgRef.current);
        points.forEach(element => {
            svg.append("circle")        // attach a circle
            .attr("cx", parseInt(element[0]))           // position the x-centre
            .attr("cy", parseInt(element[1]))         // position the y-centre
            .attr("r", 5)             // set the radius
            .call(d3.drag().on("drag", function(event){
                // console.log("before", element[0], element[1])
                element[0]=event.x
                element[1]=event.y

                // console.log(event.x, event.y)
                
                let current = d3.select(this)
                // console.log(current )
                current
                    .attr("cx", element[0])
                    .attr("cy", element[1]) 
                updateVis()
            }))
            .style("fill", colors[index]); 
        });

    }

    const updateLinks = (coord, points, index) => {
        let svg = d3.select(svgRef.current);
        points.forEach(element => {
            svg.append("line")
                .style("stroke", colors[index])
                .style("stroke-width", 1)
                .attr("x1", parseInt(coord[0]))
                .attr("y1", parseInt(coord[1]))
                .attr("x2", parseInt(element[0]))
                .attr("y2", parseInt(element[1])); 
        });
    }


    const updateCluster = (data) => {
        // console.log(data)
        let svg = d3.select(svgRef.current);
        svg.selectAll("circle").remove(); 
        svg.selectAll("line").remove();
        var index=0;
        data.forEach(element => {
            updateCentroid(element.centroid, index);
            updatePoints(element.points, index);
            updateLinks(element.centroid, element.points, index);
            index++;
        });
    }





    React.useEffect(()=>{
        if (init === false){
            initVis();
            updateVis(true);
        }else{
            updateVis();
        }
    },[init, currentData])


    

    return(
        <div className='main_container'>
            <Toaster />
            <svg className="svg" ref={svgRef}></svg>
            <div className='menu_bar'>
                <h2>K-Means Clustering Setting</h2>

                
                <p>Current cluster: <span id="K_showing"></span></p>
                <div className="control_bar">
                
                    <button className="button_op" onClick={()=>{k--;updateVis();}}>K - 1</button>
                    <button className="button_op" onClick={()=>{k++;updateVis();}}>K + 1</button>
                </div>


                <p>Current iteration: <span id="Iteration_showing"></span></p>
                <div className="control_bar">
                    <button className="button_op" onClick={()=>{iteration--;updateVis();}}>Iteration - 1</button>
                    <button className="button_op" onClick={()=>{iteration++;updateVis();}}>Iteration + 1</button>
                </div>
                
                <p>Data amount:<span id="DataSize_showing"></span></p>
                <div className="control_bar">
                    <input id="dataSizeInput" defaultValue={dataSize}/>
                    <button className="button_op" onClick={()=>{dataSize=document.getElementById("dataSizeInput").value;updateVis(true)}}>Set Data Size</button>
                
                </div>


                <p>Here provides serval default data mode for better observation</p>

                <div className="control_bar">
                    <button className="button_op" id="button_reset"  onClick={()=>{updateVis(false,data_e.data_1);}}>Data 1</button>
                    <button className="button_op" id="button_reset" onClick={()=>{updateVis(false,data_e.data_2);}}>Data 2</button>
                    <button className="button_op" id="button_reset" onClick={()=>{updateVis(false,data_e.data_3);}}>Data 3</button>
                </div>

                <p>The default setting is 2 clusters and 1 iteration with 30 points. Click  to reset canvas</p>

                <div className="control_bar">
                    <button className="button_op" id="button_reset" onClick={()=>{window.location.reload()}}>Reset to Default</button>
                </div>
            </div>
            
        </div>
    )
}

export default Kcanvas