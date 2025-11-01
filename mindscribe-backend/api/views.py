from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, JournalEntrySerializer
from .models import JournalEntry
from django.db.models import Count
from django.db.models.functions import TruncDay, Round
from rest_framework.views import APIView
from django.db import models
from rest_framework.permissions import IsAuthenticated
import spacy
from spacytextblob.spacytextblob import SpacyTextBlob

nlp = spacy.load("en_core_web_sm")
nlp.add_pipe('spacytextblob')
# 1. User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': response.data
        })

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username
                }
            })
        else:
            return Response({'error': 'Invalid Credentials'}, status=400)

# 2. Journal Entry List & Create View
class JournalEntryListCreateView(generics.ListCreateAPIView):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Get the text content from the request
        content = serializer.validated_data.get('content')

        # 1. Perform the NLP analysis *immediately*
        doc = nlp(content)
        score = doc._.blob.polarity

        # 2. Translate score to a label
        label = 'Neutral'
        if score > 0.2:
            label = 'Positive'
        elif score < -0.2:
            label = 'Negative'

        # 3. Save everything to the database at once
        serializer.save(
            user=self.request.user,
            sentiment_score=score,
            mood=label,
            status='PROCESSED'  # Set as PROCESSED right away
        )


# 3. Dashboard Data View
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user

        # 1. Get all processed entries for the user
        processed_entries = JournalEntry.objects.filter(
            user=user,
            status='PROCESSED'
        )

        # 2. Calculate Mood Counts (for a pie chart)
        mood_counts = processed_entries.values('mood').annotate(
            count=Count('mood')
        ).order_by('mood')

        # 3. Calculate Sentiment Trend (for a line chart)
        # This groups entries by the day they were created
        sentiment_trend = processed_entries.annotate(
            day=TruncDay('created_at')
        ).values('day').annotate(
            average_score=Round(models.Avg('sentiment_score'), 3)
        ).order_by('day')

        # 4. Get recent entries
        recent_entries = processed_entries.order_by('-created_at')[:5]

        # We use the existing serializer for this part
        recent_entries_serializer = JournalEntrySerializer(recent_entries, many=True)

        # 5. Compile the data into a single response
        dashboard_data = {
            'total_entries': processed_entries.count(),
            'mood_counts': list(mood_counts),
            'sentiment_trend': list(sentiment_trend),
            'recent_entries': recent_entries_serializer.data
        }

        return Response(dashboard_data)