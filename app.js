// Membuat input ada autcomplete / suggestion
const containerInput = document.getElementById('wrapper-input');
const searchPokemonName = document.getElementById('search-pokemon');

function autocompleteSearchPokemonName(valueInput, pokemonNames) {
	removeLists();
	if (!valueInput) return false;

	const ul = document.createElement('ul');
	ul.setAttribute('id', 'autocomplete-list');
	ul.setAttribute('class', 'absolute left-0 right-0 rounded-md border border-gray-300 bg-white z-10 autocomplete-list');
	containerInput.append(ul);

	let list;
	for (index = 0; index < pokemonNames.length; index++) {
		if (pokemonNames[index].substr(0, valueInput.length).toUpperCase() == valueInput.toUpperCase()) {
			ul.classList.add('h-64', 'overflow-auto');

			list = document.createElement('li');
			list.setAttribute('class', 'hover:bg-gray-100 duration-150 ease-in-out px-2 py-3 capitalize border-b border-gray-300');
			list.innerHTML = `<strong>${pokemonNames[index].substr(0, valueInput.length)}`;
			list.innerHTML += pokemonNames[index].substr(valueInput.length);
			ul.append(list);
		}
	}

	// Klik salah satu daftar nama pokemon lalu masukkan kedalam nilai input
	const listsPokemonName = document.querySelectorAll('#autocomplete-list li');
	listsPokemonName.forEach((listPokemonName) => {
		listPokemonName.addEventListener('click', function (e) {
			searchPokemonName.value = e.target.textContent;
			printPokemon();
		});
	});
}

// Hapus semua daftar pokemon
function removeLists() {
	const wrapperAutocomplete = document.querySelectorAll('.autocomplete-list');
	if (wrapperAutocomplete.length > 0) {
		wrapperAutocomplete.forEach((autocomplete) => {
			autocomplete.remove();
		});
	}
}

// Mengambil semua nama pokemon dari API
function fetchingAllNamePokemon(url) {
	let pokemonName = [];

	fetch(url)
		.then((datas) => datas.json())
		.then((dataResult) => {
			const results = dataResult.results;
			for (const data of results) {
				pokemonName.push(data.name);
			}

			// Menjalankan autocomplete input ketika tombol keyboard diketikan
			searchPokemonName.addEventListener('input', function () {
				autocompleteSearchPokemonName(searchPokemonName.value, pokemonName);
			});
		});
}

fetchingAllNamePokemon('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1154');

// Bagian menampilkan Pokemon dari API PokeAPI
const containerPokemonCard = document.getElementById('content-pokedex');
function printPokemon() {
	containerPokemonCard.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" class="mx-auto animate-spin">
					<path fill="none" d="M0 0h24v24H0z" />
					<path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" fill="rgba(14,165,233,1)" />
				</svg>`;

	fetchingDataPokemon(`https://pokeapi.co/api/v2/pokemon/${searchPokemonName.value.toLowerCase()}`);
}

const formSearchPokemon = document.querySelector('form');
formSearchPokemon.addEventListener('submit', function (e) {
	e.preventDefault();
	printPokemon();
});

// Ambil data pokemon dari API PokeAPI lalu tampilkan card nya
function fetchingDataPokemon(url) {
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			containerPokemonCard.innerHTML = pokemonCard(data);
			setTimeout(() => {
				dataDetailPokemon(data);
				showPopupDetailPokemon();
			}, 0);
		})
		.catch(() => {
			containerPokemonCard.innerHTML = `<h2 class="text-center text-2xl sm:text-3xl font-bold text-gray-800">Nama Pokemon tidak ditemukan!</h2>`;
		});
}

