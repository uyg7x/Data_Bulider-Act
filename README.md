#  Visual Data Pipeline Builder

**Empowering everyone to process data visually. No code, no stress, just flow.**

Visual Data Pipeline Builder is a sophisticated no-code/low-code web application that transforms the complex world of data engineering into an intuitive drag-and-drop experience. Whether you are a data analyst, a business owner, or a developer, you can now construct, execute, and monitor data transformation pipelines in minutes.

---

##  Why This Module? (How it helps your life)

Data processing usually requires writing tedious scripts, handling messy CSVs, and debugging complex SQL queries. This module removes those barriers:

- ** Save Hours of Development**: Stop writing boilerplate code for basic filters, sorts, and joins. Build your logic visually and let the engine handle the execution.
- ** Democratize Data Analysis**: Allow non-technical team members to create their own data pipelines without needing to learn Python or SQL.
- ** Immediate Feedback**: No more "run and pray." See exactly how your data transforms at every single step with integrated data previews.
- ** Instant Visualization**: Turn raw data into professional charts (Bar, Line, Pie, Scatter) with a single node.
- ** Error-Proof Workflows**: Visually map your data flow to avoid logical errors and easily iterate on your transformation logic.

---

##  Key Features

- ** Visual Canvas**: A powerful drag-and-drop interface powered by React Flow.
- ** Diverse Node Library**:
  - **Sources**: CSV uploads and Database connectors.
  - **Transforms**: Null handling, column renaming, mathematical operations, row filtering, and sorting.
  - **Outputs**: Professional chart generation and multi-format exports (CSV, JSON).
- ** Real-time Execution**: Monitor pipeline health and progress with live status updates and detailed execution logs.
- ** Pipeline Management**: Full CRUD operations—Save, Load, Duplicate, and Organize your workflows.
- ** Integrated Analytics**: A comprehensive dashboard to track pipeline health and recent activity.

---

##  Getting Started

###  Installation

Follow these steps to get your local environment up and running:

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd "workspace (1)"
```

**2. Install Dependencies**
Ensure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

**3. Launch the Development Server**
```bash
npm run dev
```
Your application will be available at `http://localhost:5173`.

###  Backend Setup
This project uses Python for data processing logic. Ensure you have Python installed and run the backend scripts:
```bash
python pipeline_backend_fixed.py
```

---

##  How to Use

### 1. The Dashboard
The command center of your data operations. Create new pipelines, manage existing ones, and monitor overall system health.

### 2. The Builder (The Magic Happens Here)
- **Left Sidebar**: Pick your tools (Nodes).
- **Center Canvas**: Connect nodes by dragging handles to define the data flow.
- **Right Sidebar**: Configure the specific settings for each node and preview the resulting data.

### 3. Execution & Logs
Run your pipeline with one click and track every transformation in the **Execution History** tab. Get detailed timestamps and error reports if something goes wrong.

---

##  Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **State Management**: Zustand
- **Visuals**: React Flow, Recharts, Framer Motion
- **Backend**: Python (Data Processing)
- **Utilities**: PapaParse (CSV), Lucide React (Icons)

---

##  Contributing
Feel free to fork this project, open issues, or submit pull requests to make the data world more visual!

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
