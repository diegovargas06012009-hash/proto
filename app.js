function toggleMenu() {
    const menu = document.getElementById("mobile-menu");

    if (menu) {
        menu.classList.toggle("active");
    }
}


function openSearch() {
    const searchOverlay = document.getElementById("search-overlay");
    const searchInput = document.getElementById("search-input");

    if (searchOverlay) {
        searchOverlay.classList.add("active");

        setTimeout(() => {
            if (searchInput) {
                searchInput.focus();
            }
        }, 200);
    }
}


function closeSearch() {
    const searchOverlay = document.getElementById("search-overlay");

    if (searchOverlay) {
        searchOverlay.classList.remove("active");
    }
}


function openCart() {
    const cartPanel = document.getElementById("cart-panel");
    const cartOverlay = document.getElementById("cart-overlay");

    if (cartPanel) {
        cartPanel.classList.add("active");
    }

    if (cartOverlay) {
        cartOverlay.classList.add("active");
    }

    updateCart();
}


function closeCart() {
    const cartPanel = document.getElementById("cart-panel");
    const cartOverlay = document.getElementById("cart-overlay");

    if (cartPanel) {
        cartPanel.classList.remove("active");
    }

    if (cartOverlay) {
        cartOverlay.classList.remove("active");
    }
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("almaCacaoCart")) || [];
    } catch (error) {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem("almaCacaoCart", JSON.stringify(cart));
}


function addToCart(name, price) {

    let cart = getCart();

    const existingProduct = cart.find(
        product => product.name === name
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    saveCart(cart);
    updateCart();

    openCart();
}


function removeFromCart(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);
    updateCart();
}


function changeQuantity(index, amount) {

    let cart = getCart();

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    updateCart();
}


function updateCart() {

    const cart = getCart();

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    /* Contadores del carrito */

    const cartCounters = document.querySelectorAll(
        ".cart-count, .cart-number"
    );

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(product => {
        totalItems += product.quantity;
        totalPrice += product.price * product.quantity;
    });

    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
    });


    if (cartItems) {

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">✦</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>
                        Descubre nuestros chocolates
                        y encuentra tu próximo momento dulce.
                    </p>
                </div>
            `;

        } else {

            cartItems.innerHTML = cart.map((product, index) => {

                const subtotal =
                    product.price * product.quantity;

                return `
                    <div class="cart-item">

                        <div class="cart-item-info">

                            <h4>
                                ${escapeHTML(product.name)}
                            </h4>

                            <span>
                                $${product.price.toFixed(2)}
                            </span>

                        </div>


                        <div class="cart-item-actions">

                            <button
                                onclick="changeQuantity(${index}, -1)"
                                aria-label="Disminuir cantidad"
                            >
                                −
                            </button>

                            <strong>
                                ${product.quantity}
                            </strong>

                            <button
                                onclick="changeQuantity(${index}, 1)"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>

                        </div>


                        <div class="cart-item-subtotal">
                            $${subtotal.toFixed(2)}
                        </div>


                        <button
                            class="cart-item-remove"
                            onclick="removeFromCart(${index})"
                            aria-label="Eliminar producto"
                        >
                            ×
                        </button>

                    </div>
                `;

            }).join("");
        }
    }


    if (cartTotal) {
        cartTotal.textContent =
            `$${totalPrice.toFixed(2)}`;
    }
}


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function checkout() {

    const cart = getCart();

    if (cart.length === 0) {

        alert(
            "Tu carrito está vacío. Agrega algún chocolate antes de continuar."
        );

        return;
    }


   const phone = "593999999999";


    let message =
        "Hola Alma Cacao 🍫%0A%0A" +
        "Quiero realizar el siguiente pedido:%0A%0A";


    let total = 0;


    cart.forEach(product => {

        const subtotal =
            product.price * product.quantity;

        total += subtotal;

        message +=
            `• ${product.name} x${product.quantity} — $${subtotal.toFixed(2)}%0A`;
    });


    message +=
        `%0ATotal: $${total.toFixed(2)}`;


    const whatsappURL =
        `https://wa.me/${phone}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );
}


function performSearch() {

    const input =
        document.getElementById("search-input");

    if (!input) {
        return;
    }

    const query =
        input.value.trim().toLowerCase();


    if (!query) {
        return;
    }


    const pages = {

        "chocolate": "Catalogo.html",
        "chocolates": "Catalogo.html",
        "catalogo": "Catalogo.html",

        "colecciones": "colecciones.html",
        "coleccion": "colecciones.html",

        "historia": "historia.html",

        "merch": "merch.html",

        "contacto": "contacto.html"

    };


    for (const keyword in pages) {

        if (query.includes(keyword)) {

            window.location.href =
                pages[keyword];

            return;
        }
    }


    alert(
        `No encontramos resultados para "${input.value}".`
    );
}


document.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        const searchOverlay =
            document.getElementById("search-overlay");

        if (
            searchOverlay &&
            searchOverlay.classList.contains("active")
        ) {

            event.preventDefault();

            performSearch();
        }
    }
});


