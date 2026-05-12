from textblob import TextBlob
from Urgency import detect_urgency
import argparse

"""urgent.py

Combines keyword-based urgency detection (from `Urgency.detect_urgency`) with
simple sentiment analysis via TextBlob. When run from the command line you can
pass a reason string and the script will print both signals.
"""


def detect_sentiment(reason):
    """Return a simple sentiment-based urgency label.

    - sentiment polarity < -0.3 => High Urgency (negative tone)
    - -0.3 <= polarity <= 0.3 => Normal
    - polarity > 0.3 => Low Urgency / Positive
    """
    blob = TextBlob(reason)
    sentiment_score = blob.sentiment.polarity  # ranges from -1 (negative) to +1 (positive)

    if sentiment_score < -0.3:
        return "High Urgency (negative tone)", sentiment_score
    elif -0.3 <= sentiment_score <= 0.3:
        return "Normal", sentiment_score
    else:
        return "Low Urgency / Positive", sentiment_score


def combined_urgency(reason):
    """Return a combined dict with keyword urgency and sentiment score/label."""
    keyword_label = detect_urgency(reason)
    sentiment_label, sentiment_score = detect_sentiment(reason)
    return {
        "reason": reason,
        "keyword_urgency": keyword_label,
        "sentiment_urgency": sentiment_label,
        "sentiment_score": sentiment_score,
    }


def main():
    parser = argparse.ArgumentParser(description="Detect urgency from a text reason")
    parser.add_argument("reason", nargs="+", help="Reason text (wrap in quotes)")
    args = parser.parse_args()
    reason = " ".join(args.reason)

    result = combined_urgency(reason)
    print("Reason:", result["reason"])
    print("Keyword-based urgency:", result["keyword_urgency"])
    print(f"Sentiment-based urgency: {result['sentiment_urgency']} (score={result['sentiment_score']:.3f})")


if __name__ == '__main__':
    # Default quick test when running the script directly
    main()

