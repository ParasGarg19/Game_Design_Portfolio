import PyPDF2
with open(r'C:\Users\ajain\Downloads\ParasGarg_2310992173_PlaySimple_Resume.pdf', 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    for i, page in enumerate(reader.pages):
        print(f'--- PAGE {i+1} ---')
        text = page.extract_text()
        print(text)
