import pandas as pd


def get_excel_sheets(file_path: str):
    try:
        xl = pd.ExcelFile(file_path, engine="openpyxl")
        return xl.sheet_names
    except Exception:
        xl = pd.ExcelFile(file_path)
        return xl.sheet_names


def read_excel_data(file_path: str, sheet_name: str):
    try:
        # Intento principal
        df = pd.read_excel(
            file_path,
            sheet_name=sheet_name,
            engine="openpyxl"
        )

    except Exception:
        # Fallback para XLS viejos
        df = pd.read_excel(
            file_path,
            sheet_name=sheet_name
        )

    # Limpieza PRO
    df = df.dropna(how="all")  # elimina filas totalmente vacías
    df.columns = df.columns.astype(str)  # evita columnas raras

    # eliminar columnas vacías
    df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

    return df
