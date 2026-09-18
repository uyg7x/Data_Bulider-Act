# How to Load Your CSV File

## Quick Answer

**You have 3 ways to load your CSV file from your computer:**

### Method 1: Upload CSV Button (Easiest)
1. Open the app in your browser
2. Go to the **Builder** tab (middle tab at the top)
3. Click the green **"Upload CSV"** button in the top-right corner
4. Select your CSV file from your computer
5. Done! A "Load CSV" node will appear on the canvas with your data

### Method 2: Drag & Drop
1. Open the app in your browser
2. Go to the **Builder** tab
3. Open your file explorer/finder on your computer
4. **Drag your CSV file** directly onto the canvas area
5. Release the file - it will automatically create a node with your data

### Method 3: Properties Panel
1. Go to the **Builder** tab
2. Click **"Load CSV"** from the left sidebar to add a node
3. Click on the node to select it
4. In the right panel (Properties Panel), scroll down to **"Upload CSV File"**
5. Click the upload area and select your CSV file

---

## What Happens After Upload?

Once you upload your CSV file:

✅ **Data is loaded** - Your CSV is parsed and stored in the app  
✅ **Preview shown** - You'll see the first 5 rows of your data  
✅ **Columns detected** - Column names are automatically extracted  
✅ **Ready to use** - You can now connect this node to other nodes

---

## Step-by-Step Example

Let's say you have a file called `employees.csv` with this data:

```csv
name,age,salary,department
Alice,30,50000,Engineering
Bob,25,45000,Marketing
Charlie,35,60000,Engineering
```

### Steps:

1. **Click "Upload CSV"** button (green button in top-right)
2. **Select `employees.csv`** from your computer
3. **See the node appear** on the canvas with your data
4. **Click the node** to see the preview in the right panel
5. **Add more nodes** (like Filter, Chart, Export)
6. **Connect them** by dragging from the right side of one node to the left side of another
7. **Click "Run Pipeline"** to process your data

---

## CSV File Requirements

Your CSV file should:

✅ **Have a header row** (first row = column names)  
✅ **Use commas** to separate values (or semicolons, tabs, pipes)  
✅ **Be saved as .csv** extension  
✅ **Use UTF-8 encoding** (most text editors save as UTF-8 by default)

### Example CSV format:

```csv
id,name,email,salary,department
1,John Doe,john@example.com,50000,Engineering
2,Jane Smith,jane@example.com,55000,Marketing
3,Bob Johnson,bob@example.com,48000,Sales
```

---

## Common Issues

### "File won't upload"
- Make sure the file has `.csv` extension
- Check that the file isn't empty
- Ensure it's not an Excel file (.xlsx) - save it as CSV first

### "Data looks wrong"
- Check if your CSV uses a different delimiter (semicolon, tab, etc.)
- Make sure the first row contains column names
- Verify the file encoding is UTF-8

### "Can't see my data"
- Click on the Load CSV node to see the preview
- Check the Properties Panel on the right side
- Make sure the file uploaded successfully (green checkmark)

---

## Tips

💡 **You can upload multiple CSV files** - Each one creates a separate node  
💡 **You can re-upload** - Click the node and upload a different file to replace the data  
💡 **Drag & drop works anywhere** - Drop the file anywhere on the canvas  
💡 **Large files are OK** - The app can handle thousands of rows  
💡 **Preview shows first 5 rows** - But the entire file is processed when you run the pipeline

---

## Need Help?

If you're still having trouble:

1. Click the **"How to Use"** button on the Dashboard
2. Check the **Properties Panel** on the right side when a node is selected
3. Look for the green **"Upload CSV"** button in the Builder's top bar
4. Try dragging your CSV file directly onto the canvas

---

**That's it!** Your CSV file is now loaded and ready to be processed by your pipeline.
