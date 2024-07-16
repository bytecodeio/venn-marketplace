# Venn Diagram - Looker Custom Visualization
This is a custom visual venn diagram, built with React.js and D3.js 

## Development
Spin up a local development server hosting the visualization JavaScript file with npm install and npm start.
To view this custom visualization in your Looker instance, add a visualization parameter to your project's manifest.lkml file, with the visualization's url parameter set to https://localhost:8080/bundle.js (more details here). Deploy this change to production, navigate to an explore in your instance, and under the visualizations tab choose the new custom visualization that you defined. You may need to set your browser to allow localhost's https certificate (navigate to https://localhost:8080/bundle.js > advanced > proceed)

## Production
When you are finished with development, run `npm run build` to create a production build of the visualization. Drag and drop the newly created `bundle.js` file in the `dist/` folder to your LookML project. Set the `file` parameter in your `visualization` parameter in the manifest file to point to your new production bundle (described in more detail [here](https://cloud.google.com/looker/docs/reference/param-manifest-visualization)). Save and **deploy your LookML** changes, and your deployed visualization should pull its JavaScript from the deployed `bundle.js` file in your LookML project.

<img width="1560" alt="Screenshot 2024-07-16 at 10 47 26 AM" src="https://github.com/user-attachments/assets/2eb69bb8-20e3-43a7-8573-ada06a3f71db">

The overlap array of string values should be formatted like this in this venn diagram:

[
    "TV",
    "Search",
    "Social",
    "Digital",
    "Social, TV",
    "TV, Search",
    "Digital, TV",
    "Social, Search",
    "Digital, Search",
    "Digital, TV, Search",
    "Social, TV, Digital",
    "Social, Digital, Search",
    "Social, TV, Digital, Search"
]
