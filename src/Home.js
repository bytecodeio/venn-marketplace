
import React, { Fragment, useEffect, useMemo, useState, useLayoutEffect, useRef } from "react";
import * as venn from "venn.js";
import * as d3 from "d3";
import 'regenerator-runtime/runtime';
import "bootstrap/dist/css/bootstrap.min.css";

import { Row, Col, Container, Button, Overlay, OverlayTrigger, Popover, PopoverBody, PopoverHeader, ProgressBar} from 'react-bootstrap';
import styled from "styled-components";

const Styles = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:wght@100;300;400;500;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,100;1,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital,wght@0,300;0,400;0,500;0,600;1,100;1,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,100;1,700&display=swap');
  @import url("https://kit-pro.fontawesome.com/releases/v5.15.1/css/pro.min.css");

  .lightBubble{
    background: #f7f8f9;
    padding:1em;
    border-radius: .5rem;
    display: flex;
    flex-direction: column;
    min-width:100%;
  }
  p{
    font-weight: 500
  }
  p.large{
    font-size: 22px;
    margin-top:0
  }

  p.small{
    font-size: 12px;
    font-weight: 300;
  }

  .whiteAcross{
    background: white;
    width:100%;
    display: flex;
    justify-content: space-between;
    border-radius: .4em;
    box-shadow: 0px 30px 60px rgba(0, 19, 87, 0.04);
    padding:.6em;
    margin-bottom:1em;
    align-items: center;
  }
  .whiteAcross p{
    color:black
  }
  .upDown{
    display: flex;
    flex-direction: column;
    font-family: 'Roboto', sans-serif;
    border: 1px solid black;
    max-width: 490px;
    margin: 2em auto 0 auto;
    max-height: 498px;
  }
  .dots p{
    color:#637087 !important
  }
  .varianceBubble.neutral i{
  display: none
  }
  .upDown.unsetWidth{
      max-width: 100%;
  }
  :-webkit-scrollbar-track {
   border-radius: 0.125rem;
   background-color: lightgray;
   height: 0px;
  }
  ::-webkit-scrollbar {
   width: 0;
   border-radius: 0;
     height: 0px;
  }
  ::-webkit-scrollbar-thumb {
      height: 0px;
  }
  p{
    color:#14171b
  }
  .dots p i{
    margin-right: 5px;
   }

  #venn{
    background: white;
    display:flex;
    justify-content:center;
    padding:0em 0em 3em 0em;
    width:100%;
  }
  .venn-intersection path{
    fill-opacity: .2 !important;
  }

  svg path {
      stroke: white;
      stroke-width: 0px;
  }

  svg text {
      fill: white;
      font-size: 14px;
  }
  .overlap{
    background:#002169;
    padding: .5em 1em;
    border-radius: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    margin-bottom: 3em;

  }
  .overlap p{
    color:white !important
  }

  .overlap h3{
    color:white !important
  }

  .black-text{
    font-size:17px !important;
    fill:black !important
  }

  .venn-intersection .black-text{
    display:none
  }

  .across{
    display:flex;
    justify-content:space-between;
    margin-top:3%;
    margin-left:-3vw !important
  }
  .across .halfWidth{
    width:50%;
    display:flex;
    flex-direction:column;
  }
  .across .halfWidth .overlap{
    margin-bottom:1.5em
  }
  .across #venn{
    padding-bottom:0em !important
  }

  #title{
    font-weight: 600;
    margin-bottom:-1em
  }

  `;


export const Home = ({ data, config, queryResponse, details, bodyStyle}) => {

var { investment, chooseLabel,  numbers, reachPercentage, writeTitle, writeTitle2, titleColor, bodyStyle, color_title, across, hideTitle, align, size, colors, bubbleColor, hideOverlap, changeRightTitle } = config;

const { dimension_like, measure_like, pivots } = queryResponse.fields;
const fields = {
  dimensions: dimension_like.map((d) => d.name),
  dimensionsLabel: dimension_like.map((d) => d.label_short),
  measures: measure_like.map((m) => m.name),
  measuresLabel: measure_like.map((m) => m.label_short),
  pivots: pivots?.map((p) => p.name),
};

const dimensionName = fields.dimensions[0];

  const Content = config.reachPercentage.split(",").map((d, i) => ({
  reachPercentage: d,
  numbers: config.numbers.split(",")[i],
  investment: config.investment.split(",")[i],

  }))


if(reachPercentage.length === 0 && numbers.length === 0 && investment.length === 0) {

  return (
  <>
    <p>*Please select each dropdown under Values in the Options in order to display the visual.</p>
    <p>*Then select Venn Background Colors from the color palette under Style in the Options in order to display the visual.</p>
  </>
)

}

const filteredEntries = Object.entries(data)
const filteredObject = Object.fromEntries(filteredEntries);
const findSingleValues = data
const arrayOfObjects = data
var filteredArray = arrayOfObjects


function sortByMediaTypeLength(data) {
  return Object.values(data).sort((objA, objB) => {
    const mediaTypeA = objA[dimensionName].value;
    const mediaTypeB = objB[dimensionName].value;

    const isSingleA = !mediaTypeA.includes(",");
    const isSingleB = !mediaTypeB.includes(",");

    if (isSingleA && !isSingleB) return -1;
    if (!isSingleA && isSingleB) return 1;

    return mediaTypeA.length - mediaTypeB.length;


  });
}



const sortedData = sortByMediaTypeLength(filteredArray);

function getSingleValueLengths(data) {
  return data.filter(item => {
    const value = item[dimensionName].value;
    return !value.includes(',') && value.length === value.trim().length;
  }).map(item => item[dimensionName].value.length);
}

const singleValueLengths = getSingleValueLengths(sortedData);
const numberOfSingleValues = singleValueLengths.length;

var filteredArray = sortedData;

var setStrings = filteredArray.map((item, i) =>(
    item[investment].value

))

const filteredArray2 = setStrings.map(item => item)
  .filter(item => !item.includes(","));


var setNumbers = filteredArray.map((item, i) =>(
    item[numbers].value
))

var setSecondNumbers = filteredArray.map((item, i) =>(
    item[reachPercentage].value
))



const fixedArray = setStrings.map(item =>
  item.split(',')
    .map(subItem => `${subItem.trim()}`)
);


 const [totalIntersectionCount, setTotalIntersectionCount] = useState(0);
 const [sizes, setSizes] = useState([]);

const background = config.colors

const dotColors = config.colors.slice(0, numberOfSingleValues);


useEffect(() => {

function combineArraysToObject(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    throw new Error('Both arguments must be arrays');
  }

  if (array1.length !== array2.length) {
    throw new Error('Arrays must have the same length');
  }

  return array1.map((value1, index) => {
    return { sets: value1, size: array2[index] };
  });
}

const array1 = fixedArray;
const array2 = setNumbers;


var combinedObject = combineArraysToObject(array1, array2);

var bigObject = combinedObject.sort()

const findBiggestSetAndSize = (data) => {

  let biggestSet = [];
  let biggestSetSize = 0;

  for (const item of data) {

    if (item.sets.length > biggestSet.length) {
      biggestSet = item.sets;
      biggestSetSize = item.size;
    }
  }

  return { biggestSet, biggestSetSize };
};

const result = findBiggestSetAndSize(bigObject);
const intersectionCount = result.biggestSetSize < 1 ? result.biggestSetSize.toFixed(1) : result.biggestSetSize.toFixed(0);
setTotalIntersectionCount(intersectionCount);
var bigObject = bigObject

const singleSetSizes = bigObject.filter(obj => obj.sets.length === 1)
  .map(obj => obj.size);

setSizes(singleSetSizes)

const buildVenn = venn.VennDiagram().height(350);

const data2 = bigObject;


const vennChart = d3.select("#venn")
.datum(bigObject);

buildVenn(vennChart);

const circleColors =
colors && dotColors.length > 0
   ? dotColors.map((color, index) => color)
   : ["#12d465", "#ffda00", "#0066ff", "#e22bb7", "#6fd0e9"];

d3.selectAll(".venn-area.venn-circle path")
  .style("fill", (d, i) => circleColors[i % circleColors.length]);


  vennChart
    .selectAll("path")
    .style("fill-opacity", "1")
    .style("mix-blend-mode", "none");

    const secondClass = 'secondary-class';

    d3.selectAll('.venn-circle')
      .classed(secondClass, true);


    d3.selectAll(".venn-area").selectAll("text")

    .filter(function(d) {
      return !d.isIntersection;
    })
    .attr("class", function(d, i) {
      let className = "";
      if (d.category === "A") {
        className = "black-text";
      } else {
        className = "black-text";
      }
      return className;
    })


  let tooltip = d3.select("body").append("div").attr("class", "venntooltip");
  d3.selectAll(".venn-area")
    .on("mouseover", function (d, i) {

      let node = d3.select(this).transition();
      node
        .select("path")
        .style("fill-opacity", 0.7)

    })
    .on("mousemove", function (event, d) {

      tooltip
         .transition()
         .duration(400)
         .style("opacity", 1)
         .style("display", "inline-block")
         .text(`${d.sets}, ${Math.round(d.size).toFixed(0)}%`);

      tooltip
        .style("position", "absolute")

        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (d, i) {
      let node = d3.select(this).transition();
      tooltip.transition().duration(400).style("opacity", "0");
      d3.select(this).transition("tooltip").duration(400);
      node.select("path").style("fill-opacity", 1).style("stroke-width", "0");
      node
        .select("text")
        .style("font-weight", "100")
        .style("font-size", "24px");
    });
}, [data]);


  return (
  <>


  <Styles>
      <div id="vis-wrapper" style={{fontFamily: bodyStyle ? bodyStyle : "'Roboto'"}}>
      <Container fluid className="mb-0">
        <Row style={{display: hideTitle ? "none" : "block"}}>
          <div class={align ? `d-flex ${align}` : "d-flex justify-content-between"}>
            <p id="title" class="white" style={{color: titleColor ? titleColor : '#14171c', fontSize: size ? size : "22px" }}>{writeTitle === "" ||  writeTitle === undefined ? "Venn Diagram" : writeTitle}</p>
          </div>
        </Row>
      </Container>

      <div className="lightBubble mt-0" style={{ backgroundColor: color_title ? background[0] : 'white'}}>
      <Container fluid className={across ? "" : "across"}>
        <Row>
            <div
            id="venn"
            config={config}>
            </div>
        </Row>
        <div className="halfWidth">

        <Row>
          <div className="overlap" style={{backgroundColor: bubbleColor ? bubbleColor : "#262538", display: hideOverlap ? "none" : "flex"}}>
          <p className="mb-0">{changeRightTitle ? changeRightTitle : "Total Overlap"}</p>

            <h3 className="mb-0">{totalIntersectionCount}%</h3>
          </div>

          </Row>

          <Row>
            <Col md={12}>

            {console.log(numberOfSingleValues)}

            <div className="d-flex justify-content-between">

            <div className="dots">
             {setStrings.map((val, index) => (
               <p key={index}>
                 <i
                   className="fas fa-circle"
                   style={{
                     color: index < numberOfSingleValues ? dotColors[index] : '#e0dcdc',
                   }}
                 ></i>
                 {val}
               </p>
             ))}
           </div>

        <div className="values">
          {setSecondNumbers.map((val, index) =>(
            <p key={index}>
            {val > 0 && val  < 1 ? `${parseFloat(val * 1 ).toFixed(1)}%` : `${Math.round(val).toFixed(0).toLocaleString()}%`}</p>
          ))}

            </div>

            </div>

            </Col>

          </Row>

          </div>

        </Container>
        </div>
        </div>

</Styles>

  </>

)

};
