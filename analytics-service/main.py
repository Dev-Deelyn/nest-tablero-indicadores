from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from app.excel_utils import get_excel_sheets, read_excel_data
from app.charts import prepare_chart_data
import pandas as pd

# Crear la app FastAPI
app = FastAPI(
    title="Excel Analytics Service",
    description="Microservicio para carga, lectura y análisis de archivos Excel.",
    version="1.1.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # dominio del frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directorio de uploads
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ENDPOINT: Subir archivo Excel
@app.post("/upload/")
async def upload_excel(file: UploadFile = File(...)):
    try:
        # Validar extensión
        if not file.filename.endswith((".xlsx", ".xls")):
            raise HTTPException(
                status_code=400,
                detail="El archivo debe ser un Excel (.xlsx o .xls)"
            )

        # Guardar el archivo temporalmente
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Obtener hojas disponibles
        sheets = get_excel_sheets(file_path)
        if not sheets:
            raise HTTPException(status_code=400, detail="El archivo no contiene hojas válidas")

        return {"filename": file.filename, "sheets": sheets}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo: {str(e)}")


# ENDPOINT: Leer columnas y datos
@app.post("/read-columns/")
async def read_columns(filename: str = Form(...), sheet_name: str = Form(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, filename)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="El archivo no existe")

        df = read_excel_data(file_path, sheet_name)

        if df.empty:
            raise HTTPException(status_code=400, detail="La hoja seleccionada está vacía o no contiene datos")

        return JSONResponse(content={
            "columns": df.columns.tolist(),
            "data": df.to_dict(orient="records")
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al leer columnas: {str(e)}")


# ENDPOINT: Generar datos del gráfico
@app.post("/generate-chart/")
async def generate_chart(
    filename: str = Form(...),
    sheet_name: str = Form(...),
    x_col: str = Form(...),
    y_col: str = Form(...)
):
    try:
        file_path = os.path.join(UPLOAD_DIR, filename)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="El archivo no existe")

        df = read_excel_data(file_path, sheet_name)

        if df.empty:
            raise HTTPException(status_code=400, detail="La hoja seleccionada está vacía")

        # Validar que las columnas existan
        if x_col not in df.columns or y_col not in df.columns:
            raise HTTPException(status_code=400, detail="Las columnas seleccionadas no existen en la hoja")

        data = prepare_chart_data(df, x_col, y_col)
        return JSONResponse(content=data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar datos del gráfico: {str(e)}")

# HEALTHCHECK opcional
@app.get("/health/")
async def health_check():
    """
    Endpoint para verificar si el microservicio está corriendo correctamente.
    """
    return {"status": "ok", "message": "Servicio FastAPI activo y funcionando."}
