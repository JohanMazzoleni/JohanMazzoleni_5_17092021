window.onload = function()
{
    const id = new URL(location.href).searchParams.get("id");
    document.getElementById("order-id").innerText = id;
};