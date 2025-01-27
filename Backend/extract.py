import pdfplumber
import re
import sys
import io

def extract_medical_data(pdf_path):
    # Remove or comment out the following line:
    # sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    def extract_text_from_pdf(pdf_path):
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text

    def find_test_value(test_name, text):
        test_name_mapping = {
            'Total_Bilirubin': ['Total Bilirubin', 'Bilirubin Total', 'Bilirubin, total'],
            'Direct_Bilirubin': ['Direct Bilirubin', 'Conjugated Bilirubin', 'Bilirubin Direct', 'Bilirubin, direct'],
            'Alkaline_Phosphotase': ['Alkaline Phosphatase (ALP)', 'ALP', 'Alkaline Phosphatase', 'Alk Phos'],
            'Alamine_Aminotransferase': ['ALT (SGPT)', 'SGPT', 'ALT'],
            'Aspartate_Aminotransferase': ['AST (SGOT)', 'SGOT', 'AST'],
            'Total_Protiens': ['Total Protein', 'Total Proteins'],
            'Albumin': ['Albumin'],
            'Albumin_and_Globulin_Ratio': ['A : G Ratio', 'Albumin Globulin Ratio', 'A/G Ratio', 'AG Ratio', 'ALBUMIN/GLOBULIN RATIO']
        }

        if test_name == 'Albumin_and_Globulin_Ratio':
            for possible_name in test_name_mapping[test_name]:
                pattern = rf"{re.escape(possible_name)}.*?(\d+\.?\d*)"
                match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
                if match:
                    value = float(match.group(1))
                    if 0.5 <= value <= 5:  # Typical range for A:G ratio
                        return value
            print(f"Warning: A:G ratio not found or out of typical range. Please verify manually.")
            return None

        # Existing code for other tests
        for possible_name in test_name_mapping.get(test_name, [test_name]):
            pattern = rf"{re.escape(possible_name)}.*?(\d+\.?\d*)\s*(?:mg/dL|g/dL|U/L|IU/L)"
            matches = re.findall(pattern, text, re.IGNORECASE | re.DOTALL)
            if matches:
                return float(matches[-1])

        return None

    extracted_text = extract_text_from_pdf(pdf_path)

    tests_to_search = [
        'Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin',
        'Alkaline_Phosphotase', 'Alamine_Aminotransferase',
        'Aspartate_Aminotransferase', 'Total_Protiens', 'Albumin',
        'Albumin_and_Globulin_Ratio'
    ]

    results = []

    for test in tests_to_search:
        if test == 'Age':
            age_match = re.search(r'(?:Age|DOB|Date of Birth).*?(\d+)', extracted_text, re.IGNORECASE | re.DOTALL)
            value = int(age_match.group(1)) if age_match else 0
            #print(f"Age: {value}")  # Debug print
            results.append(value)
        elif test == 'Gender':
            gender_match = re.search(r'(?:Gender|Sex)\s*:?\s*(\w+)', extracted_text, re.IGNORECASE)
            value = 1 if gender_match and gender_match.group(1).lower() == 'female' else 0
            #print(f"Gender: {'Female' if value == 1 else 'Male'}")  # Debug print
            results.append(value)
        else:
            value = find_test_value(test, extracted_text)
            if value is not None:
                results.append(value)
            else:
                results.append(0)
                print(f"Warning: Test '{test}' not found or invalid. Using 0 as default.")

    #print(f"Final results: {results}")  # Debug print
    print(f"Extracted results: {results}")
    return results

# Example usage:
# pdf_path = "path/to/your/medical_report.pdf"
# result_array = extract_medical_data(pdf_path)
# print(result_array)