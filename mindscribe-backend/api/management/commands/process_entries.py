import spacy
from django.core.management.base import BaseCommand
from api.models import JournalEntry
from spacytextblob.spacytextblob import SpacyTextBlob

# Load the spaCy model once
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe('spacytextblob')

class Command(BaseCommand):
    help = 'Processes pending journal entries to analyze sentiment.'

    def handle(self, *args, **options):
        # 1. Get all entries that are still "PENDING"
        pending_entries = JournalEntry.objects.filter(status='PENDING')

        if not pending_entries.exists():
            self.stdout.write(self.style.SUCCESS('No pending entries to process.'))
            return

        self.stdout.write(f'Found {pending_entries.count()} entries to process...')

        # 2. Loop through each one and process it
        for entry in pending_entries:
            try:
                # Perform the NLP analysis
                doc = nlp(entry.content)

                # Get the polarity score (the number)
                score = doc._.blob.polarity

                # --- NEW LOGIC HERE ---
                # Translate the score into a label
                label = 'Neutral'
                if score > 0.2:
                    label = 'Positive'
                elif score < -0.2:
                    label = 'Negative'
                # (We use 0.2 as a threshold so it's not *too* sensitive)
                # --- END NEW LOGIC ---

                # Update the database entry
                entry.sentiment_score = score
                entry.mood = label  # <-- We now save the label!
                entry.status = 'PROCESSED'
                entry.save()

                # Updated the print message
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully processed entry {entry.id}. Score: {score:.2f}, Mood: {label}'))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to process entry {entry.id}: {e}'))
        self.stdout.write(self.style.SUCCESS('All pending entries have been processed.'))