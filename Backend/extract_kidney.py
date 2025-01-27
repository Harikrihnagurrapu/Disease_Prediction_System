import pdfplumber
import re
import sys
import io

def extract_kidney_data(pdf_path):
    def extract_text_from_pdf(pdf_path):
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text

    def find_test_value(test, text):
        test_name_mapping = {
            'age': ['Age', 'Years'],
            'bp': ['Blood Pressure', 'BP'],
            'sg': ['Specific Gravity'],
            'al': ['Albumin'],
            'su': ['Sugar'],
            'rbc': ['Red Blood Cells', 'RBC'],
            'pc': ['Pus Cell', 'Pus Cells'],
            'pcc': ['Pus Cell Clumps'],
            'ba': ['Bacteria'],
            'bgr': ['Blood Glucose Random', 'Blood Sugar', 'Glucose'],
            'bu': ['Blood Urea', 'Urea'],
            'sc': ['Serum Creatinine', 'Creatinine'],
            'sod': ['Sodium', 'Na'],
            'pot': ['Potassium', 'K'],
            'hemo': ['Hemoglobin', 'Hb'],
            'pcv': ['Packed Cell Volume', 'PCV'],
            'wc': ['White Blood Cell Count', 'WBC'],
            'rc': ['Red Blood Cell Count', 'RBC Count'],
            'htn': ['Hypertension', 'HTN'],
            'dm': ['Diabetes Mellitus', 'DM'],
            'cad': ['Coronary Artery Disease', 'CAD'],
            'appet': ['Appetite'],
            'pe': ['Pedal Edema'],
            'ane': ['Anemia']
        }

        for possible_name in test_name_mapping.get(test, [test]):
            pattern = rf"{re.escape(possible_name)}.*?:?\s*(\d+\.?\d*|normal|abnormal|present|notpresent|yes|no|good|poor)\s*(?:mg/dL|g/dL|mmol/L|mEq/L|g/L|%|/cumm|/mm3)?"
            matches = re.findall(pattern, text, re.IGNORECASE | re.DOTALL)
            if matches:
                value = matches[-1].lower()
                if value in ['normal', 'no', 'notpresent', 'good']:
                    return '0'
                elif value in ['abnormal', 'yes', 'present', 'poor']:
                    return '1'
                else:
                    return value

        return None

    extracted_text = extract_text_from_pdf(pdf_path)

    tests_to_search = [
        'age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba', 'bgr', 
        'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc', 'htn', 
        'dm', 'cad', 'appet', 'pe', 'ane'
    ]

    results = {}

    for test in tests_to_search:
        value = find_test_value(test, extracted_text)
        results[test] = value if value is not None else None

    print(f"Extracted kidney results: {results}")
    return results

# Example usage:
# pdf_path = "path/to/your/kidney_report.pdf"
# result_dict = extract_kidney_data(pdf_path)
# print(result_dict)
