const init = () => {
    let formContainer = document.getElementById("new-quote-form");
    formContainer.addEventListener("submit", (e) => {
      e.preventDefault();
      let newQuote = e.target.children[0].children[1].value;
      let newQuoteAuthor = e.target.children[1].children[1].value;
      fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          quote: newQuote,
          author: newQuoteAuthor,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => createQuote(data));
    });
  
    function createQuote(item) {
      let quotelist = document.getElementById("quote-list");
      let breakLine = document.createElement("br");
      let quote = document.createElement("li");
      quote.classList.add("quote-card");
      let paragraph = document.createElement("p");
      paragraph.classList.add("mb-0");
      paragraph.innerText = item.quote;
      let blockForQt = document.createElement("blockquote");
      blockForQt.classList.add("blockquote");
      quote.appendChild(blockForQt);
      let quoteAuthor = document.createElement("footer");
      quoteAuthor.classList.add("blockquote-footer");
      quoteAuthor.innerText = item.author;
  
      let likeCounter = item["likes"].length;
  
      let likeDiv = document.createElement("section");
      likeDiv.innerText = `${likeCounter} likes`;
      quote.appendChild(likeDiv);
  
      let btnLike = document.createElement("button");
      btnLike.classList.add("btn-success");
      btnLike.innerText = "Like";
      btnLike.addEventListener("click", (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/likes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            quoteId: parseInt(item.id),
          }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data);
          });
        fetch("http://localhost:3000/quotes?_embed=likes")
          .then((resp) => resp.json())
          .then((data) => {
            console.log(item.id);
            let likesResult = data.filter((obj) => {
              return obj.id === item.id;
            });
            likeDiv.innerText = `${likesResult[0].likes.length} likes`;
          });
      });
  
      let btnDelete = document.createElement("button");
      btnDelete.classList.add("btn-danger");
      btnDelete.innerText = "Delete";
      btnDelete.addEventListener("click", (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/quotes/${item.id}`, {
          method: "DELETE",
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data);
            quotelist.removeChild(quote);
          });
      });
  
      quotelist.appendChild(quote);
      blockForQt.appendChild(paragraph);
      blockForQt.appendChild(quoteAuthor);
      blockForQt.appendChild(breakLine);
      blockForQt.appendChild(btnLike);
      blockForQt.appendChild(btnDelete);
    }
    function fetchInfo() {
      fetch("http://localhost:3000/quotes?_embed=likes")
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          data.forEach((item) => {
            createQuote(item);
          });
        });
    }
    fetchInfo();
  };
  
  window.addEventListener("DOMContentLoaded", init);