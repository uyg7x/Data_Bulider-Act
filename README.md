# Visual Data Pipeline Builder

A no-code/low-code web application that allows users to visually construct data transformation pipelines using a drag-and-drop interface.

## Features

- **Visual Pipeline Builder**: Drag-and-drop interface to create data processing workflows
- **Multiple Node Types**: Data sources, transformations, and output nodes
- **Real-time Execution**: Watch your pipeline execute with live status updates
- **Chart Generation**: Create bar, line, pie, scatter, and area charts from your data
- **Data Preview**: Inspect data at each pipeline stage
- **Pipeline Management**: Save, load, duplicate, and delete pipelines
- **Execution History**: Track pipeline runs with detailed logs

## How to Use

### 1. Dashboard

When you first open the application, you'll see the **Dashboard**:

- **View Pipelines**: See all your saved pipelines in a grid view
- **Create New Pipeline**: Click "New Pipeline" button to create a blank pipeline
- **Open Pipeline**: Click on any pipeline card to open it in the Builder
- **Pipeline Actions**: Click the three-dot menu (⋮) on each card to:
  - Duplicate the pipeline
  - Delete the pipeline

### 2. Builder (Canvas)

The Builder is where you construct your pipeline. It has three main sections:

#### Left Sidebar - Node Palette
Contains all available nodes organized by category:

**Data Sources:**
- **Load CSV**: Load data from a CSV file
- **Load Database**: Load data from a database query

**Transformations:**
- **Filter Nulls**: Remove or fill null values in a column
- **Rename Columns**: Rename data columns
- **Math Operation**: Perform add, subtract, multiply, divide operations
- **Filter Rows**: Filter rows based on conditions (>, <, ==, !=, >=, <=)
- **Sort Data**: Sort data by a specific column

**Outputs:**
- **Generate Chart**: Create visualizations (bar, line, pie, scatter, area charts)
- **Export CSV**: Export processed data as CSV
- **Export JSON**: Export processed data as JSON

#### Center Canvas
- **Add Nodes**: 
  - Drag nodes from the left palette onto the canvas
  - OR click on a node in the palette to add it
- **Connect Nodes**: 
  - Click and drag from the right handle (output) of one node
  - Drop on the left handle (input) of another node
  - This creates a data flow connection
- **Move Nodes**: Click and drag nodes to reposition them
- **Delete Nodes**: Select a node and press Delete, or use the trash icon in the properties panel
- **Zoom/Pan**: Use mouse wheel to zoom, click and drag on empty space to pan

#### Right Sidebar - Properties Panel
When you select a node, this panel shows:
- **Node Configuration**: Edit node-specific settings
  - File names, column names, operations, etc.
  - Toggle switches for boolean options
  - Dropdown menus for selections
- **Status**: Shows if the node is idle, running, successful, or has errors
- **Data Preview**: After execution, shows the first 5 rows of output data
- **Chart Preview**: For "Generate Chart" nodes, shows the actual chart

#### Top Bar
- **Back to Dashboard**: Click the arrow to return to the dashboard
- **Save**: Save the current pipeline state
- **Run Pipeline**: Execute the entire pipeline (processes all nodes in order)

### 3. Execution & Logs

Monitor your pipeline executions:

#### Run History Tab
- **View Past Executions**: See all pipeline runs with status (Success/Failed/Pending/Running)
- **Execution Details**: Click to expand and see:
  - Execution logs with timestamps
  - Duration of the run
  - Output data preview (for successful runs)
  - Download links for output files

#### Live Logs Tab
- Shows real-time log streaming during execution
- Displays processing messages for each node

## Creating Your First Pipeline

### Example: Load, Filter, and Export Data

1. **Create a New Pipeline**
   - Go to Dashboard
   - Click "New Pipeline"
   - Name it "Employee Data Cleanup"

2. **Add a Load CSV Node**
   - In the Builder, find "Load CSV" in the Data Sources section
   - Click on it to add to canvas
   - In the Properties Panel, set:
     - File Name: `employees.csv`
     - Delimiter: `,`
     - Has Header Row: Enabled

