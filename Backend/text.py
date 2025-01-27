from extract import extract_medical_data

pdf_path = "Sample_reports/Report1.pdf"
result_array = extract_medical_data(pdf_path)
print(result_array)