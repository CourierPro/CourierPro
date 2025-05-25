async function trackPackage() {
  const input = document.getElementById("trackingInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!input) {
    resultDiv.textContent = "Please enter a tracking number or phone number.";
    return;
  }

  try {
    const response = await fetch('tracking-data.json');
    if (!response.ok) throw new Error("Failed to load tracking data");

    const data = await response.json();

    // Try to find by tracking number (key)
    if (data[input]) {
      displayInfo(data[input], resultDiv);
      return;
    }

    // Search all entries for matching phone number
    const entry = Object.values(data).find(item => item.phone === input);

    if (entry) {
      displayInfo(entry, resultDiv);
    } else {
      resultDiv.textContent = "No package found for that tracking number or phone number.";
    }
  } catch (error) {
    resultDiv.textContent = "Error loading tracking data.";
    console.error(error);
  }
}

function displayInfo(info, container) {
  let html = `<p><strong>Status:</strong> ${info.status}</p>`;
  html += `<p><strong>Estimated Delivery:</strong> ${info.estimatedDelivery}</p>`;
  html += `<p><strong>Current Location:</strong> ${info.currentLocation}</p>`;
  html += `<p><strong>Service:</strong> ${info.service}</p>`;
  html += `<p><strong>Delivery Attempts:</strong> ${info.deliveryAttempts}</p>`;
  html += `<p><strong>Recipient:</strong> ${info.recipient}</p>`;
  html += `<p><strong>Sender:</strong> ${info.sender}</p>`;
  if (info.phone) {
    html += `<p><strong>Phone Number:</strong> ${info.phone}</p>`;
  }
  html += "<p><strong>History:</strong></p><ul>";
  info.history.forEach(event => {
    html += `<li>${event}</li>`;
  });
  html += "</ul>";

  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tracking-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();    // Stop the form from reloading the page
    trackPackage();        // <-- This calls your function!
  });
});
