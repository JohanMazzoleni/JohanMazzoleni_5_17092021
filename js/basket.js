const end_point = "http://localhost:3000/";

var formatter = new Intl.NumberFormat('fr-Fr', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
})

/**
 * Récupère le panier
 * @return { Object }
*/

function RetrieveBasket() {
    var basket_storage = localStorage.getItem("basket");
    if (basket_storage) {
        return JSON.parse(basket_storage);
    }
    else {
        return [];
    }
}

/**
 * Calcul le total du panier
 * @return { Integer }
*/

function GetTotalPrice(data) {
    var total = 0;
    for (let index = 0; index < data.length; index++) {
        total += data[index].price;
    }
    return total;
}

/**
 * Génére la structure html avec les données de l'api.
 * @param  { Object } data
*/

function GenerateBasket(data) {
    var code = ``
    for (let index = 0; index < data.length; index++) {
        code = code + `
        <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
                <h6 class="my-0">${data[index].name}</h6>
                <small class="text-muted">${data[index].accesories}</small>
            </div>
            <span class="text-muted">${formatter.format(data[index].price)}</span>
        </li>
        `
    }
    return code;
};



window.onload = function () {
    const basket = RetrieveBasket();
    const basket_el = document.getElementById("basket");
    const total_price_el = document.getElementById("total_price");
    const total_product_el = document.getElementById("total-product")
    const form = document.getElementById("final-form");

    if (basket.length == 0)
    {
        alert("Vous n'avez aucun produit dans votre panier.");
        location.href = "./";
    }

    total_product_el.innerText = basket.length;
    total_price_el.innerText = formatter.format(GetTotalPrice(basket));
    basket_el.innerHTML = GenerateBasket(basket) + basket_el.innerHTML;

    form.onsubmit = function (e) {
        e.preventDefault();

        console.log(e);

        var product_list = [];
        for (let index = 0; index < basket.length; index++) {
            product_list.push(basket[index]._id);
        }

        fetch(end_point + "api/cameras/order", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact: {
                    firstName: document.getElementById("firstName").value,
                    lastName: document.getElementById("lastName").value,
                    address: document.getElementById("address").value,
                    city: document.getElementById("city").value,
                    email: document.getElementById("email").value,
                },
                products: product_list,
            })
        }).then(async function(data)
        {
            var json = await data.json();
            location.href = "./order.html?id=" + encodeURIComponent(json.orderId);
        })
    }
};