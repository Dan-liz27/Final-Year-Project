# Quick fix for dataset loading - Add this cell BEFORE section 5

# First, let's explore the Kaggle input directory to find your dataset
import os
from pathlib import Path

print("=" * 60)
print("EXPLORING KAGGLE INPUT DIRECTORY")
print("=" * 60)

# List all available datasets in Kaggle input
kaggle_input = Path('/kaggle/input')
if kaggle_input.exists():
    datasets = [d for d in kaggle_input.iterdir() if d.is_dir()]
    print(f"\nFound {len(datasets)} dataset(s) in /kaggle/input/:\n")
    for dataset in datasets:
        print(f"  📁 {dataset.name}")
        # Show first level structure
        subdirs = [d for d in dataset.iterdir() if d.is_dir()]
        files = [f for f in dataset.iterdir() if f.is_file()]
        if subdirs:
            print(f"     Subdirectories: {len(subdirs)}")
            for subdir in subdirs[:5]:  # Show first 5
                print(f"       - {subdir.name}")
            if len(subdirs) > 5:
                print(f"       ... and {len(subdirs) - 5} more")
        if files:
            print(f"     Files: {len(files)}")
    print()
else:
    print("\n⚠️  /kaggle/input not found. Are you running on Kaggle?")
    print("If running locally, update DATASET_PATH to your local path.\n")

# Now update DATASET_PATH based on what we found
print("=" * 60)
print("UPDATE YOUR DATASET_PATH")
print("=" * 60)
print("\nBased on the above, update DATASET_PATH in the next cell.")
print("Common patterns:")
print("  1. If you see your dataset name: '/kaggle/input/your-dataset-name'")
print("  2. If images are in subdirectories: '/kaggle/input/dataset/train' or similar")
print("  3. If there's a 'balanced_dataset' folder: '/kaggle/input/dataset/balanced_dataset'")
print("\n" + "=" * 60)
