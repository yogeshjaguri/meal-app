document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const mealList = document.getElementById("meals-div");
  const favoritesList = document.getElementById("my-favorite-meals"); // Corrected id from my-favourite-meals to my-favorite-meals

  let favoriteArray = [];
  let URL;

  if (!localStorage.getItem("favoriteArray")) {
    localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
  } else {
    favoriteArray = JSON.parse(localStorage.getItem("favoriteArray"));
  }

  async function moreDetails() {
    let id = this.id;
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();

    mealList.innerHTML = "";

    let meals = data.meals[0];

    const div = document.createElement("div");
    div.classList.add("details-page");
    div.innerHTML = `
        <h3>${meals.strMeal}</h3>
        <img src="${meals.strMealThumb}" alt="">
        <p>${meals.strInstructions}</p>
        <h5>Cuisine Type: ${meals.strArea}</h5>
        <a href="${meals.strYoutube}"><button type="button"  id='${meals.idMeal}'>Watch Video</button></a>`;

    mealList.append(div);

    // Add event listener for the back button
    const backButton = div.querySelector(".back-button");
    backButton.addEventListener("click", function () {
      displaySearchResults(searchInput.value);
    });
  }

  function toggleFavorites(event) {
    event.preventDefault();
    let index = favoriteArray.indexOf(this.id);
    if (index == -1) {
      favoriteArray.push(this.id);
      this.classList.add("clicked");
    } else {
      favoriteArray.splice(index, 1);
      this.classList.remove("clicked");
    }

    localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
  }

  async function createMeals(query) {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();

      mealList.innerHTML = "";
      if (data.meals) {
        for (let meals of data.meals) {
          const div = document.createElement("div");
          div.classList.add("images");
          div.innerHTML = `
                    <img src="${meals.strMealThumb}" alt="">
                    <h4>${meals.strMeal}</h4>
                    <button type="button" class='more-details' id='${
                      meals.idMeal
                    }'>view Details</button>
                    ${
                      favoriteArray.includes(meals.idMeal)
                        ? `<a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`
                        : `<a href="" class='favourite' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`
                    }`;

          mealList.append(div);
        }

        var favoriteButton = document.querySelectorAll("a");
        for (let button of favoriteButton) {
          button.addEventListener("click", toggleFavorites);
        }

        var moreDetailsbutton = document.querySelectorAll(".more-details");
        for (let button of moreDetailsbutton) {
          button.addEventListener("click", moreDetails);
        }
      } else {
        mealList.innerHTML = "No results found.";
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Call the searchMeals function initially with an empty query to display all meals
  displaySearchResults(""); // Corrected event listener for displaySearchResults
  function displaySearchResults() {
    let query = searchInput.value;
    createMeals(query);
  }

  async function displayFavoriteMeals() {
    mealList.innerHTML = "";

    for (let meal of favoriteArray) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`
      );
      const data = await response.json();

      let meals = data.meals[0];

      const div = document.createElement("div");
      div.classList.add("images");
      div.innerHTML = `
              <img src="${meals.strMealThumb}" alt="">
              <h4>${meals.strMeal}</h4>
              <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
              <a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`;

      mealList.append(div);

      var favoriteButton = document.querySelectorAll("a");
      for (let button of favoriteButton) {
        button.addEventListener("click", toggleFavorites);
      }

      var moreDetailsbutton = document.querySelectorAll(".more-details");
      for (let button of moreDetailsbutton) {
        button.addEventListener("click", moreDetails);
      }
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
  searchInput.addEventListener("input", displaySearchResults);
  favoritesList.addEventListener("click", displayFavoriteMeals);
});
