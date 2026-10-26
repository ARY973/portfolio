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
        FinTech Credit Risk — Scoring Borrowers for a Micro-Lender
      </h1>

      <p className="text-gray-200 leading-relaxed mb-6">
        A lender has to balance two opposing failures: too strict and it denies
        credit to people who deserve it, too lenient and it books losses. I
        benchmarked four models on 4,269 loan applications to give a Head of
        Risk something to set policy against.
      </p>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 mb-10">
        <h2 className="text-sm font-semibold text-amber-300 mb-1">
          On the target variable
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          This dataset labels each application approved or rejected — there is no
          observed default flag. I treat rejection as a proxy for
          default-prone risk, which is a real limitation: approval is the
          lender&apos;s decision at origination, default is what the borrower
          does afterward. In deployment the target would be an observed
          default or late payment after issuance.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Results</h2>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-gray-400 text-left">
              <th className="py-2 pr-4 font-medium">Model</th>
              <th className="py-2 px-3 font-medium text-right">Accuracy</th>
              <th className="py-2 px-3 font-medium text-right">F1</th>
              <th className="py-2 pl-3 font-medium text-right">ROC-AUC</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {[
              ["Random Forest", "0.9965", "0.9953", "0.9995"],
              ["Gradient Boosting", "0.9941", "0.9922", "0.9990"],
              ["MLP (neural net)", "0.9684", "0.9579", "0.9939"],
              ["Logistic Regression", "0.9157", "0.8857", "0.9744"],
            ].map(([m, a, f, r]) => (
              <tr key={m} className="border-b border-slate-800">
                <td className="py-2 pr-4">{m}</td>
                <td className="py-2 px-3 text-right tabular-nums">{a}</td>
                <td className="py-2 px-3 text-right tabular-nums">{f}</td>
                <td className="py-2 pl-3 text-right tabular-nums">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-10">
        Tree ensembles clearly win. I recommended gradient boosting as the
        production scorer — near-identical to random forest but better
        probability quality — with logistic regression kept as the
        interpretable benchmark for audit and policy conversations.
      </p>

      <h2 className="text-2xl font-semibold mb-3">
        The finding that mattered
      </h2>

      <p className="text-gray-200 leading-relaxed mb-4">
        CIBIL score dominates every model, so I retrained gradient boosting
        with it removed, to simulate a thin-file borrower with no credit
        history. Accuracy fell from <strong>0.99 to 0.607</strong>, recall to
        0.124, ROC-AUC to 0.586 — barely better than guessing.
      </p>

      <p className="text-gray-300 leading-relaxed mb-10">
        That is the business answer, not the leaderboard. A micro-lender
        serving underbanked borrowers cannot score credit-invisible applicants
        on this feature set at all. It needs alternative data — cash-flow
        stability, rent and utility history, transaction signals — or
        progressive lending, where small starter loans build an internal
        behavioural record.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Baseline pipeline</h2>

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