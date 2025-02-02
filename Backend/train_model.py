import pandas as pd
from keras.models import Sequential
from keras.layers import Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# Load dataset (ensure the correct path to your CSV file)
df = pd.read_csv('latestdata.csv')

# Preprocess the data (example preprocessing, adjust according to your dataset)
df = df.fillna(df.median())
df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})
df['PCOS'] = df['PCOS'].map({'Yes': 1, 'No': 0})
df['Exercise'] = df['Exercise'].map({'Yes': 1, 'No': 0})
df['Ethenicity'] = df['Ethenicity'].map({'Caucasian': 0, 'American': 1, 'Asian': 2, 'Hispanic': 3, 'British': 4})

X = df.drop(columns=['Outcome'])
y = df['Outcome']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the data
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Define the neural network model
model = Sequential()
model.add(Dense(64, input_dim=X_train.shape[1], activation='relu'))
model.add(Dense(32, activation='relu'))
model.add(Dense(1, activation='sigmoid'))  # Binary classification output

# Compile the model
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_test, y_test))

# Save the model
model.save('neural_network_model.h5')

print("Neural network model saved as 'neural_network_model.h5'")
