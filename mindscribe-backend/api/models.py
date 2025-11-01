from django.db import models
from django.contrib.auth.models import User

class JournalEntry(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSED', 'Processed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entries')
    content = models.TextField()
    mood = models.CharField(max_length=50, blank=True, null=True)
    sentiment_score = models.FloatField(blank=True, null=True)
    topics = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Entry for {self.user.username} on {self.created_at.date()}'