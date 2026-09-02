import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABRICKS_HOST: str = os.getenv("DATABRICKS_HOST", "")
    DATABRICKS_TOKEN: str = os.getenv("DATABRICKS_TOKEN", "")
    DATABRICKS_WAREHOUSE_ID: str = os.getenv("DATABRICKS_WAREHOUSE_ID", "")
    DATABRICKS_GENIE_SPACE_ID: str = os.getenv("DATABRICKS_GENIE_SPACE_ID", "")
    SESSION_SECRET: str = os.getenv("SESSION_SECRET", "dev_secret")
    ALLOWED_EMAIL_DOMAIN: str = os.getenv("ALLOWED_EMAIL_DOMAIN", "example.edu")
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]

settings = Settings()