document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeSearch();
        closeCart();

        const menu =
            document.getElementById("mobile-menu");

        if (menu) {
            menu.classList.remove("active");
        }
    }
});


document.addEventListener("click", function(event) {

    const overlay =
        document.getElementById("cart-overlay");

    if (
        overlay &&
        event.target === overlay
    ) {

        closeCart();
    }
});


document.querySelectorAll(
    ".mobile-menu a"
).forEach(link => {

    link.addEventListener("click", function() {

        const menu =
            document.getElementById("mobile-menu");

        if (menu) {
            menu.classList.remove("active");
        }

    });

});


document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCart();

    }
);

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    
    if (searchInput) {
        searchInput.addEventListener("input", function (e) {
            const query = e.target.value.trim();
            if (query === "6/6") {
                openTeamModal();
            }
        });

        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter" && searchInput.value.trim() === "6/6") {
                openTeamModal();
            }
        });
    }
});

function openTeamModal() {
    closeSearch(); // Cierra la pantalla de búsqueda
    const modal = document.getElementById("team-modal");
    if (modal) {
        modal.style.display = "flex";
    }
}

function closeTeamModal() {
    const modal = document.getElementById("team-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

let score = 0;
let timeLeft = 30;
let gameInterval, spawnerInterval;
let isPlaying = false;
let basketX = 160;

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('final-score');
const basket = document.getElementById('basket');
const playArea = document.getElementById('play-area');

// Referencias para el premio y el leaderboard
const rewardMessage = document.getElementById('reward-message');
const leaderboardList = document.getElementById('leaderboard-list');

function startGame() {
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    gameScreen.classList.add('active');

    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    
    // Limpiar elementos caídos anteriores
    document.querySelectorAll('.falling-item').forEach(item => item.remove());

    isPlaying = true;

    // Temporizador principal del juego
    gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Generador de objetos que caen
    spawnerInterval = setInterval(spawnItem, 600);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(spawnerInterval);

    gameScreen.classList.remove('active');
    gameOverScreen.classList.add('active');
    finalScoreDisplay.textContent = score;

    // Si hace 15 o más puntos, muestra el mensaje de barras gratis
    if (score >= 15) {
        rewardMessage.classList.remove('hidden');
    } else {
        rewardMessage.classList.add('hidden');
    }

    // Actualiza la tabla de mejores puntuaciones
    actualizarLeaderboard(score);
}

// Movimiento de la cesta con el ratón
playArea.addEventListener('mousemove', (e) => {
    if (!isPlaying) return;
    const rect = playArea.getBoundingClientRect();
    basketX = e.clientX - rect.left - 25;
    if (basketX < 0) basketX = 0;
    if (basketX > rect.width - 50) basketX = rect.width - 50;
    basket.style.left = basketX + 'px';
});

// Movimiento táctil para celulares
playArea.addEventListener('touchmove', (e) => {
    if (!isPlaying) return;
    const rect = playArea.getBoundingClientRect();
    basketX = e.touches[0].clientX - rect.left - 25;
    if (basketX < 0) basketX = 0;
    if (basketX > rect.width - 50) basketX = rect.width - 50;
    basket.style.left = basketX + 'px';
});

function spawnItem() {
    if (!isPlaying) return;

    const item = document.createElement('div');
    item.classList.add('falling-item');
    
    const isGood = Math.random() > 0.25;
    item.textContent = isGood ? '🍫' : '💣';
    item.dataset.points = isGood ? 1 : -2;

    const playWidth = playArea.clientWidth;
    let posX = Math.random() * (playWidth - 40);
    item.style.left = posX + 'px';
    item.style.top = '0px';

    playArea.appendChild(item);

    let posY = 0;
    const fallInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(fallInterval);
            item.remove();
            return;
        }

        posY += 4;
        item.style.top = posY + 'px';

        const itemRect = item.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (
            itemRect.bottom >= basketRect.top &&
            itemRect.top <= basketRect.bottom &&
            itemRect.right >= basketRect.left &&
            itemRect.left <= basketRect.right
        ) {
            score += parseInt(item.dataset.points);
            if (score < 0) score = 0;
            scoreDisplay.textContent = score;
            item.remove();
            clearInterval(fallInterval);
        }

        if (posY > playArea.clientHeight) {
            item.remove();
            clearInterval(fallInterval);
        }
    }, 20);
}

function actualizarLeaderboard(nuevoPuntaje) {
    let scores = JSON.parse(localStorage.getItem('almaCacaoScores')) || [];
    
    if (nuevoPuntaje > 0) {
        scores.push(nuevoPuntaje);
        scores.sort((a, b) => b - a);
        scores = scores.slice(0, 5);
        localStorage.setItem('almaCacaoScores', JSON.stringify(scores));
    }

    leaderboardList.innerHTML = '';
    if (scores.length === 0) {
        leaderboardList.innerHTML = '<li>Aún no hay récords</li>';
    } else {
        scores.forEach((s, index) => {
            let li = document.createElement('li');
            li.textContent = `Puesto ${index + 1}: ${s} puntos`;
            leaderboardList.appendChild(li);
        });
    }
}