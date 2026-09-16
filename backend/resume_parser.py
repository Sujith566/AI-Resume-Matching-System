from pypdf import PdfReader
from docx import Document
from pathlib import Path


def extract_text_from_resume(file_path):

    extension = Path(file_path).suffix.lower()

    # PDF
    if extension == ".pdf":

        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""

        return text


    # DOCX
    elif extension == ".docx":

        document = Document(file_path)

        text = ""

        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"

        return text


    else:
        raise ValueError(
            "Only PDF and DOCX files are supported."
        )

if __name__ == "__main__":

    file_path = 'data/Resume.pdf'
    text = extract_text_from_resume(file_path)

    print(text)