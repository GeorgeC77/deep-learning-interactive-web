import fitz  # PyMuPDF
import json
from pathlib import Path

PDF_PATH = Path("e:/python_project/Lecture/Deep_learning/Deep Learning Foundations and Concepts (Christopher Bishop  Hugh Bishop).pdf")
OUT_DIR = Path(__file__).parent / "extracted"
OUT_DIR.mkdir(exist_ok=True)

def main():
    doc = fitz.open(PDF_PATH)
    print(f"Total pages: {doc.page_count}")

    # Extract TOC
    toc = doc.get_toc()
    toc_data = []
    for level, title, page in toc:
        toc_data.append({"level": level, "title": title, "page": page})
    (OUT_DIR / "toc.json").write_text(json.dumps(toc_data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"TOC entries: {len(toc_data)}")

    # Print TOC preview
    for item in toc_data[:60]:
        print(f"{'  ' * (item['level'] - 1)}{item['title']} ... p.{item['page']}")

    # Chapter page ranges (0-based) - will refine after TOC
    # Ch 1: Deep Learning Revolution
    # Ch 2: Probabilities
    # Ch 3: Standard Distributions
    # Ch 4: Single-layer Networks: Regression
    ranges = {
        "ch01_deep_learning_revolution": (19, 41),   # approx PDF pages 20-41
        "ch02_probabilities": (41, 83),              # approx PDF pages 42-83
        "ch03_standard_distributions": (83, 129),    # approx PDF pages 84-129
        "ch04_single_layer_regression": (129, 149),  # approx PDF pages 130-149
    }

    for name, (start, end) in ranges.items():
        text_parts = []
        for i in range(start, min(end, doc.page_count)):
            page = doc.load_page(i)
            text = page.get_text()
            text_parts.append(f"\n--- Page {i+1} ---\n{text}")
        (OUT_DIR / f"{name}.txt").write_text("".join(text_parts), encoding="utf-8")
        print(f"Extracted {name}: pages {start+1}-{end}")

    doc.close()

if __name__ == "__main__":
    main()
