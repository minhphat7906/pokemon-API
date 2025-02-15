const container = document.querySelector(".pokemon-container");
const searchInput = document.querySelector("#searchPokemon");
let fullPokemon = [];
let visiblePokemonCount = 24;
const loadMoreButton = document.querySelector(".load-more-button");

async function loadPokemon() {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1034`);
    const data = await res.json();
    const dataPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const detail = await fetch(pokemon.url);
        return await detail.json();
      })
    );
    fullPokemon = dataPokemon;
    displayPokemon(fullPokemon.slice(0, visiblePokemonCount)); 
  } catch (error) {
    console.error("error", error);
    container.innerHTML = "Try again";
  }
}
async function displayPokemon(pokemonData) {
  const HTML = pokemonData
  .map((response) => {
    const types = response.types.map((typeInfo) => typeInfo.type.name);
    const img_herf = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${response.id}.png`;
    return `<div class="pokemon-list">
            <div class="id">#${response.id}</div>
            <img src="${img_herf}" alt="${response.name}"/>
            <div class="pokemon-info">
              <div id="pokemonName" class="title">${response.name}</div>
              <div class="types">${types
                .map(
                  (type) =>
                    `<span class="type ${type.toLowerCase()}">${type}</span>`
                )
                .join("")}
              </div>
            </div>
          </div>`;
  })
  .join("");
  container.innerHTML = HTML;
}
function showLoading() {
  container.innerHTML = "Loading...";
}
function loadMorePokemon() {
  visiblePokemonCount += 24;
  const nextPokemon = fullPokemon.slice(0, visiblePokemonCount);
  displayPokemon(nextPokemon);
}
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  if (searchTerm === "") {
    displayPokemon(fullPokemon.slice(0, visiblePokemonCount)); 
  } else {
    const filter = fullPokemon.filter((pokemon) =>
      pokemon.name.includes(searchTerm)
    );
    if (filter.length === 0) {
        container.innerHTML = `No pokemon matched with "${searchTerm}"`; 
      } else {
        displayPokemon(filter);
      }
  }
});
if (loadMoreButton) {
  loadMoreButton.addEventListener("click", loadMorePokemon);
}
loadPokemon();
