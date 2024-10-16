import sys
import spacy

# Load SpaCy model
nlp = spacy.load("en_core_web_sm")

# Get text from command line argument
text = sys.argv[1]

# Process the text
doc = nlp(text)
medicines = []

for ent in doc.ents:
    if ent.label_ == "PRODUCT":  # Adjust according to the model used
        medicines.append(ent.text)

print(", ".join(medicines))
