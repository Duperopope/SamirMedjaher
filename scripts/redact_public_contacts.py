#!/usr/bin/env python3
# privacy-audit-version: 2
from __future__ import annotations
import re
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
CONTACT_URL = "https://duperopope.github.io/SamirMedjaher/contact.html"

EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
PHONE_RE = re.compile(r"(?<!\d)(?:\+33|0)[1-9](?:[ .\-]?\d{2}){4}(?!\d)")
DIRECT_URI_RE = re.compile(r"^(?:mailto:|tel:|https?://(?:wa\.me|api\.whatsapp\.com)/)", re.I)

PUBLIC_TEXT_FILES = [
    p for p in ROOT.iterdir()
    if p.is_file() and p.suffix.lower() in {".html", ".js", ".css", ".json", ".xml", ".txt"}
]

def redact_pdf(path: Path) -> bool:
    doc = fitz.open(path)
    changed = False
    for page in doc:
        text = page.get_text("text")
        matches = set(EMAIL_RE.findall(text)) | set(PHONE_RE.findall(text))
        for value in matches:
            for rect in page.search_for(value):
                page.add_redact_annot(rect, fill=(1, 1, 1))
                changed = True

        for link in list(page.get_links()):
            uri = str(link.get("uri") or "")
            if DIRECT_URI_RE.search(uri):
                try:
                    page.delete_link(link)
                    changed = True
                except Exception:
                    pass

        if changed:
            page.apply_redactions()

        footer_text = f"Contact professionnel : {CONTACT_URL}"
        if CONTACT_URL not in text:
            y = max(10, page.rect.height - 13)
            page.insert_text(
                fitz.Point(24, y),
                footer_text,
                fontsize=6.5,
                color=(0.35, 0.35, 0.35),
                overlay=True,
            )
            changed = True

    if changed:
        tmp = path.with_suffix(path.suffix + ".tmp")
        doc.save(tmp, garbage=4, deflate=True, clean=True)
        doc.close()
        tmp.replace(path)
    else:
        doc.close()
    return changed

def audit_text_files() -> list[str]:
    findings = []
    for path in PUBLIC_TEXT_FILES:
        raw = path.read_text(encoding="utf-8", errors="ignore")
        for label, pattern in (
            ("email", EMAIL_RE),
            ("phone", PHONE_RE),
            ("mailto", re.compile(r"mailto:", re.I)),
            ("tel", re.compile(r"tel:", re.I)),
            ("whatsapp", re.compile(r"https?://(?:wa\.me|api\.whatsapp\.com)/", re.I)),
        ):
            if pattern.search(raw):
                findings.append(f"{path.name}: {label}")
    return findings

def audit_pdfs() -> list[str]:
    findings = []
    for path in sorted(ROOT.glob("*.pdf")):
        doc = fitz.open(path)
        for i, page in enumerate(doc):
            text = page.get_text("text")
            if EMAIL_RE.search(text):
                findings.append(f"{path.name} page {i+1}: email")
            if PHONE_RE.search(text):
                findings.append(f"{path.name} page {i+1}: phone")
            for link in page.get_links():
                uri = str(link.get("uri") or "")
                if DIRECT_URI_RE.search(uri):
                    findings.append(f"{path.name} page {i+1}: direct contact link")
        doc.close()
    return findings

def main() -> int:
    changed = []
    for path in sorted(ROOT.glob("*.pdf")):
        if redact_pdf(path):
            changed.append(path.name)

    findings = audit_text_files() + audit_pdfs()
    print("Sanitized PDFs:", ", ".join(changed) if changed else "none")
    if findings:
        print("Privacy audit failed:")
        for item in findings:
            print(" -", item)
        return 1
    print("Public contact privacy audit: PASS")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
