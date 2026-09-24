import pandas as pd
import numpy as np
from typing import Any, Union, Optional
import logging

# Configure logging for the pipeline engine
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("PipelineEngine")

def filter_nulls(
    df: pd.DataFrame, 
    column: str, 
    action: str
) -> pd.DataFrame:
    """
    Handles missing values in a specific column based on the selected action.
    
    Args:
        df: Input DataFrame
        column: Target column to check for nulls
        action: 'drop_rows', 'fill_zero', 'fill_mean', 'fill_median'
    """
    try:
        if df.empty:
            logger.warning("Input DataFrame is empty.")
            return df
        
        if column not in df.columns:
            logger.error(f"Column '{column}' not found in DataFrame. Available: {list(df.columns)}")
            return df

        # Work on a copy to avoid SettingWithCopyWarning
        df = df.copy()
        
        null_count = df[column].isnull().sum()
        logger.info(f"Filter Nulls: Found {null_count} nulls in column '{column}'")
        
        if null_count == 0:
            logger.info("No nulls found. Skipping operation.")
            return df

        if action == 'drop_rows':
            # REQUIREMENT: Only drop if ALL columns are null, or if this specific critical column is null?
            # The user specified: "Only drop if ALL columns are null (not just one!)"
            # However, usually Filter Nulls node is column-specific. 
            # To strictly follow the request:
            initial_rows = len(df)
            df = df.dropna(how='all') 
            logger.info(f"Action 'drop_rows': Removed rows where ALL columns were null. {initial_rows} -> {len(df)}")
            
        elif action == 'fill_zero':
            df[column] = df[column].fillna(0)
            logger.info(f"Action 'fill_zero': Filled nulls in '{column}' with 0.")
            
        elif action == 'fill_mean':
            # Ensure numeric conversion for mean calculation
            numeric_col = pd.to_numeric(df[column], errors='coerce')
            mean_val = numeric_col.mean()
            
            if pd.isna(mean_val):
                logger.warning(f"Could not calculate mean for '{column}' (column might be non-numeric). Filling with 0.")
                df[column] = df[column].fillna(0)
            else:
                df[column] = df[column].fillna(mean_val)
                logger.info(f"Action 'fill_mean': Filled nulls in '{column}' with mean: {mean_val:.2f}")
                
        elif action == 'fill_median':
            numeric_col = pd.to_numeric(df[column], errors='coerce')
            median_val = numeric_col.median()
            
            if pd.isna(median_val):
                logger.warning(f"Could not calculate median for '{column}'. Filling with 0.")
                df[column] = df[column].fillna(0)
            else:
                df[column] = df[column].fillna(median_val)
                logger.info(f"Action 'fill_median': Filled nulls in '{column}' with median: {median_val:.2f}")
        else:
            logger.error(f"Unknown action '{action}'. No changes made.")

        logger.info(f"Operation complete. Rows remaining: {len(df)}")
        return df

    except Exception as e:
        logger.exception(f"Critical error in filter_nulls: {e}")
        return df

def filter_rows(
    df: pd.DataFrame, 
    column: str, 
    operator: str, 
    value: Any
) -> pd.DataFrame:
    """
    Robust row filtering with string cleaning and case-insensitivity.
    """
    try:
        if df.empty: return df
        if column not in df.columns:
            logger.error(f"Column '{column}' not found.")
            return df

        df = df.copy()
        
        # Debug logging
        unique_vals = df[column].dropna().unique()
        logger.info(f"Filter Rows: Column='{column}', Op='{operator}', Val='{value}'")
        logger.info(f"Unique values sample: {unique_vals[:10]}")

        # String cleaning for the target column and filter value
        col_data = df[column].astype(str).str.strip()
        filter_val_str = str(value).strip()
        
        # Case-insensitive normalized versions
        col_lower = col_data.str.lower()
        val_lower = filter_val_str.lower()

        if operator == '==':
            mask = col_lower == val_lower
        elif operator == '!=':
            mask = col_lower != val_lower
        elif operator == 'contains':
            mask = col_lower.str.contains(val_lower, na=False, regex=False)
        elif operator in ['>', '<', '>=', '<=']:
            # Attempt numeric comparison
            try:
                num_col = pd.to_numeric(df[column], errors='coerce')
                num_val = float(value)
                if operator == '>': mask = num_col > num_val
                elif operator == '<': mask = num_col < num_val
                elif operator == '>=': mask = num_col >= num_val
                elif operator == '<=': mask = num_col <= num_val
                else: mask = pd.Series([True] * len(df), index=df.index)
            except (ValueError, TypeError):
                # Fallback to string comparison if not numeric
                if operator == '>': mask = col_data > filter_val_str
                elif operator == '<': mask = col_data < filter_val_str
                elif operator == '>=': mask = col_data >= filter_val_str
                elif operator == '<=': mask = col_data <= filter_val_str
                else: mask = pd.Series([True] * len(df), index=df.index)
        else:
            logger.warning(f"Unsupported operator '{operator}'. Returning all rows.")
            mask = pd.Series([True] * len(df), index=df.index)

        filtered_df = df[mask].copy()
        logger.info(f"Filter result: {len(df)} -> {len(filtered_df)} rows")
        return filtered_df

    except Exception as e:
        logger.exception(f"Critical error in filter_rows: {e}")
        return df

def run_pipeline_node(df: pd.DataFrame, node_config: dict) -> pd.DataFrame:
    """
    General Pipeline Engine wrapper with error handling and shape logging.
    """
    node_type = node_config.get('type')
    config = node_config.get('config', {})
    
    logger.info(f"Executing Node: {node_type} | Input Shape: {df.shape}")
    
    try:
        if node_type == 'filter_nulls':
            df = filter_nulls(df, config.get('column'), config.get('action'))
        elif node_type == 'filter_rows':
            df = filter_rows(df, config.get('column'), config.get('operator'), config.get('value'))
        # ... other node types here ...
        else:
            logger.info(f"No implementation for node type {node_type}, skipping.")
            
    except Exception as e:
        logger.error(f"Node {node_type} failed: {e}. Continuing pipeline with current data.")
    
    logger.info(f"Finished Node: {node_type} | Output Shape: {df.shape}")
    return df

# ==========================================
# TEST SUITE
# ==========================================
if __name__ == "__main__":
    # Mock COVID-19 Data
    data = {
        'Entity': ['Fiji', 'South Africa', 'Namibia', 'Fiji', 'South Africa', None],
        'Daily change': [10, np.nan, 5, np.nan, 20, np.nan], # Mixed nulls
        'Region': [' North', 'South', 'North', 'North ', 'West', None] # Mixed whitespace/case
    }
    test_df = pd.DataFrame(data)
    
    print("\n--- Testing Filter Nulls (fill_mean) ---")
    # Should fill Daily change nulls with mean (10+5+20)/3 = 11.66
    res_nulls = filter_nulls(test_df, 'Daily change', 'fill_mean')
    print(res_nulls)

    print("\n--- Testing Filter Nulls (drop_rows - All Null) ---")
    # Only the last row is completely null
    res_drop = filter_nulls(test_df, 'Daily change', 'drop_rows')
    print(res_drop)

    print("\n--- Testing Filter Rows (Robust String) ---")
    # Should find "North", " North", "North "
    res_rows = filter_rows(test_df, 'Region', '==', 'North')
    print(res_rows)
