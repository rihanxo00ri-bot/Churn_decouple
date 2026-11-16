const API_URL = "http://127.0.0.1:8000/predict";

document.getElementById("churn-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const resultBox = document.getElementById("result-box");
  const submitBtn = document.getElementById("submit-btn");

  // Build JSON payload matching FastAPI's Customer Pydantic model
  const payload = {};
  new FormData(form).forEach((value, key) => {
    const element = form.elements[key];
    if (element.type === "number" || element.dataset.type === "int") {
      payload[key] = Number(value);
    } else {
      payload[key] = value;
    }
  });

  submitBtn.disabled = true;
  submitBtn.textContent = "Predicting...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData.detail));
    }

    const data = await response.json();
    const isChurn = data.churn_prediction === "Yes";

    resultBox.className = isChurn ? "churn-yes" : "churn-no";
    resultBox.innerHTML = `
      <strong>Churn Prediction:</strong> ${data.churn_prediction} <br/>
      <strong>Probability:</strong> ${(data.churn_probability * 100).toFixed(2)}% 
      (Threshold: ${(data.threshold_used * 100).toFixed(0)}%)
    `;
  } catch (err) {
    resultBox.className = "churn-yes";
    resultBox.textContent = `Error: ${err.message}. Make sure FastAPI is running on port 8000.`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Predict Churn";
  }
});