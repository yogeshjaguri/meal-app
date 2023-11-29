document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const mealList = document.getElementById("meals-div");
  const favoritesList = document.getElementById("my-favorite-meals");

  let favoriteArray = getFavoriteArray();

  // Add event listener to the h1 element
  const homeLink = document.getElementById("home-link");
  if (homeLink) {
    homeLink.addEventListener("click", function () {
      // Redirect to the homepage or perform any desired action
      displaySearchResults("");
    });
  } else {
    console.error("Element with id 'home-link' not found.");
  }

  async function moreDetails() {
    const id = this.id;
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();

    mealList.innerHTML = "";

    const meals = data.meals[0];

    // Add "Back" button outside the div
    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "Back";
    mealList.append(backButton);

    const div = document.createElement("div");
    div.classList.add("details-page");
    div.innerHTML = `
        <h3>${meals.strMeal}</h3>
        <img src="${meals.strMealThumb}" alt="">
        <p>${meals.strInstructions}</p>
        <h5>Cuisine Type: ${meals.strArea}</h5>
        <a href="${meals.strYoutube}"><button type="button" id='${meals.idMeal}'>Watch Video</button></a>`;

    mealList.append(div);

    // Add event listener for the back button
    backButton.addEventListener("click", function () {
      displaySearchResults(searchInput.value);
    });
  }

  function toggleFavorites(event) {
    event.preventDefault();
    const index = favoriteArray.indexOf(this.id);
    if (index === -1) {
      favoriteArray.push(this.id);
      this.classList.add("clicked");
    } else {
      favoriteArray.splice(index, 1);
      this.classList.remove("clicked");
    }

    updateLocalStorage();
  }

  async function createMeals(query) {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();

      mealList.innerHTML = "";
      if (data.meals) {
        for (const meals of data.meals) {
          const div = document.createElement("div");
          div.classList.add("images");
          div.innerHTML = `
                    <img src="${meals.strMealThumb}" alt="">
                    <h4>${meals.strMeal}</h4>
                    <div class='button-inside'>
                    <button type="button" class='more-details' id='${
                      meals.idMeal
                    }'>View Details</button>
                    ${
                      favoriteArray.includes(meals.idMeal)
                        ? `<a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`
                        : `<a href="" class='favourite' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a> 
                        </div>`
                    }`;

          mealList.append(div);
        }

        addEventListeners();
      } else {
        mealList.innerHTML = "No results found.";
      }
    } catch (error) {
      console.log(error);
    }
  }

  function addEventListeners() {
    const favoriteButton = document.querySelectorAll("a");
    for (const button of favoriteButton) {
      button.addEventListener("click", toggleFavorites);
    }

    const moreDetailsbutton = document.querySelectorAll(".more-details");
    for (const button of moreDetailsbutton) {
      button.addEventListener("click", moreDetails);
    }
  }

  // Call the searchMeals function initially with an empty query to display all meals
  displaySearchResults("");

  function displaySearchResults(query) {
    createMeals(query);
  }

  async function displayFavoriteMeals() {
    mealList.innerHTML = "";

    for (const meal of favoriteArray) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`
      );
      const data = await response.json();

      const meals = data.meals[0];

      const div = document.createElement("div");
      div.classList.add("images");
      div.innerHTML = `
              <img src="${meals.strMealThumb}" alt="">
              <h4>${meals.strMeal}</h4>
              <div class="button-inside" >
              <button type="button" class='border-circle more-details' id='${meals.idMeal}'>View Details</button>
              <a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>
              </div>`;

      mealList.append(div);

      addEventListeners();
    }
  }

  // Updated event listener for my-favorite-meals button
  favoritesList.addEventListener("click", function () {
    if (favoritesList.textContent === "Favorite Meals") {
      displayFavoriteMeals();
      favoritesList.textContent = "All Meals";
    } else {
      displaySearchResults("");
      favoritesList.textContent = "Favorite Meals";
    }
  });

  // Event listeners
  searchInput.addEventListener("input", function () {
    displaySearchResults(this.value);
  });

  function getFavoriteArray() {
    return localStorage.getItem("favoriteArray")
      ? JSON.parse(localStorage.getItem("favoriteArray"))
      : [];
  }

  function updateLocalStorage() {
    localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
  }
});
