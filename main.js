let allPizzas = [];
let filteredPizzas = [];
let bucket = [];
let totalPrice = 0;
function updateLocalStorage() {
    localStorage.pizzaKMA = JSON.stringify(bucket);

    //console.log(items);
}
function fetchFromLocalStorage() {
    if (localStorage.getItem("pizzaKMA") != null) {
        bucket = JSON.parse(localStorage.getItem("pizzaKMA"));
        //console.log("Parsed from localStorage", items);
    }
}
function clearStorage() {
    localStorage.removeItem("pizzaKMA");
    location.reload();
}


function renderHTML() {
    renderMain();
    renderAside();
}
function renderMain() {
    const itemsContainer = document.getElementById("pizzaSelection");
    itemsContainer.innerHTML = "";

    filteredPizzas.forEach((item) => {
        itemsContainer.append(renderPizzaFigure(item));
    });

}

function updateBucketTotalPriceAndAmount() {
    totalPrice = 0;
    bucket.forEach(pizza => {
        const { amount, size } = pizza;
        const summaryPrice = amount * size.price;
        totalPrice += summaryPrice;
    });
    document.getElementById("totalPrice").innerText = `${totalPrice} грн`
    document.getElementById("bucketSize").innerText = bucket.length;
}
function renderPizzaFigure(pizza) {
    const figure = document.createElement("figure");
    figure.classList.add("pizza");

    if (pizza.is_new) {
        const newRemark = document.createElement("span");
        newRemark.classList.add("new", "remark");
        newRemark.textContent = "Нова";
        figure.appendChild(newRemark);
    } else if (pizza.is_popular) {
        const newRemark = document.createElement("span");
        newRemark.classList.add("popular", "remark");
        newRemark.textContent = "Популярна";
        figure.appendChild(newRemark);
    }

    const img = document.createElement("img");
    img.src = pizza.icon;
    img.alt = pizza.title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");

    const div = document.createElement("div");

    const h2 = document.createElement("h2");
    h2.textContent = pizza.title;
    div.appendChild(h2);

    const p = document.createElement("p");
    p.classList.add("type");
    p.textContent = pizza.type;
    div.appendChild(p);

    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = generateDescription(pizza);
    div.appendChild(description);

    figcaption.appendChild(div);

    const sizeSelection = document.createElement("div");
    sizeSelection.classList.add("size-selection");
    if ("small_size" in pizza) {

        const smallPizza = document.createElement("section");
        smallPizza.classList.add("small-pizza");

        const diameter = document.createElement("span");
        diameter.classList.add("diameter");
        const diameterImg = document.createElement("img");
        diameterImg.src = "assets/images/size-icon.svg";
        diameterImg.alt = "Іконка діаметру";
        diameter.appendChild(diameterImg);
        const diameterValue = document.createElement("span");
        diameterValue.textContent = pizza.small_size.size;
        diameter.appendChild(diameterValue);
        smallPizza.appendChild(diameter);

        const weight = document.createElement("span");
        weight.classList.add("weight");
        const weightImg = document.createElement("img");
        weightImg.src = "assets/images/weight.svg";
        weightImg.alt = "Іконка ваги";
        weight.appendChild(weightImg);
        const weightValue = document.createElement("span");
        weightValue.textContent = pizza.small_size.weight;
        weight.appendChild(weightValue);
        smallPizza.appendChild(weight);

        const price = document.createElement("span");
        price.classList.add("price");
        const priceValue = document.createElement("p");
        priceValue.textContent = pizza.small_size.price;
        price.appendChild(priceValue);
        const currency = document.createElement("span");
        currency.textContent = "грн.";
        price.appendChild(currency);
        smallPizza.appendChild(price);

        const smallBuyButton = document.createElement("button");
        smallBuyButton.classList.add("orange-btn", "buy");
        smallBuyButton.textContent = "Купити";
        smallPizza.appendChild(smallBuyButton);

        sizeSelection.appendChild(smallPizza);

        smallBuyButton.addEventListener("click", () => {
            let bucketPizza = bucketPizzaObject(pizza, pizza.small_size);
            bucketPizza.size.name = "Мала";

            let i = indexOfPizza(bucketPizza);
            if (i == -1) {
                bucket.push(bucketPizza);
            } else {
                bucket[i].amount++;
            }

            updateLocalStorage();
            renderAside();
        });
    }

    if ("big_size" in pizza) {
        const bigPizza = document.createElement("section");
        bigPizza.classList.add("big-pizza");

        const bigDiameter = document.createElement("span");
        bigDiameter.classList.add("diameter");
        const bigDiameterImg = document.createElement("img");
        bigDiameterImg.src = "assets/images/size-icon.svg";
        bigDiameterImg.alt = "Іконка діаметру";
        bigDiameter.appendChild(bigDiameterImg);
        const bigDiameterValue = document.createElement("span");
        bigDiameterValue.textContent = pizza.big_size.size;
        bigDiameter.appendChild(bigDiameterValue);
        bigPizza.appendChild(bigDiameter);

        const bigWeight = document.createElement("span");
        bigWeight.classList.add("weight");
        const bigWeightImg = document.createElement("img");
        bigWeightImg.src = "assets/images/weight.svg";
        bigWeightImg.alt = "Іконка ваги";
        bigWeight.appendChild(bigWeightImg);
        const bigWeightValue = document.createElement("span");
        bigWeightValue.textContent = pizza.big_size.weight;
        bigWeight.appendChild(bigWeightValue);
        bigPizza.appendChild(bigWeight);

        const bigPrice = document.createElement("span");
        bigPrice.classList.add("price");
        const bigPriceValue = document.createElement("p");
        bigPriceValue.textContent = pizza.big_size.price;
        bigPrice.appendChild(bigPriceValue);
        const bigCurrency = document.createElement("span");
        bigCurrency.textContent = "грн.";
        bigPrice.appendChild(bigCurrency);
        bigPizza.appendChild(bigPrice);

        const bigBuyButton = document.createElement("button");
        bigBuyButton.classList.add("orange-btn", "buy");
        bigBuyButton.textContent = "Купити";
        bigPizza.appendChild(bigBuyButton);
        sizeSelection.appendChild(bigPizza);


        bigBuyButton.addEventListener("click", () => {
            let bucketPizza = bucketPizzaObject(pizza, pizza.big_size);
            bucketPizza.size.name = "Велика";
            let i = indexOfPizza(bucketPizza);
            if (i == -1) {
                bucket.push(bucketPizza);
            } else {
                bucket[i].amount++;
            }
            updateLocalStorage();
            renderAside();

        })
    }


    figcaption.appendChild(sizeSelection);
    figure.appendChild(figcaption);


    return figure;
}
function indexOfPizza(pizza) {
    let includes = -1;

    bucket.forEach((bucketPizza, i) => {
        if (bucketPizza.title == pizza.title && bucketPizza.size.name == pizza.size.name) {
            console.log("contains")
            includes = i;
        }
    });
    return includes;
}
function bucketPizzaObject(pizza, size) {
    return { "icon": pizza.icon, "title": pizza.title, "size": size, "amount": 1 };
}

