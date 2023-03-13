import logo from './logo.svg';
import './App.css';
import BarChart from './components/BarChart';
import * as d3 from 'd3';
import React from 'react';
import ScatterPlot from './components/ScatterPlot';
import { render } from '@testing-library/react';
import { upload } from '@testing-library/user-event/dist/upload';


function App() {



    // Create three states, i.e., data, selectedData, and filterCategory
    const [ data, setData ] = React.useState("")
    const [ singleData, setSingleData] = React.useState([])
    const [ selectedData, setSelectedData ] = React.useState("")
    const [ filterCategory, setFilterCategory ] = React.useState([])
    const [ init, setInit ] = React.useState(false)

    // To DO

    const colorScale = d3.scaleOrdinal()
        .range(['#d3eecd', '#7bc77e', '#2a8d46']) 
        .domain(['Easy','Intermediate','Difficult']);


    const loadData = () => {
        setInit(true);

        d3.csv('./vancouver_trails.csv') 
        .then(_data => {
            setData(_data.map(d => {
                d.time = +d.time;
                d.distance = +d.distance;
                return d
            }));
        })

    }

    const updateData = (data, filterCategory ) => {
        setSingleData([])


        for (var i = 0; i < data.length; i++){
            if (filterCategory.includes(data[i].difficulty)){
                singleData.push(data[i])
            }
        }


    }
    

    React.useEffect(()=>{
        loadData();

        setSelectedData(data);

        setFilterCategory(["Easy","Intermediate", "Difficult"])
  
        updateData(data, filterCategory);
    },[init])

    // Use useEffect to render and update visual results when dependency/dependencies change (30pts)
    React.useEffect(()=>{

        updateData(data, filterCategory);
        setSelectedData(singleData);
     

    },[filterCategory, data])
    // To DO


    return (
        <div className='Container'>
        <h1 className='head'> Multiple-View Interaction </h1>
        <div className="App">
        <ScatterPlot config={colorScale} data = {selectedData}/>
        <BarChart config={colorScale} data = {data} setFilterCategory={setFilterCategory} />
        </div>
        </div>
    );
}

export default App;
