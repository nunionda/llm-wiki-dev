import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import json
import os

# Set Nordic Palette
NORDIC_WHITE = "#F9F9F9"
NORDIC_BLUE = "#4A6572"
NORDIC_SAGE = "#829079"
NORDIC_CHARCOAL = "#344955"
NORDIC_MINT = "#D1E8E2"

def setup_nordic_style():
    plt.rcParams['figure.facecolor'] = NORDIC_WHITE
    plt.rcParams['axes.facecolor'] = NORDIC_WHITE
    plt.rcParams['axes.edgecolor'] = NORDIC_CHARCOAL
    plt.rcParams['axes.labelcolor'] = NORDIC_CHARCOAL
    plt.rcParams['xtick.color'] = NORDIC_CHARCOAL
    plt.rcParams['ytick.color'] = NORDIC_CHARCOAL
    plt.rcParams['font.family'] = 'Sans-Serif'

def analyze_finance():
    # 1. Finance: Volatility & Sharpe Ratio
    np.random.seed(42)
    dates = pd.date_range(start="2023-01-01", periods=100)
    data = {
        "Date": dates,
        "AAPL": 150 + np.cumsum(np.random.normal(0.1, 1.2, 100)),
        "TSLA": 200 + np.cumsum(np.random.normal(0.2, 3.5, 100))
    }
    df = pd.DataFrame(data).melt(id_vars="Date", var_name="Ticker", value_name="Price")
    
    plt.figure(figsize=(10, 6))
    sns.lineplot(data=df, x="Date", y="Price", hue="Ticker", palette=[NORDIC_BLUE, NORDIC_SAGE])
    plt.title("Stock Volatility Analysis: Performance & Variance", color=NORDIC_CHARCOAL, size=14)
    plt.savefig('output/multi_industry/finance_volatility.png', dpi=300, facecolor=NORDIC_WHITE)
    plt.close()
    return "Finance analysis complete."

def analyze_marketing():
    # 2. Marketing: ROI & Multi-touch Attribution
    channels = ["Social", "Search", "Email", "Referral"]
    rev = [45000, 78000, 32000, 12000]
    spend = [15000, 20000, 5000, 2000]
    roi = [r/s for r, s in zip(rev, spend)]
    
    df = pd.DataFrame({"Channel": channels, "Revenue": rev, "Spend": spend, "ROI": roi})
    
    plt.figure(figsize=(10, 6))
    sns.barplot(data=df, x="Channel", y="ROI", palette=[NORDIC_BLUE, NORDIC_SAGE, NORDIC_CHARCOAL, NORDIC_MINT])
    plt.title("Marketing Channel ROI Efficiency", color=NORDIC_CHARCOAL, size=14)
    plt.savefig('output/multi_industry/marketing_roi.png', dpi=300, facecolor=NORDIC_WHITE)
    plt.close()
    return "Marketing analysis complete."

def analyze_healthcare():
    # 3. Healthcare: BP & Cholesterol Correlation
    np.random.seed(42)
    bp = np.random.normal(130, 15, 200)
    chol = 150 + 0.5 * bp + np.random.normal(0, 10, 200)
    df = pd.DataFrame({"BP_Systolic": bp, "Cholesterol": chol})
    
    plt.figure(figsize=(10, 6))
    sns.regplot(data=df, x="BP_Systolic", y="Cholesterol", scatter_kws={'alpha':0.4, 'color':NORDIC_BLUE}, line_kws={'color':NORDIC_SAGE})
    plt.title("Patient Vital Correlation: Blood Pressure vs Cholesterol", color=NORDIC_CHARCOAL, size=14)
    plt.savefig('output/multi_industry/healthcare_correlation.png', dpi=300, facecolor=NORDIC_WHITE)
    plt.close()
    return "Healthcare analysis complete."

def analyze_ecommerce():
    # 4. E-commerce: LTV & AOV Basket Analysis
    np.random.seed(42)
    ltv = np.random.lognormal(4, 0.8, 500) # LTV distribution
    df = pd.DataFrame({"LTV": ltv})
    
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df, x="LTV", color=NORDIC_BLUE, kde=True, alpha=0.6)
    plt.title("Customer Lifetime Value (LTV) Distribution", color=NORDIC_CHARCOAL, size=14)
    plt.savefig('output/multi_industry/ecommerce_ltv.png', dpi=300, facecolor=NORDIC_WHITE)
    plt.close()
    return "E-commerce analysis complete."

def run_all():
    os.makedirs('output/multi_industry', exist_ok=True)
    setup_nordic_style()
    analyze_finance()
    analyze_marketing()
    analyze_healthcare()
    analyze_ecommerce()

if __name__ == "__main__":
    run_all()