// Template menampilkan pokemon hasil dari API
function pokemonCard(dataPokemon) {
	const pokemonName = dataPokemon.forms[0].name;
	const imageGifPokemon = dataPokemon.sprites.versions['generation-v']['black-white'].animated['front_default'];
	const imagePokemon = dataPokemon.sprites['front_default'];

	return `<figure class="mx-auto w-full transform cursor-pointer overflow-hidden rounded-md border border-gray-300 bg-gradient-to-t from-gray-100 to-gray-300 pb-3 text-center duration-300 ease-in-out hover:scale-105 sm:w-80" id="card-pokemon">
						<img src="${imageGifPokemon != null ? imageGifPokemon : imagePokemon}" alt="${pokemonName}" class="mx-auto h-40 w-40 pt-6" />
						<figcaption class="mt-4 text-3xl font-semibold capitalize italic text-gray-900 px-2">${pokemonName}</figcaption>
					</figure>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" class="mx-auto mt-4 mb-2" id="arrow-up">
						<path fill="none" d="M0 0h24v24H0z" />
						<path d="M13 12v8h-2v-8H4l8-8 8 8z" fill="rgba(75,85,99,1)" />
					</svg>
					<p class="text-center text-2xl font-bold text-gray-600">Klik untuk melihat lebih detail</p>
				`;
}

// Menghapus daftar list nama pokemon
window.addEventListener('click', function ({ target }) {
	removeLists();

	// Menampilkan semua moves ketika tombol show all di klik
	if (target.id === 'btn-show-all') {
		const parentBtnShowAll = target.parentElement;
		parentBtnShowAll.classList.add('hidden');

		const moves = parentBtnShowAll.parentElement;
		moves.classList.remove('h-32', 'overflow-hidden');
	}

	// Menghilangkan popup detail pokemon
	if (target.id == 'close-pokemon-detail') {
		removePopupDetailPokemon();
	}
});

// Warna beberapa tipe pada pokemon
const colors = {
	bug: '#1A4C24',
	dark: '#040706',
	dragon: '#428B93',
	electric: '#E1E32A',
	fairy: '#971944',
	fighting: '#9A3F25',
	fire: '#A72122',
	flying: '#49677D',
	ghost: '#313367',
	grass: '#157A3B',
	ground: '#A8702B',
	ice: '#86D1F3',
	normal: '#75515D',
	poison: '#5E2D88',
	psychic: '#A42A6C',
	rock: '#44170B',
	steel: '#60746D',
	water: '#1453E0',
};

// Menampilkan popup detail pokemon
const detailPokemon = document.getElementById('detail-pokemon');
function showPopupDetailPokemon() {
	const containerDetailPokemon = detailPokemon.querySelector('#container-pokemon-detail');

	const cardPokemon = document.getElementById('card-pokemon');
	cardPokemon.addEventListener('click', function () {
		detailPokemon.classList.remove('scale-0');
		containerDetailPokemon.classList.replace('h-0', 'h-full');

		document.body.classList.add('overflow-hidden');
	});
}

