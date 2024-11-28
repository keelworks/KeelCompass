const articles = [
    { id: 1, title: 'The Pomodoro Technique', content: 'A time management method...', type: 'study_tip' },
    { id: 2, title: 'Guide to Mind Mapping', content: 'Mind mapping is a technique to...', type: 'guide' },
    { id: 3, title: 'Effective Note Taking', content: 'Learn how to take notes more effectively...', type: 'article' },
];

document.addEventListener('DOMContentLoaded', () => {
    displayArticles(articles);
    loadBookmarks();
});

function displayArticles(articleList) {
    const articleListElement = document.getElementById('article-list');
    articleListElement.innerHTML = '';

    articleList.forEach(article => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <button onclick="bookmarkArticle(${article.id})">Bookmark</button>
        `;
        articleListElement.appendChild(listItem);
    });
}

function bookmarkArticle(articleId) {
    const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    const article = articles.find(a => a.id === articleId);
    
    if (article && !bookmarkedArticles.some(a => a.id === article.id)) {
        bookmarkedArticles.push(article);
        localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
        alert(`${article.title} has been bookmarked!`);
    } else {
        alert('This article is already bookmarked.');
    }
}

function loadBookmarks() {
    const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    if (bookmarkedArticles.length > 0) {
        const articleListElement = document.getElementById('article-list');
        articleListElement.innerHTML += `<h2>Bookmarked Articles</h2>`;
        
        bookmarkedArticles.forEach(article => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.content}</p>
            `;
            articleListElement.appendChild(listItem);
        });
    }
}

function searchArticles() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(query) || article.content.toLowerCase().includes(query)
    );
    displayArticles(filteredArticles);
}