function generateDescription(pizza) {
    let description = [];
    Object.values(pizza.content).forEach(arr => { arr.forEach(item => description.push(item)) });
    return description.join(', ');

}
function renderAside() {
    document.getElementById("clearBucket").addEventListener("click", clearBucket)
    const itemsContainer = document.getElementById("bucket");
    itemsContainer.innerHTML = "";

    bucket.forEach((item) => {
        let section = renderBucketItem(item);
        itemsContainer.append(section);
        scrollBucket(itemsContainer);
        
    });
    resizeBucketItemsBackground();
    updateBucketTotalPriceAndAmount();
}
function clearBucket(){
    bucket = [];
    updateLocalStorage();
    renderAside();
}
function scrollBucket(itemsContainer){
    itemsContainer.style.maxHeight = `calc(100vh - ${(document.querySelector("aside header").offsetHeight + document.querySelector("aside footer").offsetHeight)}px)`;
    itemsContainer.scrollTop = itemsContainer.scrollHeight;
}
function resizeBucketItemsBackground() {
    document.querySelectorAll('section.bucket-item').forEach(section => {
        section.style.backgroundSize = section.offsetHeight - 30 + "px";
        section.style.backgroundPositionX = section.offsetWidth - (section.offsetHeight - 30) / 2 + "px";
    })

}
function renderBucketItem(bucketPizza) {
    const section = document.createElement('section');
    section.classList.add('bucket-item');

    const h3 = document.createElement('h3');
    h3.innerHTML = `${bucketPizza.title} <span class="size">(${bucketPizza.size.name})</span>`;
    section.appendChild(h3);

    const sizeSection = document.createElement('section');
    sizeSection.classList.add('size-section');

    const diameter = document.createElement('span');
    diameter.classList.add('diameter');

    const diameterImg = document.createElement('img');
    diameterImg.src = 'assets/images/size-icon.svg';
    diameterImg.alt = 'Іконка діаметру';
    diameter.appendChild(diameterImg);

    diameter.innerHTML += bucketPizza.size.size;
    sizeSection.appendChild(diameter);

    const weight = document.createElement('span');
    weight.classList.add('weight');

    const weightImg = document.createElement('img');
    weightImg.src = 'assets/images/weight.svg';
    weightImg.alt = 'Іконка ваги';
    weight.appendChild(weightImg);

    weight.innerHTML += bucketPizza.size.weight;
    sizeSection.appendChild(weight);

    section.appendChild(sizeSection);

    const controlSection = document.createElement('section');
    controlSection.classList.add('control-section');

    const price = document.createElement('span');
    price.classList.add('price');
    price.textContent = `${bucketPizza.size.price}грн`;
    controlSection.appendChild(price);

    const amountDiv = document.createElement('div');

    const lessBtn = document.createElement('button');
    lessBtn.classList.add('less-btn');
    lessBtn.dataset.tooltip = 'Зменшити кількість';
    lessBtn.textContent = '–';
    amountDiv.appendChild(lessBtn);

    const amount = document.createElement('span');
    amount.classList.add('amount');
    amount.textContent = bucketPizza.amount;
    amountDiv.appendChild(amount);

    const moreBtn = document.createElement('button');
    moreBtn.classList.add('more-btn');
    moreBtn.dataset.tooltip = 'Збільшити кількість';
    moreBtn.textContent = '+';
    amountDiv.appendChild(moreBtn);
    moreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        bucketPizza.amount++;
        amount.textContent = bucketPizza.amount;
        updateBucketTotalPriceAndAmount();
        updateLocalStorage();

    });

    lessBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (bucketPizza.amount > 1) {
            bucketPizza.amount--;
            amount.textContent = bucketPizza.amount;
        }
        else {
            section.remove();
            bucket.splice(indexOfPizza(bucketPizza), 1);

        }
        updateBucketTotalPriceAndAmount();
        updateLocalStorage();

    });

    controlSection.appendChild(amountDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.dataset.tooltip = 'Видалити з корзини';
    deleteBtn.textContent = '×';

    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        section.remove();
        bucket.splice(indexOfPizza(bucketPizza), 1);
        resizeBucketItemsBackground();
        updateBucketTotalPriceAndAmount();
        updateLocalStorage();

    });

    controlSection.appendChild(deleteBtn);

    section.appendChild(controlSection);
    section.style.backgroundImage = `url(${bucketPizza.icon.slice(0, bucketPizza.icon.length - 3)}png)`;

    return section;
}
function fetchPizzaList(callback) {
    fetch('Pizza_List.json')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.log(error));
}

