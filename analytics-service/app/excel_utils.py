import pandas as pd

def get_excel_sheets(file_path: str):
    xl = pd.ExcelFile(file_path)
    return xl.sheet_names

def read_excel_data(file_path: str, sheet_name: str):
    return pd.read_excel(file_path, sheet_name=sheet_name)
