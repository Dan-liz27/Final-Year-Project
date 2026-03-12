
# 📘 README — Plan to Generate CE-EEN-B0 Training Notebook for HAM10000 Dataset

This document describes **step-by-step instructions** for an AI agent to generate a complete Jupyter Notebook that trains the **CE-EEN-B0 (Contour Extraction + Extended EfficientNet-B0)** model on the Kaggle HAM10000 segmentation & classification dataset.

The notebook must include installation, preprocessing, training, saving, and model reuse.

---

## 1. Notebook Sections Overview  
The notebook **must** include the following sections, in this exact order:

1. **Title + Description**
2. **Install Required Packages**
3. **Dataset Structure Instructions**
4. **Imports and Global Config**
5. **Contour Extraction Preprocessing**
6. **Data Pipeline (tf.data)**
7. **Model Architecture (CE-EEN-B0)**
8. **Training Setup (callbacks, optimizer, LR schedule)**
9. **Training Code**
10. **Saving the Trained Model**
11. **Evaluation on Test Set**
12. **Reloading and Using Model for Inference**
13. **Appendix / Notes**

---

## 2. Required Packages  
The agent must include installation commands for:

- TensorFlow 2.x  
- OpenCV  
- Albumentations  
- Kaggle API (optional)  
- TensorFlow Addons  
- Matplotlib  
- Scikit-Learn  
- Seaborn  

Installation should use `pip install` inside notebook cells.

---

## 3. Dataset Instructions  
The notebook must specify the expected directory structure:

```
./data/ham10000/
    glioma/
    meningioma/
    pituitary/
    no_tumor/
```

If users download via Kaggle CLI, include optional commands:

```
!kaggle datasets download -d surajghuwalewal
!unzip ham1000-segmentation-and-classification.zip -d data/ham10000
```

---

## 4. Contour Extraction Preprocessing  
The notebook must include a full OpenCV contour extraction function:

Steps:

1. Convert to grayscale  
2. Gaussian blur  
3. Threshold using Otsu  
4. Find external contours  
5. Select largest contour  
6. Find extreme points (left, right, top, bottom)  
7. Crop and resize to model input size (180×180)  
8. Return processed RGB image  

Include a function to visualize before/after examples.

---

## 5. Data Pipeline  
The agent must implement:

### Train/val/test split:
- 70% train  
- 10% validation  
- 20% test  
- Stratified using `train_test_split`

### tf.data pipeline:
- Load image path + label  
- Use `tf.py_function` to apply the contour extraction  
- Normalize images to `[0,1]`  
- Augmentation: flips + rotation (if tfa available)  
- Create batched, prefetched datasets

Define:

```
train_ds
val_ds
test_ds
```

---

## 6. Model Architecture (CE-EEN-B0)  
The model must follow:

1. **EfficientNetB0** (include_top=False, imagenet pretrained)  
2. Add Conv2D(20) → MaxPool  
3. Add Conv2D(40) → MaxPool  
4. Add Conv2D(60) → MaxPool  
5. GAP → Dropout → Dense(128)  
6. Output Dense(4) softmax  

Loss: `sparse_categorical_crossentropy`  
Optimizer: Adam  
Metrics: accuracy  

---

## 7. Training Setup  
Include callbacks:

- **ModelCheckpoint** (best val accuracy)
- **ReduceLROnPlateau**  
- **EarlyStopping**  

Train:

```
EPOCHS = 25+
BATCH_SIZE = 16
```

---

## 8. Saving Model  
Save three forms:

1. Best weights:  
   `/mnt/data/ce_een_b0_best.h5`

2. Full model (HDF5):  
   `/mnt/data/ce_een_b0_final.h5`

3. SavedModel directory:  
   `/mnt/data/ce_een_b0_savedmodel/`

---

## 9. Evaluation  
Calculate:

- Test accuracy  
- Classification report  
- Confusion matrix  

---

## 10. Reload + Inference  
Include:

```
model = load_model('/mnt/data/ce_een_b0_final.h5')
```

And a reusable `predict_image()` function:

- Read image  
- Apply contour extraction  
- Preprocess  
- Predict  

---

## 11. Appendix  
Add reproducibility notes:

- GPU recommended  
- Increase epochs for improved accuracy  
- Fine-tuning EfficientNet optional  
- Ensure same preprocessing for inference  

---

## 12. Output Requirement  
The AI agent must output:

**A complete Jupyter Notebook (.ipynb)**  
containing all the above sections in order.

---
