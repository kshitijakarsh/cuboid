// script.js

document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('bookSearch').value.trim();
    if (query) {
        document.getElementById('resultsContainer').style.display = 'block'; // Show results container
        fetchBookDetails(query);
    } else {
        document.getElementById('resultsContainer').style.display = 'none'; // Hide results container if query is empty
    }
});

function fetchBookDetails(query) {
    const apiKey = 'AIzaSyAPCaU12KQSI9FU-0fq8YIU63KP54jexxo'; // Replace with your API key
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const book = data.items[0].volumeInfo;
                const title = book.title;
                const author = book.authors ? book.authors.join(', ') : 'Unknown author';
                const previewLink = book.infoLink;
                const buyLink = book.saleInfo && book.saleInfo.buyLink ? book.saleInfo.buyLink : '#';
                const coverImage = book.imageLinks ? book.imageLinks.thumbnail : '';

                document.getElementById('bookTitle').innerText = title;
                document.getElementById('bookCover').querySelector('img').src = coverImage;
                document.getElementById('bookDescription').innerText = book.description || 'No description available.';
                document.getElementById('shopButton').href = buyLink;

                fetchAuthorWorks(author);
            } else {
                // Handle no results found
                console.error('No book found');
                document.getElementById('resultsContainer').style.display = 'none'; // Hide results if no book is found
            }
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
            document.getElementById('resultsContainer').style.display = 'none'; // Hide results on error
        });
}

function fetchAuthorWorks(author) {
    if (!author) return;

    const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(author)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const works = data.items.map(item => {
                    const coverImage = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'default-cover.jpg'; // Fallback to default image if no cover
                    return `<div class="book-cover"><img src="${coverImage}" alt="${item.volumeInfo.title}" title="${item.volumeInfo.title}"></div>`;
                }).join('');
                document.getElementById('authorName').innerText = `Author: ${author}`;
                document.getElementById('authorWorks').innerHTML = works;
            } else {
                document.getElementById('authorWorks').innerHTML = 'No additional works found.';
            }
        })
        .catch(error => console.error('Error fetching author works:', error));
}

function fetchBookQuotes(title) {
    // Placeholder for quotes. Replace with a real quotes API or static list.
    const quotes = [
        "First quote from the book...",
        "Second quote from the book..."
    ];

    document.getElementById('quotesList').innerHTML = quotes.map(quote => `<li>${quote}</li>`).join('');
}
