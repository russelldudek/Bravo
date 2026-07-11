from pathlib import Path
from weasyprint import HTML
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DOCS.mkdir(exist_ok=True)
ARTIFACTS = {
    "resume.html": ("russell-dudek-bravo-cpg-resume.pdf", 2),
    "cover-letter.html": ("russell-dudek-bravo-cpg-cover-letter.pdf", 1),
    "interview-brief.html": ("bravo-cpg-interview-thesis-brief.pdf", 2),
    "entry-plan.html": ("bravo-cpg-90-day-entry-plan.pdf", 1),
    "objections.html": ("bravo-cpg-hard-objection-analysis.pdf", 1),
    "executive-questions.html": ("bravo-cpg-executive-interview-questions.pdf", 1),
    "engagement-portfolio.html": ("bravo-cpg-engagement-portfolio-simulator.pdf", 1),
}
for html_name, (pdf_name, expected_pages) in ARTIFACTS.items():
    output = DOCS / pdf_name
    HTML(filename=str(ROOT / html_name), base_url=str(ROOT)).write_pdf(str(output))
    pages = len(PdfReader(str(output)).pages)
    if pages != expected_pages:
        raise SystemExit(f"{pdf_name}: expected {expected_pages} pages, generated {pages}")
    print(f"generated {pdf_name}: {pages} page(s)")
