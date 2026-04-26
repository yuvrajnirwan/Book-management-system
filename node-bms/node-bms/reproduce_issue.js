import fetch from 'node-fetch';

async function testPost() {
    const book = {
        bookName: "Test Book",
        author: "Test Author",
        isbn: "1234567890",
        publishDate: "2023-01-01",
        age: 3,
        bookType: "Printed Book",
        pageNo: 100,
        genre: "fiction",
        price: 500,
        discount: 5
    };

    try {
        const response = await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testPost();
