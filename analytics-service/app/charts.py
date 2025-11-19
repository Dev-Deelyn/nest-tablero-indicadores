import plotly.express as px

def prepare_chart_data(df, x_col, y_col):
    x = df[x_col].tolist()
    y = df[y_col].tolist()
    return {"x": x, "y": y}
