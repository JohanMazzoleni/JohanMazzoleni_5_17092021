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
 * Récupère le panier
 * @return { Object }
*/

function retrieveBasket() {
    const basket_storage = localStorage.getItem("basket");
    if (basket_storage) {
        return JSON.parse(basket_storage);
    }
    
    return [];
}

/**
 * Calcul le total du panier
 * @return { Integer }
*/

function getTotalPrice(data) {
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

function generateBasket(data) {
    var code = ``
    for (let index = 0; index < data.length; index++) {
        code =+ `
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



window.addEventListener("DOMContentLoaded", async () => {
    const basket = retrieveBasket();
    const basket_el = document.getElementById("basket");
    const total_price_el = document.getElementById("total_price");
    const total_product_el = document.getElementById("total-product");
    const form = document.getElementById("final-form");

    if (basket.length == 0)
    {
        alert("Vous n'avez aucun produit dans votre panier.");
        location.href = "./";
    }

    total_product_el.innerText = basket.length;
    total_price_el.innerText = formatter.format(getTotalPrice(basket));
    basket_el.innerHTML = generateBasket(basket) + basket_el.innerHTML;

    form.onsubmit = function (e) {
        e.preventDefault();

        var productList = [];
        for (let index = 0; index < basket.length; index++) {
            productList.push(basket[index]._id);
        }

        fetch("http://localhost:3000/api/cameras/order", {
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
                products: productList,
            })
        }).then(async function(data)
        {
            var json = await data.json();
            location.href = "./order.html?id=" + encodeURIComponent(json.orderId);
        })
    }
});