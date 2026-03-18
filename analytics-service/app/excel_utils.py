import pandas as pd
import numpy as np


def get_excel_sheets(file_path: str):
    try:
        xl = pd.ExcelFile(file_path, engine="openpyxl")
        return xl.sheet_names
    except Exception:
        xl = pd.ExcelFile(file_path)
        return xl.sheet_names


def read_excel_data(file_path: str, sheet_name: str):
    try:
        df = pd.read_excel(
            file_path,
            sheet_name=sheet_name,
            engine="openpyxl"
        )
    except Exception:
        df = pd.read_excel(
            file_path,
            sheet_name=sheet_name
        )

    # Limpieza
    df = df.dropna(how="all")
    df.columns = df.columns.astype(str)
    df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

    # Reemplazar NaN por None (se convierte a null en JSON, evita fallo de serialización)
    df = df.where(pd.notnull(df), None)

    return df