// Template html data detail pokemon
function dataDetailPokemon(dataPokemon) {
	const pokemonName = dataPokemon.forms[0].name;
	const imageGifPokemon = dataPokemon.sprites.versions['generation-v']['black-white'].animated['front_default'];
	const imagePokemon = dataPokemon.sprites['front_default'];
	const types = dataPokemon.types;
	const pokemonBgColor = colors[types[0].type.name];
	const moves = dataPokemon.moves;
	const stats = dataPokemon.stats;

	detailPokemon.innerHTML = `
				<img src="src/close.svg" alt="close" class="absolute right-7 top-24 h-7 w-7 cursor-pointer z-10 self-start rounded bg-gray-700 sm:static sm:h-10 sm:w-10 sm:rounded-none sm:bg-transparent" id="close-pokemon-detail" />

				<div class="h-0 w-full overflow-auto rounded-tl-3xl bg-white pb-10 duration-500 sm:w-[600px] sm:h-[538px] sm:rounded-xl" id="container-pokemon-detail">
					<figure class="w-full rounded-tl-3xl pb-3 text-center sm:rounded-tl-xl" style="background: linear-gradient(to top, rgb(243, 244, 246), ${pokemonBgColor})">
						<img src="${imageGifPokemon != null ? imageGifPokemon : imagePokemon}" alt="${pokemonName}" class="mx-auto h-44 pt-6" />
						<figcaption class="mt-4 px-2 text-3xl font-semibold capitalize italic text-gray-900">${pokemonName}</figcaption>
					</figure>

					<div class="px-2 sm:px-8">
						<div class="mt-5 text-center">
							<h2 class="text-xl font-semibold text-gray-800">Type</h2>
							<div class="mt-3 flex flex-wrap items-center justify-center gap-2 font-semibold">${typesPokemon(types)}</div>
						</div>

						<div class="mt-5 text-center">
							<h2 class="text-xl font-semibold text-gray-800">Moves</h2>
							<div class="relative mt-3 flex h-32 flex-wrap items-center justify-center gap-2 overflow-hidden font-semibold">
								${movesPokemon(moves, pokemonBgColor)}

								<div class="absolute bottom-0 left-0 right-0 flex h-40 items-end justify-center bg-gradient-to-b from-transparent to-white">
									<button class="rounded border-2 border-blue-600 bg-white px-3 py-2 text-sm text-blue-600 duration-150 hover:bg-blue-600 hover:text-white" id="btn-show-all">Show All</button>
								</div>
							</div>
						</div>

						<div class="relative mt-5 text-center">
							<h2 class="text-xl font-semibold text-gray-800">Stats</h2>
							<div class="mt-3 max-w-sm space-y-3 font-semibold">
								${statsPokemon(stats, pokemonBgColor)}
							</div>
						</div>
					</div>
				</div>`;
}

// Fungsi looping types pokemon
function typesPokemon(types) {
	return types
		.map((typePokemon) => {
			return `<label class="rounded-full px-3 py-1 text-white capitalize" style="background: ${colors[typePokemon.type.name]}">${typePokemon.type.name}</label>`;
		})
		.join('');
}

// Fungsi looping moves
function movesPokemon(moves, pokemonBgColor) {
	return moves
		.map((movePokemon) => {
			return `<label class="rounded-full px-2 py-1 text-sm text-white" style="background: ${pokemonBgColor}">${movePokemon.move.name}</label>`;
		})
		.join('');
}

// Fungsi Looping stats
function statsPokemon(stats, pokemonBgColor) {
	return stats
		.map((statPokemon) => {
			return `<div class="flex items-center justify-center gap-x-2">
							<label class="w-1/2 justify-self-end text-right text-gray-900">${statPokemon.stat.name}</label>
							<div class="h-5 w-1/2 rounded-lg border-2 border-white bg-gray-300">
								<div class="flex h-full items-center rounded-lg px-3 text-sm text-white" style="background: ${pokemonBgColor}; width: ${statPokemon.base_stat > 100 ? '100' : statPokemon.base_stat}%;">${statPokemon.base_stat}
								</div>
							</div>
						</div>`;
		})
		.join('');
}

// Fungsi menghilangkan popup detail pokemon
function removePopupDetailPokemon() {
	detailPokemon.classList.add('scale-0');

	const containerDetailPokemon = document.getElementById('container-pokemon-detail');
	containerDetailPokemon.classList.replace('h-full', 'h-0');
	containerDetailPokemon.scrollTo(0, 0);

	const btnShowAll = document.querySelector('#btn-show-all');
	btnShowAll.parentElement.classList.remove('hidden');
	btnShowAll.parentElement.parentElement.classList.add('h-32', 'overflow-hidden');

	document.body.classList.remove('overflow-hidden');
}

// Menghilangkan popup detail pokemon ketika tombol Esc ditekan
window.addEventListener('keydown', function ({ key }) {
	if (key === 'Escape') {
		removePopupDetailPokemon();
	}
});
