import traceback
import sys

try:
    import models
    print("Models imported successfully!")
except Exception as e:
    print("Error importing models:")
    traceback.print_exc()
    sys.exit(1)
