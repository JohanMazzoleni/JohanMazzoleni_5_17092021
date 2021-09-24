const end_point = "http://localhost:3000/";

var formatter = new Intl.NumberFormat('fr-Fr', {
	style: 'currency',
	currency: 'EUR',
	minimumFractionDigits: 2
})

/**
 * Récupère les informations du produit
 * @return { Promise }
*/

function ProductDetails(id) {
	return new Promise(function (resolve, reject) {
		fetch(end_point + "api/cameras/" + id).then(async function (data) {
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

function GenerateSelect(data) {
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

function AddToBasket(data) {
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

window.onload = async function () {
	const product_name = document.getElementById("product-name");
	const product_image = document.getElementById("product-image");
	const description = document.getElementById("description");
	const price = document.getElementById("price");
	const lenses = document.getElementById("lenses");

	const id = new URL(location.href).searchParams.get("id");

	const product_details = await ProductDetails(id);

	product_name.innerText = product_details.name;
	product_image.setAttribute("src", product_details.imageUrl);
	description.innerText = product_details.description;
	price.innerText = formatter.format(product_details.price);
	lenses.innerHTML = GenerateSelect(product_details);

	document.getElementById("add-to-basket").onclick = function () {
		AddToBasket({
			name: product_details.name,
			description: product_details.description,
			price: product_details.price,
			image: product_details.imageUrl,
			accesories: lenses.options[lenses.selectedIndex].text,
		});

		location.href = "./panier.html";
	}
};