3. **Add a Filter Nulls Node**
   - Find "Filter Nulls" in Transformations
   - Click to add it
   - Connect it to the Load CSV node (drag from right handle to left handle)
   - Configure:
     - Target Column: `age`
     - Action: `drop_rows`

4. **Add an Export CSV Node**
   - Find "Export CSV" in Outputs
   - Click to add it
   - Connect it to the Filter Nulls node
   - Configure:
     - Output File Name: `cleaned_employees.csv`
     - Include Header: Enabled

5. **Run the Pipeline**
   - Click "Run Pipeline" in the top bar
   - Watch each node turn blue (running) then green (success)
   - Check the Properties Panel for data preview at each stage

6. **View Results**
   - Go to the Logs tab
   - Find your execution in the history
   - Expand it to see logs and output data

### Example: Generate a Chart

1. **Create a Pipeline**
   - Load CSV → Filter Nulls → Generate Chart

2. **Configure the Chart Node**
   - Chart Type: `pie` (or bar, line, scatter, area)
   - X-Axis Column: `department`
   - Y-Axis Column: `salary`
   - Chart Title: `Salary by Department`

3. **Run the Pipeline**
   - Execute the pipeline
   - Select the Generate Chart node
   - See the chart preview in the Properties Panel

## Node Configuration Guide

### Load CSV
- **File Name**: Name of the CSV file to load
- **Delimiter**: Character separating values (comma, semicolon, tab, pipe)
- **Has Header Row**: Whether the first row contains column names

### Filter Nulls
- **Target Column**: Column to check for null values
- **Action**:
  - `drop_rows`: Remove rows with null values
  - `fill_zero`: Replace nulls with 0
  - `fill_mean`: Replace nulls with column mean
  - `fill_median`: Replace nulls with column median

### Math Operation
- **Operation**: add, subtract, multiply, divide
- **Column A**: First operand column
- **Column B**: Second operand column
- **Result Column**: Name for the new column with results

### Filter Rows
- **Column**: Column to filter on
- **Operator**: Comparison operator (>, <, ==, !=, >=, <=)
- **Value**: Value to compare against

### Generate Chart
- **Chart Type**: bar, line, pie, scatter, or area
- **X-Axis Column**: Column for X-axis (or categories for pie)
- **Y-Axis Column**: Column for Y-axis (or values for pie)
- **Chart Title**: Title displayed on the chart

### Export CSV/JSON
- **Output File Name**: Name for the exported file
- **Include Header/Pretty Print**: Formatting options

## Tips & Best Practices

1. **Start Simple**: Begin with a basic Load → Transform → Export pipeline
2. **Test Incrementally**: Run your pipeline after adding each node to catch errors early
3. **Use Data Preview**: Check the data preview at each node to verify transformations
4. **Name Your Pipelines**: Use descriptive names for easy identification
5. **Save Frequently**: Click Save to preserve your work
6. **Check Logs**: If a pipeline fails, check the execution logs for error details
7. **Chart Types**:
   - Use **bar charts** for comparing categories
   - Use **line charts** for trends over time
   - Use **pie charts** for showing proportions
   - Use **scatter plots** for showing relationships
   - Use **area charts** for showing cumulative totals

## Troubleshooting

### Pipeline Won't Execute
- Ensure all nodes are connected (no floating nodes)
- Check that at least one data source node is present
- Verify node configurations are complete

### Chart Not Showing
- Make sure the Generate Chart node is configured with valid column names
- Run the pipeline first to generate chart data
- Check that the data has the required columns

### Data Preview Empty
- Run the pipeline to populate data previews
- Check if previous nodes executed successfully
- Verify the data source has data

## Technical Details

- **Frontend**: React, TypeScript, React Flow, Tailwind CSS, Recharts
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Vite

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Future Enhancements

- Backend integration with FastAPI
- Real database connections
- AWS S3 file storage
- User authentication
- Pipeline scheduling
- More transformation nodes
- Advanced chart customization
- Pipeline templates
- Collaboration features
