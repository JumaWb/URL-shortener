let savedLinks = [];

async function shortenUrl() {
  const longUrl = document.getElementById('longUrl').value;
  const resultBox = document.getElementById('result');
  const shortLink = document.getElementById('shortLink');

  if (!longUrl.trim()) {
    shortLink.innerText = "Please enter a valid URL.";
    resultBox.classList.remove('d-none');
    resultBox.classList.add('bg-warning');
    return;
  }

  try {
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer cb18f5ba20e1657695d9cfa493049cf2f654aebe', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ long_url: longUrl })
    });

    const data = await response.json();

    if (response.ok) {
      shortLink.innerText = data.link;
      resultBox.classList.remove('d-none', 'bg-warning');
      savedLinks.push(`${longUrl} -> ${data.link}`);
    } else {
      shortLink.innerText = data.description || 'Failed to shorten URL.';
      resultBox.classList.remove('d-none');
    }
  } catch (error) {
    shortLink.innerText = "Error occurred. Please try again.";
    resultBox.classList.remove('d-none');
  }
}

function copyToClipboard() {
  const text = document.getElementById('shortLink').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Shortened URL copied to clipboard!");
  });
}

function downloadShortenedUrls() {
  const blob = new Blob([savedLinks.join('\n')], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'shortened_urls.txt';
  link.click();
}
