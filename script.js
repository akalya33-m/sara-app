// Autofill location with simulated GPS
function useLocation(inputId) {
  document.getElementById(inputId).value = "Using simulated GPS: Salem, Tamil Nadu";
}

// Handle request form submission and display matching mechanics
document.addEventListener('DOMContentLoaded', () => {
  const requestForm = document.querySelector('form');
  const resultsDiv = document.getElementById('results');

  if (requestForm && resultsDiv) {
    requestForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(requestForm);
      const data = {
        fullName: formData.get('fullName'),
        mobileNumber: formData.get('mobileNumber'),
        vehicleNumber: formData.get('vehicleNumber'),
        location: formData.get('location'),
        issues: formData.getAll('issues')
      };

      try {
        // Send request to backend
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const mechanics = await res.json();

        // Display matching mechanics
        if (mechanics.length === 0) {
          resultsDiv.innerHTML = `<p>No matching mechanics found in your area.</p>`;
        } else {
          resultsDiv.innerHTML = mechanics.map(m => `
            <div class="card">
              <h3>${m.shopName}</h3>
              <p><strong>Contact:</strong> ${m.contactName}</p>
              <p><strong>Phone:</strong> <a href="tel:${m.contactNumber}">${m.contactNumber}</a></p>
              <p><strong>Services:</strong> ${m.services.join(', ')}</p>
            </div>
          `).join('');
        }
      } catch (error) {
        console.error('Error fetching mechanics:', error);
        resultsDiv.innerHTML = `<p>Something went wrong. Please try again.</p>`;
      }
    });
  }
});
