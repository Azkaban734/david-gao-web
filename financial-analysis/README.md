# Buffett-Style Stock Screener

A stock analyser built around Warren Buffett's publicly documented investment methodology — owner earnings, ROIC, profit margins, and DCF intrinsic value.

---

## Setup

**Requirements:** Python 3.10+

### 1. Install dependencies

```bash
pip install yfinance requests pandas numpy streamlit
```

### 2. Navigate to the project folder

```bash
cd financial-analysis
```

---

## Running the Web App (Streamlit)

```bash
streamlit run app.py
```

Your browser will open automatically at `http://localhost:8501`.

**To use it:**
1. Type a ticker symbol into the input box (e.g. `KO`, `AAPL`, `IOSP`)
2. Click **Analyse**
3. Wait 5–15 seconds for data to load from Yahoo Finance
4. Results appear below — score breakdown and intrinsic value estimate

> Repeated lookups for the same ticker on the same day are instant — results are cached in `.screener_cache/`.

---

## Running from the Command Line

Analyse a single ticker and print results to the terminal:

```bash
python buffett_screener.py --ticker KO
```

Screen a custom list of tickers and save to CSV:

```bash
python buffett_screener.py --tickers AAPL MSFT KO
```

Screen the S&P 600 small-cap universe:

```bash
python buffett_screener.py --universe sp600
```

Skip margin of safety calculations (faster):

```bash
python buffett_screener.py --tickers AAPL KO --no-mos
```

---

## Scoring Criteria

Each stock is scored out of 100 across seven criteria:

| Criterion | Weight | What it measures |
|---|---|---|
| EPS Consistency | 20 | Consecutive profitable years + earnings CAGR |
| Return on Equity | 15 | Avg ROE >20%, penalises years below 15% |
| ROIC | 15 | NOPAT / (Equity + Debt), threshold ≥17% |
| Profit Margins | 10 | Gross >40%, Net >20% — moat signal |
| Debt & Liquidity | 15 | D/E, LT debt/NI, current ratio, interest coverage |
| Owner Earnings Yield | 15 | (NI + D&A − CapEx) / market cap |
| Capital Allocation | 10 | NI CAGR + buyback detection |

### Margin of Safety

Intrinsic value is calculated via a 10-year owner earnings DCF:
- **Discount rate:** 9%
- **Terminal growth:** 3%
- **MOS entry price:** 30% discount to the bull-case intrinsic value

---

## Notes

- Data is sourced from Yahoo Finance via `yfinance` (free, no API key required)
- ~4 years of annual financials are available; all historical scoring uses this window
- The 10-year DCF is a forward projection of owner earnings, not a historical lookback
- If you upgrade the screener, clear the cache first: delete the `.screener_cache/` folder
