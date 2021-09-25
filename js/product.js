const endpoint = "http://localhost:3000/";

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
 * Récupère les informations du produit
 * @return { Promise }
*/

function productDetail(id) {
	return new Promise(function (resolve, reject) {
		fetch(endpoint + "api/cameras/" + id).then(async function (data) {
			resolve(await data.json());
		})
			.catch(function (err) {
				reject(err);
			})
	});
};

/**
 * Génére la structure html avec les données de l'api.
 * @param  { Object } data
*/

function generateSelect(data) {
	var code = ``
	for (let index = 0; index < data.lenses.length; index++) {
		code = code + `<option value="${index}">${data.lenses[index]}</option>`
	}
	return code;
};

/**
 * Stocke le produit dans le navigateur du client.
 * @param  { Object } data
*/

function addToBasket(data) {
	var basket_storage = localStorage.getItem("basket");
	if (basket_storage) {
		var basket_data = JSON.parse(basket_storage);
		basket_data.push(data);
		localStorage.setItem("basket", JSON.stringify(basket_data));
	}
	else {
		localStorage.setItem("basket", JSON.stringify([data]));
	}
}

window.addEventListener("DOMContentLoaded", async () => {
	const id = new URL(location.href).searchParams.get("id");

	const name = document.getElementById("product-name");
	const image = document.getElementById("product-image");
	const description = document.getElementById("description");
	const price = document.getElementById("price");
	const lenses = document.getElementById("lenses");

	const product = await productDetail(id);

	name.innerText = product.name;
	image.setAttribute("src", product.imageUrl);
	description.innerText = product.description;
	price.innerText = formatter.format(product.price);
	lenses.innerHTML = generateSelect(product);

	document.getElementById("add-to-basket").addEventListener("click", function () {
		addToBasket({
			name: product.name,
			accesories: lenses.options[lenses.selectedIndex].text,
			_id: product._id,
			price: product.price,
		});

		location.href = "./panier.html";
	})

});