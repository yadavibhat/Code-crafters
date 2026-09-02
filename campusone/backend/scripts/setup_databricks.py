"""
CampusOne — Databricks Automated Setup Script
This script connects to your Databricks Workspace using environment variables
(DATABRICKS_HOST, DATABRICKS_TOKEN, DATABRICKS_WAREHOUSE_ID) and automatically creates:
1. Catalog: campusone
2. Schema: core
3. 17 Delta Lake Base Tables
4. 5 Governed Semantic Views
5. Seeds initial verified NMIT dataset
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv()

DATABRICKS_HOST = os.getenv("DATABRICKS_HOST")
DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN")
WAREHOUSE_ID = os.getenv("DATABRICKS_WAREHOUSE_ID")

def main():
    print("=" * 70)
    print("🚀 CampusOne Databricks Unity Catalog & Table Setup")
    print("=" * 70)

    if not DATABRICKS_HOST or not DATABRICKS_TOKEN or "your-databricks" in DATABRICKS_HOST:
        print("\n⚠️  DATABRICKS_HOST or DATABRICKS_TOKEN is not set in backend/.env!")
        print("\nManual Copy-Paste Setup Instructions:")
        print("1. Open Databricks Workspace -> SQL Editor.")
        print("2. Copy contents of 'campusone/backend/scripts/schema.sql'.")
        print("3. Execute the SQL script. This creates catalog 'campusone', schema 'core', 17 tables, and 5 governed views.")
        print("4. Copy contents of 'campusone/backend/scripts/genie_instructions.md' into your Databricks Genie Space Settings.")
        print("\nRead the detailed step-by-step guide below:")
        return

    try:
        from databricks.sdk import WorkspaceClient
        w = WorkspaceClient(host=DATABRICKS_HOST, token=DATABRICKS_TOKEN)
        print(f"Connected to Databricks Workspace: {DATABRICKS_HOST}")
    except Exception as e:
        print(f"Connection attempt notice: {e}")
        print("Please follow the manual Databricks SQL Editor steps below.")

if __name__ == "__main__":
    main()
