# Quick Fix for Your Dataset Structure
# Add this cell BEFORE the "Configuration" cell in your notebook

# The dataset has a subdirectory structure, so we need to update the path
# Change this line in the CONFIG cell:

# FROM:
# 'DATASET_PATH': '/kaggle/input/massive-skin-disease-balanced-dataset',

# TO:
# 'DATASET_PATH': '/kaggle/input/massive-skin-disease-balanced-dataset/balanced_dataset',

# OR, if you want to use the CSV file (recommended for better organization):

import pandas as pd
from pathlib import Path

# Load the CSV file
csv_path = '/kaggle/input/massive-skin-disease-balanced-dataset/balanced_dataset.csv'
dataset_base = '/kaggle/input/massive-skin-disease-balanced-dataset/balanced_dataset'

# Check if CSV exists
if Path(csv_path).exists():
    print("✅ Found balanced_dataset.csv")
    df_csv = pd.read_csv(csv_path)
    print(f"CSV shape: {df_csv.shape}")
    print(f"CSV columns: {list(df_csv.columns)}")
    print("\nFirst few rows:")
    print(df_csv.head())
else:
    print("❌ CSV file not found")

# Explore the balanced_dataset directory
print("\n" + "="*60)
print("Exploring balanced_dataset directory:")
print("="*60)

balanced_dir = Path(dataset_base)
if balanced_dir.exists():
    subdirs = [d for d in balanced_dir.iterdir() if d.is_dir()]
    print(f"\n✅ Found {len(subdirs)} subdirectories (classes)")
    
    # Count images in each class
    for subdir in sorted(subdirs)[:10]:  # Show first 10
        image_count = 0
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
            image_count += len(list(subdir.glob(ext)))
        print(f"   - {subdir.name}: {image_count} images")
    
    if len(subdirs) > 10:
        print(f"   ... and {len(subdirs) - 10} more classes")
else:
    print(f"❌ Directory not found: {balanced_dir}")