function handleFilters() {
    let filterOptions = document.querySelectorAll("nav li");
    filterOptions.forEach(item => {
        item.addEventListener("click", () => {
            filterOptions.forEach(li => li.classList.remove("selected"));
            item.classList.add("selected");
            applyFilter(item.id);
            
        })
    })
}
function applyFilter(id) {
    switch (id) {
        case "all": {
            filteredPizzas = allPizzas;
            break;
        }
        case "meat": {
            filteredPizzas = allPizzas.filter(pizza => pizza.type == "М’ясна піца");
            break;
        }
        case "with-pineaples": {
            filteredPizzas = allPizzas.filter(pizza => "pineapple" in pizza.content);
            break;
        }
        case "with-mushrooms": {
            filteredPizzas = allPizzas.filter(pizza => "mushroom" in pizza.content);
            break;
        }
        case "with-seaproducts": {
            filteredPizzas = allPizzas.filter(pizza => pizza.type == "Морська піца");
            break;
        }
        case "vega": {
            filteredPizzas = allPizzas.filter(pizza => pizza.type == "Вега піца");
            break;
        }
    }
    renderMain();
    document.getElementById("allPizzasAmount").innerText = filteredPizzas.length;

}
function stringifyOrder(){
    return bucket.map(pizza =>{ return `${pizza.size.name} ${pizza.title} (${pizza.amount} шт.)`}).join(", ");
}
window.onload = () => {

    fetchPizzaList(data => {
        // Отримані дані доступні у змінній `data`
        console.log(data);
        allPizzas = data;
        filteredPizzas = allPizzas;
        handleFilters();
        if (localStorage.getItem("pizzaKMA") == null) {
            localStorage.setItem("pizzaKMA", JSON.stringify(bucket));
        }
        fetchFromLocalStorage();
        console.log(allPizzas);
        applyFilter("all");
        renderHTML();

        window.addEventListener("resize", () => {
            resizeBucketItemsBackground();

        })
        document.getElementById("order").addEventListener("click", ()=>{
            if (bucket.length==0) {
                alert("Ви не вибрали жодної піци!");
            } else {
                let answer = confirm("Ваше замовлення: "+stringifyOrder()+"\nДо сплати "+totalPrice+" грн. Підтверджуєте замовлення?");
                if (answer==1) {
                    alert("Дякуємо за замовлення!");
                    clearBucket();
                }
            }
        })
    });

};