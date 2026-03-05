import CodeBlock from "../../components/CodeBlock";

const code = `
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import time

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

# Load dataset
df = pd.read_csv("loan_approval_dataset.csv")

# Clean column names
df.columns = df.columns.str.strip()

# Convert loan status to binary
df['loan_status'] = df['loan_status'].astype(str).str.strip().str.lower()

df['loan_status'] = df['loan_status'].replace({
    'approved': 0,
    'rejected': 1
})

# Dataset overview
print(df.shape)
print(df.info())
print(df.describe())

# Class distribution
counts = df['loan_status'].value_counts().sort_index()
perc = counts / counts.sum() * 100

plt.bar(['Approved (0)', 'Rejected (1)'], counts.values)
plt.title(f"Class Balance: Approved={perc[0]:.1f}%, Rejected={perc[1]:.1f}%")
plt.ylabel("Count")
plt.show()

# Credit score vs loan risk
plt.figure(figsize=(6,4))
sns.boxplot(x='loan_status', y='cibil_score', data=df)
plt.title("Credit Score vs Loan Risk")
plt.show()

# Income vs loan risk
plt.figure(figsize=(6,4))
sns.boxplot(x='loan_status', y='income_annum', data=df)
plt.title("Income vs Loan Risk")
plt.show()

# Feature engineering
df['loan_income_ratio'] = df['loan_amount'] / df['income_annum']

plt.figure(figsize=(6,4))
sns.boxplot(x='loan_status', y='loan_income_ratio', data=df)
plt.title("Loan-to-Income Ratio vs Risk")
plt.show()

# Encode categorical variables
df['education'] = df['education'].astype(str).str.strip()
df['self_employed'] = df['self_employed'].astype(str).str.strip()

df['education'] = df['education'].map({
    'Graduate': 1,
    'Not Graduate': 0
})

df['self_employed'] = df['self_employed'].map({
    'Yes': 1,
    'No': 0
})

# Correlation analysis
plt.figure(figsize=(10,8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title("Feature Correlation")
plt.show()

# Split features and labels
X = df.drop(columns=['loan_status', 'loan_id'])
y = df['loan_status']

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Feature scaling
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Logistic Regression Model
from sklearn.linear_model import LogisticRegression

model_lr = LogisticRegression()

model_lr.fit(X_train_scaled, y_train)

y_pred = model_lr.predict(X_test_scaled)
y_prob = model_lr.predict_proba(X_test_scaled)[:,1]

# Evaluation metrics
def eval_binary(y_true, y_pred, y_prob):
    return {
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred),
        "recall": recall_score(y_true, y_pred),
        "f1": f1_score(y_true, y_pred),
        "roc_auc": roc_auc_score(y_true, y_prob)
    }

results = eval_binary(y_test, y_pred, y_prob)

print(results)
`;

export default function ProjectPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-white">

      <h1 className="text-4xl font-semibold mb-6">
        FinTech Loan Default Risk Modeling
      </h1>

      <p className="text-gray-200 leading-relaxed mb-10">
        Built and evaluated multiple classification models to predict loan
        default probability using cross-validation and feature engineering.
      </p>

      <CodeBlock code={code} />

      <a
        href="/projects/Ryan_Report.pdf"
        target="_blank"
        className="inline-block mt-8 text-blue-300 hover:text-blue-200"
      >
        View Full Analysis →
      </a>

    </section>
  );
}