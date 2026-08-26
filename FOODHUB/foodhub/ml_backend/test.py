import joblib

# Load rules
rules = joblib.load("model/dish_recommender.joblib")

def recommend_items(input_dish):
    # Filter rules where input_dish is in the antecedents
    recommendations = []

    for _, row in rules.iterrows():
        if input_dish in row['antecedents']:
            recommendations.extend(list(row['consequents']))

    # Remove duplicates
    recommendations = list(set(recommendations))

    if recommendations:
        print(f"Recommended items with '{input_dish}': {', '.join(recommendations)}")
    else:
        print(f"No recommendations found for '{input_dish}'.")

if __name__ == "__main__":
    user_input = input("Enter a dish: ")
    recommend_items(user_input.strip())
