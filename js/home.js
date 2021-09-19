const end_point = "http://localhost:3000/";

var formatter = new Intl.NumberFormat('fr-Fr', {
	style: 'currency',
	currency: 'EUR',
	minimumFractionDigits: 2
})


/**
 * Récupère les informations de l'api cameras
 * @return { Promise }
*/

function GetProduct() {
	return new Promise(async function (resolve, reject) {
		fetch(end_point + "api/cameras").then(async function (data) {
			resolve(await data.json());
		})
			.catch(function (err) {
				reject(err);
			})
	});
}


/**
 * Génére la structure html avec les données de l'api.
 * @param  { Object } data
*/

function Generate_Card(data) {
	return `
	<div class="col">
		<div class="card shadow-sm">
			<img src="${data.imageUrl}" alt="${data.name}" title="${data.name}">

			<div class="card-body">
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


window.onload = async function () {
	try {
		const product = await GetProduct();

		console.log(product);

		const list = document.getElementById("products");
		for (let index = 0; index < product.length; index++) {
			list.innerHTML += Generate_Card(product[index]);
		}
	}
	catch (err) {
		console.log('err', err);
	}
};