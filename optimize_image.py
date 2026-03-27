import os
import sys

import numpy as np
from PIL import Image

TARGET_WIDTH = 1200
TARGET_HEIGHT = 901

COLOR_TOLERANCE = 10


def load_image(path):
    img = Image.open(path).convert("RGB")
    return img


def get_border_pixels(img):
    arr = np.array(img)

    top = arr[0, :, :]
    bottom = arr[-1, :, :]
    left = arr[:, 0, :]
    right = arr[:, -1, :]

    border_pixels = np.concatenate([top, bottom, left, right], axis=0)
    return border_pixels


def find_dominant_color(border_pixels):
    """
    Groups pixels by approximate color similarity and returns
    the average of the largest cluster.
    """
    clusters = []

    for pixel in border_pixels:
        placed = False

        for cluster in clusters:
            if np.all(np.abs(cluster["mean"] - pixel) <= COLOR_TOLERANCE):
                cluster["pixels"].append(pixel)
                cluster["mean"] = np.mean(cluster["pixels"], axis=0)
                placed = True
                break

        if not placed:
            clusters.append({
                "pixels": [pixel],
                "mean": pixel.astype(float)
            })

    largest_cluster = max(clusters, key=lambda c: len(c["pixels"]))
    avg_color = np.mean(largest_cluster["pixels"], axis=0)

    return tuple(int(c) for c in avg_color)


def resize_and_letterbox(img, fill_color):
    img_ratio = img.width / img.height
    target_ratio = TARGET_WIDTH / TARGET_HEIGHT

    if img_ratio > target_ratio:
        # Fit width
        new_width = TARGET_WIDTH
        new_height = int(TARGET_WIDTH / img_ratio)
    else:
        # Fit height
        new_height = TARGET_HEIGHT
        new_width = int(TARGET_HEIGHT * img_ratio)

    resized = img.resize((new_width, new_height), Image.LANCZOS)

    canvas = Image.new("RGB", (TARGET_WIDTH, TARGET_HEIGHT), fill_color)

    offset_x = (TARGET_WIDTH - new_width) // 2
    offset_y = (TARGET_HEIGHT - new_height) // 2

    canvas.paste(resized, (offset_x, offset_y))

    return canvas


def save_webp(img, input_path):
    base, _ = os.path.splitext(input_path)
    output_path = base + ".webp"

    img.save(
        output_path,
        "WEBP",
        quality=90,      # high quality lossy
        method=6         # best compression effort
    )

    return output_path


def main():
    if len(sys.argv) != 2:
        print("Usage: python optimize_image.py path/to/image")
        sys.exit(1)

    input_path = sys.argv[1]

    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        sys.exit(1)

    img = load_image(input_path)

    border_pixels = get_border_pixels(img)
    dominant_color = find_dominant_color(border_pixels)

    result = resize_and_letterbox(img, dominant_color)
    output_path = save_webp(result, input_path)

    print(f"Saved optimized image to: {output_path}")


if __name__ == "__main__":
    main()
