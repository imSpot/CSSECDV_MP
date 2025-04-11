document.getElementById('add-movie-btn').addEventListener('click', () => {
    document.getElementById('movie-form-container').style.display = 'block';
  });
  
  document.getElementById('add-movie-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const movieData = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch('/add-movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
      });
  
      const result = await response.json();
      if (result.success) {
        alert('Movie added successfully!');
        e.target.reset();
      } else {
        alert('Failed to add movie.');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  });