 let userinput = document.getElementById("userinput");
    let searchBtn = document.getElementById("searchBtn");
    let clearBtn = document.getElementById("clearBtn");
    let historyDiv = document.getElementById("history");
    var modal = document.getElementById("myModal");
    var modalcontent = document.getElementById("modal-content");
    var span = document.querySelectorAll(".close")[0];
    let message = document.getElementById("message");
    let mywishlist = document.getElementById("wishlistcontainer");
    let wishBtn = document.getElementById("wishBtn");
    let errormessage = document.getElementById("errormessage");
   const modeBtn = document.getElementById("lightmode");


      if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        modeBtn.textContent = "🌙"; 
      } else {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        modeBtn.textContent = "☀️"; 
      }

      modeBtn.addEventListener("click", () => {
        if (document.body.classList.contains("dark")) {
          document.body.classList.remove("dark");
          document.body.classList.add("light");
          localStorage.setItem("theme", "light");
          modeBtn.textContent = "🌙";
        } else {
          document.body.classList.remove("light");
          document.body.classList.add("dark");
          localStorage.setItem("theme", "dark");
          modeBtn.textContent = "☀️";
        }
      });






   let storedUser = JSON.parse(localStorage.getItem("info")) || [];
    if (storedUser.length > 0) {
      let lastMovie = storedUser[storedUser.length - 1];
      document.getElementById("poster").src = lastMovie.poster;
      document.getElementById("title").innerText = `title : ${lastMovie.title}`;
      document.getElementById("year").innerText = `year : ${lastMovie.year}`;
      document.getElementById("Writer").innerText = `writer : ${lastMovie.writer}`;
      document.getElementById("plot").innerText = `plot : ${lastMovie.plot}`;
      document.getElementById("language").innerText = `Language : ${lastMovie.language}`;
    }

    searchBtn.addEventListener("click" , async function(){
      let value = userinput.value.toLowerCase();
        

      try{
        let response = await fetch(`https://www.omdbapi.com/?apikey=a7816761&t=${value}`);
        let data = await response.json();
        const moviedata = {
        poster : data.Poster,
         title : data.Title,
         year : data.Year,
         writer : data.Writer,
         plot : data.Plot,
         language : data.Language
        }
        
        if(data.Response === "True"){
          message.classList.add("hidden");

         message.innerText = "";
          
           let storedUser = JSON.parse(localStorage.getItem("info")) || [];
        if (!Array.isArray(storedUser)) storedUser = []; // safety check
        storedUser.push(moviedata);
        localStorage.setItem("info", JSON.stringify(storedUser));
        }
        else{
          
          message.innerText = "Movie not available!";
          message.classList.remove("hidden");
        }
        

      displayHistory();

      }
      catch(err){
         console.log("Error fetching movie:", err);
      }
      userinput.value = "";
   
    });

      function displayHistory() {
      let storedUser = JSON.parse(localStorage.getItem("info")) || [];
      if (!Array.isArray(storedUser)) storedUser = [];

      historyDiv.innerHTML = ""; 
    

      storedUser.forEach((item) => {
        let div = document.createElement("div");
        div.classList.add("details");
        let paragraph = document.createElement("p");
        let img = document.createElement("img");
        let icon = document.createElement("button");
        icon.innerText = "Add Wishlist"
        icon.className = "add-wishlist-btn";
        img.src = item.poster;
        img.width = 250;
        img.height = 300;
        paragraph.textContent = item.title;
       
        div.appendChild(img);
        div.appendChild(paragraph);
        div.appendChild(icon);
        historyDiv.appendChild(div);

        icon.addEventListener("click" , function(event){
           event.stopPropagation();
         let wl = JSON.parse(localStorage.getItem("wishlist")) || [];

          let exists = wl.some(m => m.title === item.title);

          if(!exists){
            wl.push(item);
            icon.innerText = 'Added';
            icon.style.backgroundColor = "#ffd24d";
            icon.style.color = "black";
          } else {
            wl = wl.filter(m => m.title !== item.title);
            icon.innerText = 'Add Wishlist';
            icon.style.backgroundColor = "";
            icon.style.color = "";
          }

          localStorage.setItem("wishlist", JSON.stringify(wl)); 


          displayWishlist();

        });

       
 window.onclick = function (ev) { if (ev.target === modal) modal.style.display = 'none'; };

        div.addEventListener("click" , function(){
           modal.style.display = "block";
           document.getElementById("poster").src = item.poster;
          document.getElementById("title").innerText = `TITLE : ${item.title}`;
          document.getElementById("year").innerText = `YEAR : ${item.year}`;
          document.getElementById("Writer").innerText = `WRITER : ${item.writer}`;
          document.getElementById("plot").innerText = `PLOT : ${item.plot}`;
          document.getElementById("language").innerText = `LANGUAGE : ${item.language}`;
          
        })
       
      });
    }

    span.onclick = function() {
  modal.style.display = "none";
}

 let wishlistItems = document.getElementById("wishlistItems");

   function displayWishlist() {
      const wl = JSON.parse(localStorage.getItem('wishlist')) || [];
      wishlistItems.innerHTML = '';

      if (!Array.isArray(wl) || wl.length === 0) {
        errormessage.classList.remove('hidden');
      } else {
        errormessage.classList.add('hidden');
        wl.forEach(item => {
          const row = document.createElement('div');
          row.className = 'wishdetail';

          const img = document.createElement('img');
          img.src = item.poster || '';
          img.alt = item.title || '';

          const p = document.createElement('p');
          p.textContent = item.title || '';

          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-wish';
          removeBtn.type = 'button';
          removeBtn.innerText = 'Remove';
          removeBtn.addEventListener('click', function () {
            let current = JSON.parse(localStorage.getItem('wishlist')) || [];
            current = current.filter(m => m.title !== item.title);
            localStorage.setItem('wishlist', JSON.stringify(current));
            displayWishlist();
            displayHistory();
          });

          row.appendChild(img);
          row.appendChild(p);
          row.appendChild(removeBtn);
          wishlistItems.appendChild(row);
        });
      }
    }

        wishBtn.addEventListener("click" , function(){
          mywishlist.classList.remove("hidden");
           mywishlist.classList.toggle("active");

          displayWishlist();
        })

    clearBtn.addEventListener("click" , function(){
      localStorage.removeItem("info");
      historyDiv.innerHTML = "";
      alert("History cleared!");
    })

   window.onload = () => {
  displayHistory();
  displayWishlist();
};


 