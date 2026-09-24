import pandas as pd
from typing import Any, List, Union

def filter_rows(
    df: pd.DataFrame,
    column: str,
    condition: str,
    value: Any
) -> pd.DataFrame:
    """
    Filter rows based on condition applied to a column.
    
    Supports: "Equals", "Not Equals", "Contains", "Greater Than", "Less Than"
    
    Args:
        df: Input DataFrame
        column: Target column name
        condition: One of "Equals", "Not Equals", "Contains", "Greater Than", "Less Than"
        value: Value to compare against
        
    Returns:
        Filtered DataFrame
    """
    if df.empty:
        print(f"[DEBUG] Input DataFrame is empty, returning as-is")
        return df
    
    if column not in df.columns:
        print(f"[DEBUG] Column '{column}' not found. Available: {list(df.columns)}")
        return df
    
    # --- DEBUG: Show unique values in target column ---
    unique_vals = df[column].dropna().unique()
    print(f"\n[DEBUG] Filter Rows Operation")
    print(f"[DEBUG] Column: '{column}'")
    print(f"[DEBUG] Column DataType: {df[column].dtype}")
    print(f"[DEBUG] Sample values (repr): {[repr(x) for x in df[column].head(5).tolist()]}")
    print(f"[DEBUG] Condition: '{condition}'")
    print(f"[DEBUG] Value: '{value}' (type: {type(value).__name__})")
    print(f"[DEBUG] Unique values in column: {unique_vals[:20]}{'...' if len(unique_vals) > 20 else ''}")
    print(f"[DEBUG] Rows BEFORE filter: {len(df)}")
    
    # Create a copy to avoid SettingWithCopyWarning
    df = df.copy()
    
    # Convert column to string for string operations, keep original for numeric
    col_data = df[column]
    
    try:
        if condition in ["Equals", "Not Equals", "Contains"]:
            # String-based comparison
            # Strip whitespace and handle case-insensitivity for Equals/Not Equals
            col_str = col_data.astype(str).str.strip()
            val_str = str(value).strip()
            
            if condition == "Equals":
                # Case-insensitive exact match
                mask = col_str.str.lower() == val_str.lower()
            elif condition == "Not Equals":
                mask = col_str.str.lower() != val_str.lower()
            elif condition == "Contains":
                # Case-insensitive substring match
                mask = col_str.str.contains(val_str, case=False, na=False, regex=False)
            else:
                mask = pd.Series([True] * len(df), index=df.index)
                
        elif condition in ["Greater Than", "Less Than"]:
            # Numeric comparison - try to convert both sides
            try:
                col_num = pd.to_numeric(col_data, errors='coerce')
                val_num = float(value)
                
                # Check if conversion resulted in all NaN (non-numeric column)
                if col_num.isna().all():
                    print(f"[DEBUG] Column '{column}' appears non-numeric, falling back to string comparison")
                    col_str = col_data.astype(str).str.strip()
                    val_str = str(value).strip()
                    
                    if condition == "Greater Than":
                        mask = col_str > val_str
                    else:  # Less Than
                        mask = col_str < val_str
                else:
                    if condition == "Greater Than":
                        mask = col_num > val_num
                    else:  # Less Than
                        mask = col_num < val_num
                        
            except (ValueError, TypeError):
                # Fallback to string comparison if value can't be converted to float
                print(f"[DEBUG] Value '{value}' not numeric, using string comparison")
                col_str = col_data.astype(str).str.strip()
                val_str = str(value).strip()
                
                if condition == "Greater Than":
                    mask = col_str > val_str
                else:
                    mask = col_str < val_str
        else:
            print(f"[DEBUG] Unknown condition: '{condition}', returning all rows")
            mask = pd.Series([True] * len(df), index=df.index)
        
        # Apply filter
        filtered_df = df[mask].copy()
        
        # --- DEBUG: Results ---
        print(f"[DEBUG] Rows AFTER filter: {len(filtered_df)}")
        print(f"[DEBUG] Rows REMOVED: {len(df) - len(filtered_df)}")
        if len(filtered_df) > 0:
            print(f"[DEBUG] First few filtered rows:\n{filtered_df.head(3).to_string()}")
        print(f"[DEBUG] {'='*50}\n")
        
        return filtered_df
        
    except Exception as e:
        print(f"[DEBUG] ERROR in filter_rows: {e}")
        print(f"[DEBUG] Returning original DataFrame unfiltered")
        return df


# --- Example usage / test ---
if __name__ == "__main__":
    # Test data simulating your scenario
    data = {
        'Region': ['North', 'South', 'North ', ' East', 'West', 'north', 'North', 'South', 'North', 'East', 'West', 'North'],
        'Sales': [100, 200, 150, 300, 250, 180, 220, 190, 210, 160, 240, 170],
        'Product': ['A', 'B', 'A', 'C', 'B', 'A', 'C', 'A', 'B', 'C', 'A', 'B']
    }
    df = pd.DataFrame(data)
    
    print("Original DataFrame:")
    print(df.to_string())
    print()
    
    # Test: Filter Region == 'North' (should match 'North', 'North ', 'north' after strip + case-insensitive)
    result = filter_rows(df, column='Region', condition='Equals', value='North')
    
    print("Filtered Result:")
    print(result.to_string())