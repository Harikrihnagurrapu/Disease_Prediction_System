import pandas as pd
import random

# Read the original CSV file
df = pd.read_csv('datasets/kidney_disease.csv')

# Remove the last row
df = df.iloc[:-1]

# Remove the last column
df = df.iloc[:, :-1]

# Randomly select 20 rows
random_rows = df.sample(n=40, random_state=random.randint(1, 1000))

# Reset the index of random_rows
random_rows = random_rows.reset_index(drop=True)

# Add a new column 'Patient_ID' at the beginning
random_rows.insert(0, 'Patient_ID', range(1, len(random_rows) + 1))

# Save the selected rows to a new CSV file
random_rows.to_csv('Sample_reports/kidney_disease_sample.csv', index=False)

print("New CSV file with 20 random rows and Patient_ID has been created.")
