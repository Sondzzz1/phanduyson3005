document.addEventListener("DOMContentLoaded", function () {
    const data = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    const orderBody = document.getElementById("orderSummary");
    const totalEl = document.getElementById("grandTotal");

    let total = 0;

    const totalRow = orderBody.querySelector(".total");

    data.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${item.image}" style="width:50px;height:50px;border-radius:6px;vertical-align:middle;margin-right:10px;">
                ${item.name} x${item.quantity}
            </td>
            <td>${itemTotal.toLocaleString()}đ</td>
        `;

        if (totalRow && totalRow.parentNode === orderBody) {
            orderBody.insertBefore(row, totalRow);
        } else {
            orderBody.appendChild(row);
        }
    });

    totalEl.textContent = total.toLocaleString() + "đ";
});
