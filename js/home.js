/**
 * Permet de transformer les Integers en format de prix français.
 * @return { String }
*/

var formatter = new Intl.NumberFormat('fr-Fr', {
	style: 'currency',
	currency: 'EUR',
	minimumFractionDigits: 2
})

/**
 * Récupère les informations de l'api cameras
 * @return { Promise }
*/

async function getProducts() {
	let products = [];
	try {
		const response = await fetch("http://localhost:3000/api/cameras");
		if (response.ok) {
			products = await response.json();
		}
	} catch (error) {
		console.error(error);
	}
	return products;
}


/**
 * Génére la structure html avec les données de l'api.
 * @param  { Object } data
 * @returns { String }
*/

function generateCard(data) {
	return `
	<div class="col">
		<div class="card shadow-sm">
			<img src="${data.imageUrl}" alt="${data.name}" title="${data.name}">

			<div class="card-body">
				<h2 class="card-text">${data.name}</h2>
				<p class="card-text">${data.description}</p>
				<div class="d-flex justify-content-between align-items-center">
					<small class="text-muted">${formatter.format(data.price)}</small>
					<div class="btn-group">
						<a href="./product.html?id=${data._id}"><button type="button" class="btn btn-sm btn-outline-secondary">Acheter</button></a>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
};


window.addEventListener("DOMContentLoaded", async () => {
	try {
		const products = await getProducts();
		const list = document.getElementById("products");

		for (let index = 0; index < products.length; index++) {
			list.innerHTML += generateCard(products[index]);
		}
	}
	catch (err) {
		console.log('err', err);
	}
});