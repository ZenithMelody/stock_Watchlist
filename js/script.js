const apiKey = "WNFWKUXDQ5284N0Q";

async function getStock() {
  const symbol = document.getElementById("dropdown").value;

  // Get stock price
  const quoteRes = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
  const quoteData = await quoteRes.json();
  const price = quoteData["Global Quote"]?.["05. price"];

  if (price) {
    const li = document.createElement("li");
    li.textContent = `${symbol}: $${parseFloat(price).toFixed(2)}`;
    document.getElementById("watchlist").appendChild(li);
  }

  // Get chart data
  const timeSeriesRes = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
  const timeSeriesData = await timeSeriesRes.json();
  const series = timeSeriesData["Time Series (Daily)"];

  if (!series) {
    alert("Chart data unavailable or API limit reached.");
    return;
  }

  const labels = Object.keys(series).slice(0, 10).reverse();
  const closingPrices = labels.map(date => parseFloat(series[date]["4. close"]));

  if (window.stockChartInstance) {
    window.stockChartInstance.destroy();
  }

  const ctx = document.getElementById("stockChart").getContext("2d");
  window.stockChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `${symbol} Closing Prices`,
        data: closingPrices,
        borderColor: "#2563eb",
        backgroundColor: "#93c5fd",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}