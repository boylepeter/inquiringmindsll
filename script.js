
const cartDOM = document.querySelector('.cart');
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartContent = document.querySelector('.cart-content');
//possible error in future with cartItems vs cartItem
const cartItems = document.querySelector('.cart-item');
const cartBadge = document.querySelector('.cart-badge');
const cartTotal = document.querySelector('.cart-total');
const libraryDOM = document.querySelector('.library-container');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const sidebar = document.querySelector('.sidebar');


let cart = [];
let buttonsDOM = [];

class Presentation {
    async getPresentations() {
        try {
            let result = await fetch('presentations.json');
            let data = await result.json();
            let presentations = data.presentations;
            return presentations
        }
        catch (error) { console.log(error) }
    }
};

class UI {
    displayPresentations(presentations) {
        console.log(presentations);
        let result = '';
        presentations.forEach(presentation => {
            result += `
            <article class="presentation">
            <div class="img-container">
                <img src=${presentation.imgUrl} alt=${presentation.alt} class="presentation-img"></img>
                <button class="add-btn" data-id=${presentation.id}>
                <i class="fas fa-shopping-cart"></i>
                Add to Cart</button>
            </div>
                <h4 class="presentation-title">${presentation.title}<h4>
                <p class="presentation-info">${presentation.info}<p>
        </article>`
        });
        libraryDOM.innerHTML = result;
    };

    getAddButton() {
        const buttons = [...document.querySelectorAll(".add-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button=>{
            let id = button.dataset.id;
            //change add button to incart
            let inCart = cart.find(item => item.id === id);
            if (inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            }
            // Add button onclick
            button.addEventListener('click', event => {
                //after add change button to in cart
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                //Add item to cart, save cart to localstorage
                let cartItem = Storage.getOnePresentation(id);
                cart = [...cart, cartItem];
                Storage.saveCart(cart);
                //Cart pricing
                this.setCartPrice(cart);
                this.addCartItem(cartItem);
                this.showCart();
            });  
        });
    }
    setCartPrice(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        if (cart.length === 1){
            tempTotal += 75
        }
        else if (cart.length === 2){
            tempTotal += 150
        }
        else if (cart.length === 3){
            tempTotal += 200
        }
        else if (cart.length === 4){
            tempTotal += 275
        }
        else if (cart.length === 5){
            tempTotal += 350
        }
        else if (cart.length === 6){
            tempTotal += 400
        }
        else if (cart.length === 7){
            tempTotal += 475
        }
        else if (cart.length === 8){
            tempTotal += 550
        }
        else if (cart.length === 9){
            tempTotal += 600
        }
        else if (cart.length === 10){
            tempTotal += 675
        }
        itemsTotal += cart.length
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        // cartItems.innerText = itemsTotal; (unnecessary at this time)
        cartBadge.innerText = itemsTotal;
    };

    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.imgUrl} alt=${item.alt} class="cart-img" />
        <h4>${item.title}</h4>
        <h5>$75</h5>
        <span class="remove-item" data-id=${item.id}>Remove</span>`
        cartContent.appendChild(div);
    };

    showCart(){
        cartOverlay.classList.add('transparency');
        cartDOM.classList.add('showCart');
    };

    hideCart(){
        cartOverlay.classList.remove('transparency');
        cartDOM.classList.remove('showCart');
    };

    setupApp(){
        cart = Storage.getCart();
        this.setCartPrice(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    };

    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    };

    cartMaint(){
        cartContent.addEventListener('click', event =>{
            if (event.target.classList.contains('remove-item')){
                let deleteItem = event.target;
                let id = deleteItem.dataset.id;
                cartContent.removeChild(deleteItem.parentElement)
                this.removeItem(id);
            }
        })
    }

    removeItem(id){
        cart = cart.filter(item => item.id != id);
        this.setCartPrice(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>Add to Cart`
    };

    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id)
    }
};

class Storage {
    static savePresentations(presentations) {
        localStorage.setItem("presentations", JSON.stringify(presentations));
    }

    static getOnePresentation(id){
        let presentations = JSON.parse(localStorage.getItem('presentations'));
        return presentations.find(presentation => presentation.id === id);
    }

    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    static getCart(){
        return localStorage.getItem('cart') ? 
        JSON.parse(localStorage.getItem('cart')) : []
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const presentations = new Presentation();

    ui.setupApp();

    presentations.getPresentations().then(presentations => {
        ui.displayPresentations(presentations)
        Storage.savePresentations(presentations)
    }).then(() => {
        ui.getAddButton();
        ui.cartMaint();
    })
});

function toggleSidebar(){
    if (sidebar.classList.contains('showSidebar')){
        sidebar.classList.remove('showSidebar');
        sidebarOverlay.classList.remove('showSidebarOverlay');
    } else {
    sidebarOverlay.classList.add('showSidebarOverlay');
    sidebar.classList.add('showSidebar');
    }};
// hamburgerMenu.addEventListener('click', toggleSidebar());