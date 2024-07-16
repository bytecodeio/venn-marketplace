import * as React from "react";
import * as ReactDOM from "react-dom";
import 'regenerator-runtime/runtime'
import { Home } from "./Home";

looker.plugins.visualizations.add({

  create: function (element, config) {},

  updateAsync: function (data, element, config, queryResponse, details, done) {

    function filterNullValues(data) {
      return data.filter(item => {

        for (const key in item) {
          if (item[key] && typeof item[key] === 'object' && item[key].hasOwnProperty('value')) {

            item[key].value = item[key].value === null ? 0 : item[key].value;
          }
        }
        return true;
      });
    }

    const filteredData = filterNullValues(data);

        const { measure_like: measureLike } = queryResponse.fields;
        const { dimension_like: dimensionLike } = queryResponse.fields;

        const dimensions1 = dimensionLike.map((dimension) => ({
          label: dimension.label_short ?? dimension.label,
          name: dimension.name

        }));

        const measures1 = measureLike.map((measure) => ({
          label: measure.label_short ?? measure.label,
          name: measure.name
        }));

        const fieldOptions = [...dimensions1, ...measures1].map((dim) => ({
          [dim.label]: queryResponse.data.map(row => row[dim.name].value).join(",")
        }));

        const fieldOptions2 = [...dimensions1, ...measures1].map((dim) => ({
          [dim.label]: dim.label
        }));

        const measures = measureLike.map((measure) => ({
          label: measure.label_short ?? measure.label,
          name: measure.name,
        }));

        const dimensions = dimensionLike.map((dimension) => ({
          label: dimension.label_short ?? dimension.label,
          name: dimension.name,
        }));


        const fieldOptions0 = [...dimensions, ...measures].map((all) => ({
          [all.label]: all.name
        }));

        const empty = [...dimensions1, ...measures1].map((dim) => ({
      thing: queryResponse.data.map(row => row[dim.name].value).join(",")
  }));



    const options = {

      reachPercentage: {
        label: "Choose Reach Percentage for List",
        type: "string",
        display: "select",
        default: "",
        values: fieldOptions0,

        order: 2,
        section: "Values",
      },


    investment: {
    label: "Choose Labels for List",
    type: "string",
    display: "select",
    default: "",
    values: fieldOptions0,

    order: 3,
    section: "Values",
    },


    numbers: {
    label: "Choose Reach Overlap Values for Diagram",
    type: "string",
    display: "select",
    default: "",
    values: fieldOptions0,

    order: 4,
    section: "Values",
    },


    writeTitle: {
      type: "string",
      label: "Write Title",
      default: "",
      placeholder: "Venn Diagram",
      order: 0,
      section: "Style",

    },


    align: {
      type: "string",
      label: "Title Alignment",
      display: "select",
      values: [{ "Left": "justify-content-between" } , { "Center": "justify-content-center" }, {"Right" : "justify-content-end"}],
      section: "Style",
      default: "Left",

      order: 1,
      section: "Style",

    },

    size: {
      type: "string",
      label: "Title Font Size",
      default: "22px",
      display: "text",
      placeholder: "22px",
      order: 2,
      section: "Style",

    },


    hideTitle: {
      type: "boolean",
      label: "Hide Title",
      default: false,
      order: 3,
      section: "Style",

    },


    titleColor: {
      type: "string",
      label: "Title Color",
      default: "#14171c",
      display: "text",
      placeholder: "#14171c",

      order: 4,
      section: "Style",

    },

  bodyStyle: {
      type: "string",
      label: "Choose Font",
      display: "select",
      values: [{ "Roboto": "'Roboto'" } , { "Open Sans": "'Open Sans'" }, {"Montserrat" : "'Montserrat'"}, {"IBM Plex Sans" :  "'IBM Plex Sans'"},{"DM Serif Text": "DM Serif Text"}],

      default: "'Roboto', sans-serif",
      order: 5,
        section: "Style",
    },


    across: {
      type: "boolean",
      label: "Change Layout to Vertical",
      default: false,
      order: 6,
      section: "Style",
    },

    colors: {
    type: 'array',
    label: 'Venn Background Colors',
    display: 'colors',
    default: ["#FF3FED", "#6FFFF0", "#FFEC16", "#0066FF", "#e22bb7", "#6fd0e9", "#12d465", "#ffda00", "#0066ff", "#0dcaf0", "#4ae06d", "#e34fbc", "#b55ae6", "#65ff4b"],
    order: 7,
    section: "Style",
  },



  bubbleColor: {
    type: "string",
    label: "Change Total Overlap Background Color",
    default: "#262538",
    display: "text",
    placeholder: "#262538",
    order: 8,
    section: "Style",

  },

  hideOverlap: {
    type: "boolean",
    label: "Hide Overlap Bar",
    default: false,
    order: 9,
    section: "Style",

  },

  changeRightTitle: {
    type: "string",
    label: "Override Overlap Title",
    default: "",
    placeholder: "",
    order: 10,
    section: "Style",

  },



  };


 this.trigger("registerOptions", options);


function checkZeroValues(fieldOptions) {
  let zeroCount = 0;

  for (const option of fieldOptions) {
    const values = option[Object.keys(option)[0]].split(",");

    zeroCount += values.filter(value => value === "0").length;

    if (zeroCount > 2) {
      break;
    }
  }

  return zeroCount;
}

const zeroCount = checkZeroValues(fieldOptions);



if (zeroCount > 2) {
  this.addError({
    title: "Incompatible Data",
    message: "This chart requires you to not have values that are not null or zero",
  });
  return;
}



const hasOneDimension = queryResponse.fields.dimensions.length > 0;
const hasOneMeasure = queryResponse.fields.measures.length > 0;


if (!hasOneDimension || !hasOneMeasure ) {
  this.addError({
    title: "Incompatible Data",
    message: "This chart requires at least one dimension and one measure",
  });
  return;
}

    ReactDOM.render(
      <Home
        data={data}
        config={config}
        queryResponse={queryResponse}
        details={details}
      />,

      element
    );

  done()
  },
});
