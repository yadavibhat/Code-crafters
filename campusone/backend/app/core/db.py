import os
import sqlite3
import urllib.request
import json
from typing import List, Dict, Any
from app.core.config import settings

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "campusone.db")

class Database:
    """Database client supporting Databricks SQL Warehouse REST API and local SQLite fallback."""

    def __init__(self):
        self.databricks_configured = bool(
            settings.DATABRICKS_HOST and settings.DATABRICKS_TOKEN and settings.DATABRICKS_WAREHOUSE_ID
        )

    def get_sqlite_connection(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Executes query on Databricks SQL Warehouse if configured, else SQLite."""
        if self.databricks_configured:
            try:
                return self._execute_databricks_query(query)
            except Exception as e:
                print(f"[DB] Databricks query fallback to local DB due to: {e}")
                return self._execute_sqlite_query(query, params)
        else:
            return self._execute_sqlite_query(query, params)

    def _execute_sqlite_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        conn = self.get_sqlite_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        
        if query.strip().upper().startswith("SELECT") or "PRAGMA" in query.upper():
            rows = cursor.fetchall()
            result = [dict(row) for row in rows]
        else:
            conn.commit()
            result = [{"affected_rows": cursor.rowcount}]
        
        conn.close()
        return result

    def _execute_databricks_query(self, query: str) -> List[Dict[str, Any]]:
        """Round-trip REST API query to Databricks SQL Statement Execution API."""
        url = f"{settings.DATABRICKS_HOST.rstrip('/')}/api/2.0/sql/statements"
        headers = {
            "Authorization": f"Bearer {settings.DATABRICKS_TOKEN}",
            "Content-Type": "application/json"
        }
        body = {
            "statement": query,
            "warehouse_id": settings.DATABRICKS_WAREHOUSE_ID,
            "catalog": "campusone",
            "schema": "core",
            "wait_timeout": "10s"
        }

        req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        if data.get("status", {}).get("state") == "SUCCEEDED":
            columns = [col["name"] for col in data.get("manifest", {}).get("schema", {}).get("columns", [])]
            data_array = data.get("result", {}).get("data_array", [])
            return [dict(zip(columns, row)) for row in data_array]
        else:
            raise RuntimeError(f"Databricks SQL Execution error: {data}")

db = Database()
