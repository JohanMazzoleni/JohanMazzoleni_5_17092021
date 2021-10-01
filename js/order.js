window.addEventListener("DOMContentLoaded", async () => {
    const id = new URL(location.href).searchParams.get("id");
    document.getElementById("order-id").innerText = id;

    localStorage.removeItem("basket");
});