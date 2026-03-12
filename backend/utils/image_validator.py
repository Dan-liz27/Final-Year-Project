import cv2
import numpy as np
from PIL import Image
import io

def check_image_quality(image_bytes):
    """
    Analyze image quality and return detailed metrics.
    
    Args:
        image_bytes: Raw image bytes
    
    Returns:
        dict: Quality metrics and recommendations
    """
    try:
        # Load image
        image = Image.open(io.BytesIO(image_bytes))
        img_array = np.array(image)
        
        # Convert to grayscale for analysis
        if len(img_array.shape) == 3:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = img_array
        
        # Check resolution
        height, width = gray.shape
        resolution_ok = height >= 300 and width >= 300
        
        # Check blur (Laplacian variance)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_ok = laplacian_var > 100
        
        # Check brightness
        mean_brightness = np.mean(gray)
        brightness_ok = 50 <= mean_brightness <= 200
        
        # Check contrast
        contrast = gray.std()
        contrast_ok = contrast > 30
        
        # Calculate individual scores
        scores = {
            'resolution': 100 if resolution_ok else max(0, (min(height, width) / 300) * 100),
            'sharpness': min(100, (laplacian_var / 500) * 100),
            'brightness': 100 - abs(mean_brightness - 125) / 1.25,
            'contrast': min(100, (contrast / 80) * 100)
        }
        
        # Calculate overall quality score
        overall_score = sum(scores.values()) / len(scores)
        
        # Generate recommendations
        recommendations = []
        if not resolution_ok:
            recommendations.append("Image resolution is too low. Use a higher quality camera.")
        if not blur_ok:
            recommendations.append("Image appears blurry. Hold camera steady and ensure good focus.")
        if mean_brightness < 50:
            recommendations.append("Image is too dark. Improve lighting conditions.")
        elif mean_brightness > 200:
            recommendations.append("Image is too bright. Reduce direct lighting or flash.")
        if not contrast_ok:
            recommendations.append("Low contrast. Ensure good lighting and clear background.")
        
        return {
            'overall_score': round(overall_score, 1),
            'metrics': {
                'resolution': {
                    'value': f'{width}x{height}',
                    'score': round(scores['resolution'], 1),
                    'ok': resolution_ok
                },
                'sharpness': {
                    'value': round(laplacian_var, 1),
                    'score': round(scores['sharpness'], 1),
                    'ok': blur_ok
                },
                'brightness': {
                    'value': round(mean_brightness, 1),
                    'score': round(scores['brightness'], 1),
                    'ok': brightness_ok
                },
                'contrast': {
                    'value': round(contrast, 1),
                    'score': round(scores['contrast'], 1),
                    'ok': contrast_ok
                }
            },
            'recommendations': recommendations,
            'quality_level': 'Good' if overall_score >= 80 else 'Fair' if overall_score >= 60 else 'Poor'
        }
    
    except Exception as e:
        raise ValueError(f"Failed to analyze image quality: {str(e)}")
