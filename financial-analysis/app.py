"""
Buffett Screener — Single Ticker Web UI
Run:  streamlit run app.py
"""

import streamlit as st
from buffett_screener import fetch_with_cache, compute_score, margin_of_safety

st.set_page_config(page_title="Buffett Screener", page_icon="📈", layout="centered")

st.title("📈 Buffett-Style Stock Analyser")
st.caption("Owner earnings · ROIC · Margins · DCF intrinsic value")

ticker_input = st.text_input("Ticker symbol", placeholder="e.g. AAPL, KO, IOSP").strip().upper()

if st.button("Analyse", type="primary") and ticker_input:
    with st.spinner(f"Fetching data for {ticker_input}…"):
        sd = fetch_with_cache(ticker_input, cache_dir=".screener_cache", delay=0.5)

    if sd.error:
        st.error(f"Could not fetch data for **{ticker_input}**: {sd.error}")
        st.stop()

    r = compute_score(sd)
    m = margin_of_safety(sd)

    # ── Header ──────────────────────────────────────────────────────────
    st.subheader(r["Name"])
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Score", f"{r['Total Score']:.1f} / 100")
    col2.metric("Sector", r["Sector"])
    col3.metric("Market Cap", r["Mkt Cap"])

    st.divider()

    # ── Score breakdown ──────────────────────────────────────────────────
    st.subheader("Score Breakdown")

    criteria = [
        ("EPS Consistency",     "EPS Consistency (20)",       20),
        ("Return on Equity",    "ROE (15)",                   15),
        ("ROIC",                "ROIC (15)",                  15),
        ("Profit Margins",      "Margins (10)",               10),
        ("Debt & Liquidity",    "Debt & Liquidity (15)",      15),
        ("Owner Earnings Yld",  "Owner Earnings Yield (15)",  15),
        ("Capital Allocation",  "Capital Allocation (10)",    10),
    ]

    for label, key, weight in criteria:
        raw = r[key]
        pts_str, _, detail = raw.partition(" — ")
        pts = float(pts_str)
        pct = pts / weight

        with st.container():
            c1, c2 = st.columns([3, 7])
            c1.markdown(f"**{label}**  \n`{pts:.0f} / {weight}`")
            c2.progress(pct, text=detail)

    st.divider()

    # ── Margin of Safety ─────────────────────────────────────────────────
    st.subheader("Margin of Safety — Owner Earnings DCF")
    st.caption("10-year DCF @ 9% discount rate · 3% terminal growth · 30% MOS buffer")

    if m["Price"] is None:
        st.warning(m["MOS Status"])
    elif m["OE/Share"] is None:
        st.info(f"Price: **${m['Price']}** — {m['MOS Status']}")
    else:
        status = m["MOS Status"]
        if status == "IN MOS ZONE":
            st.success(f"✅ {status} — trading below intrinsic value with margin of safety")
        elif status == "APPROACHING MOS":
            st.warning(f"⚠️ {status} — near the buy zone")
        else:
            st.error(f"❌ {status}")

        mc1, mc2, mc3, mc4, mc5 = st.columns(5)
        mc1.metric("Current Price",     f"${m['Price']}")
        mc2.metric("Owner Earnings/sh", f"${m['OE/Share']}")
        mc3.metric("Intrinsic Low",     f"${m['Intrinsic Low']}")
        mc4.metric("Intrinsic High",    f"${m['Intrinsic High']}")
        mc5.metric("MOS Entry (−30%)",  f"${m['MOS Entry']}")
