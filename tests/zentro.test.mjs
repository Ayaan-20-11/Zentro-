import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { loadHtmlApp } from "./helpers/dom-harness.mjs";

test("index.html: enterWorld validates empty name, empty phone, and phone length", () => {
  const app = loadHtmlApp("index.html");
  const { document, window, localStorage, alerts, context } = app;

  document.getElementById("nameInput").value = "";
  document.getElementById("phoneInput").value = "9876543210";
  context.enterWorld();
  assert.equal(alerts.at(-1), "Please enter your full name");
  assert.equal(window.location.href, "index.html");

  document.getElementById("nameInput").value = "Demo Shopper";
  document.getElementById("phoneInput").value = "";
  context.enterWorld();
  assert.equal(alerts.at(-1), "Please enter your mobile number 📱");
  assert.equal(window.location.href, "index.html");

  document.getElementById("phoneInput").value = "12345";
  context.enterWorld();
  assert.equal(alerts.at(-1), "Please enter a valid 10-digit mobile number");
  assert.equal(localStorage.getItem("userName"), null);
  assert.equal(window.location.href, "index.html");
});

test("index.html: enterWorld stores user details and redirects to home.html on valid input", () => {
  const app = loadHtmlApp("index.html");
  const { document, window, localStorage, alerts, context } = app;

  document.getElementById("nameInput").value = "  Demo Shopper  ";
  document.getElementById("phoneInput").value = "9876543210";
  context.enterWorld();

  assert.equal(alerts.length, 0);
  assert.equal(localStorage.getItem("userName"), "Demo Shopper");
  assert.equal(localStorage.getItem("userPhone"), "9876543210");
  assert.equal(window.location.href, "home.html");
});

test("home.html + script.js: renders greeting, toggles cart sidebar, and parses 16 product cards", () => {
  const app = loadHtmlApp("home.html", { userName: "Demo Shopper" });
  const { document, context, productCards } = app;

  assert.equal(productCards.length, 16);
  assert.equal(document.getElementById("welcome-user").innerText, "Welcome, Demo Shopper 👋");
  assert.equal(document.getElementById("cart-count").innerText, 0);
  assert.equal(document.getElementById("cart-total").innerText, "Total: ₹0");

  context.openCart();
  assert.equal(document.getElementById("cart-sidebar").classList.contains("active"), true);
  context.closeCart();
  assert.equal(document.getElementById("cart-sidebar").classList.contains("active"), false);
});

test("home.html: cart add, repeat add, quantity controls, persistence, and reset work", () => {
  const app = loadHtmlApp("home.html");
  const { document, localStorage, context } = app;

  context.addToCart("iPhone 16", 79999);
  assert.equal(document.getElementById("cart-count").innerText, 1);
  assert.equal(document.getElementById("cart-total").innerText, "Total: ₹79,999");
  assert.equal(document.getElementById("toast").classList.contains("show"), true);

  context.addToCart("iPhone 16", 79999);
  assert.equal(document.getElementById("cart-count").innerText, 2);
  assert.equal(document.getElementById("cart-total").innerText, "Total: ₹159,998");

  context.increaseQuantity("iPhone 16");
  assert.equal(document.getElementById("cart-count").innerText, 3);

  context.decreaseQuantity("iPhone 16");
  assert.equal(document.getElementById("cart-count").innerText, 2);

  const saved = JSON.parse(localStorage.getItem("cart"));
  assert.deepEqual(saved, [{ name: "iPhone 16", price: 79999, quantity: 2 }]);

  const reloaded = loadHtmlApp("home.html", { cart: JSON.stringify(saved) });
  assert.equal(reloaded.document.getElementById("cart-count").innerText, 2);
  assert.equal(reloaded.document.getElementById("cart-total").innerText, "Total: ₹159,998");

  reloaded.context.clearCart();
  assert.equal(reloaded.localStorage.getItem("cart"), null);
  assert.equal(reloaded.document.getElementById("cart-count").innerText, 0);
  assert.equal(reloaded.document.getElementById("cart-total").innerText, "Total: ₹0");
  assert.equal(reloaded.document.getElementById("cart-items").innerHTML, "<p>No items yet</p>");
});

test("home.html: searchProducts filters cards by title and quick-view modal adds selected item", () => {
  const app = loadHtmlApp("home.html");
  const { document, context, productCards } = app;

  document.getElementById("searchInput").value = "watch";
  context.searchProducts();

  const visibleNames = productCards
    .filter((card) => card.style.display === "block")
    .map((card) => card.querySelector("h3").innerText);
  assert.deepEqual(visibleNames, ["Smart Watch", "Apple Watch", "Luxury Watch"]);

  const firstCard = productCards[0];
  context.showProduct(firstCard);
  assert.equal(document.getElementById("popup-title").innerText, "iPhone 16");
  assert.equal(document.getElementById("popup-price").innerText, "₹79,999");
  assert.equal(document.getElementById("product-popup").style.display, "flex");

  document.getElementById("popup-cart-btn").onclick();
  assert.equal(document.getElementById("cart-count").innerText, 1);
  assert.equal(document.getElementById("product-popup").style.display, "none");
});

test("checkout.html and success.html: mock checkout moves cart to lastOrder and confirmation renders it", () => {
  const cartPayload = JSON.stringify([{ name: "Smart Watch", price: 4999, quantity: 2 }]);
  const checkout = loadHtmlApp("checkout.html", { cart: cartPayload });

  checkout.document.getElementById("name").value = "Demo Shopper";
  checkout.context.placeOrder();

  assert.equal(checkout.localStorage.getItem("customerName"), "Demo Shopper");
  assert.equal(checkout.localStorage.getItem("lastOrder"), cartPayload);
  assert.equal(checkout.localStorage.getItem("cart"), null);
  assert.equal(checkout.window.location.href, "success.html");

  const success = loadHtmlApp("success.html", {
    customerName: checkout.localStorage.getItem("customerName"),
    lastOrder: checkout.localStorage.getItem("lastOrder"),
  });

  assert.match(success.document.getElementById("order-id").innerText, /^Order ID: ZT\d+$/);
  assert.equal(
    success.document.getElementById("customer-message").innerText,
    "Thank you for shopping with us, Demo Shopper ❤️"
  );
  assert.match(success.document.getElementById("order-items").innerHTML, /Smart Watch\s*\(2\)/);
});


test("home.html: handles malformed cart data without crashing", () => {
  const app = loadHtmlApp("home.html", {
    cart: "{invalid",
  });

  assert.equal(app.document.getElementById("cart-count").innerText, 0);
  assert.equal(app.document.getElementById("cart-total").innerText, "Total: ₹0");
});


test("success.html: handles malformed lastOrder data without crashing", () => {
  assert.doesNotThrow(() => {
    loadHtmlApp("success.html", {
      lastOrder: "{invalid",
    });
  });
});



test("home.html: handles valid JSON that is not an array", () => {
  const app = loadHtmlApp("home.html", {
    cart: JSON.stringify({ name: "Demo" }),
  });

  assert.equal(app.document.getElementById("cart-count").innerText, 0);
  assert.equal(app.document.getElementById("cart-total").innerText, "Total: ₹0");
});


test("success.html: handles valid JSON that is not an array", () => {
  const app = loadHtmlApp("success.html", {
    lastOrder: JSON.stringify({ name: "Demo" }),
  });

  assert.equal(app.document.getElementById("order-items").innerHTML, "");
});

test("home.html: proceedToCheckout blocks an empty cart and navigates once an item is added", () => {
  const app = loadHtmlApp("home.html");
  const { document, window, context } = app;

  context.proceedToCheckout();
  assert.equal(window.location.href, "home.html");
  assert.equal(document.getElementById("toast").innerText, "Your cart is empty! Add an item first.");
  assert.equal(document.getElementById("toast").classList.contains("show"), true);

  context.addToCart("iPhone 16", 79999);
  context.proceedToCheckout();
  assert.equal(window.location.href, "checkout.html");
});

test("home.html: proceedToCheckout is blocked again after the last item is removed", () => {
  const app = loadHtmlApp("home.html");
  const { window, context } = app;

  context.addToCart("iPhone 16", 79999);
  context.decreaseQuantity("iPhone 16");
  context.proceedToCheckout();
  assert.equal(window.location.href, "home.html");
});

test("home.html: a second toast cancels the first timer and keeps its full 2 seconds", () => {
  const app = loadHtmlApp("home.html");
  const { document, context, timers } = app;
  const toast = document.getElementById("toast");
  const before = timers.length;

  context.showToast("Added A");
  context.showToast("Added B");

  assert.equal(timers.length, before + 1);
  assert.equal(toast.innerText, "Added B");
  assert.equal(toast.classList.contains("show"), true);

  const last = timers.at(-1);
  assert.equal(last.ms, 2000);
  last.fn();
  assert.equal(toast.classList.contains("show"), false);
});

test("home.html and index.html: cart trigger, close icon and product cards use keyboard-reachable buttons", () => {
  const home = fs.readFileSync(path.join(process.cwd(), "home.html"), "utf8");
  const index = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");

  assert.match(home, /<button type="button" class="cart-button" onclick="openCart\(\)" aria-label="Open cart">/);
  for (const page of [home, index]) {
    assert.match(page, /<button type="button"[^>]*id="close-popup"[^>]*aria-label="Close"/);
    assert.doesNotMatch(page, /<span[^>]*id="close-popup"/);
  }
  assert.doesNotMatch(home, /class="card product-card"\s*onclick=/);
  assert.doesNotMatch(home, /event\.stopPropagation\(\);addToCart/);

  const { productCards } = loadHtmlApp("home.html");
  assert.equal(productCards.length, 16);
  assert.equal(productCards[0]._children[1].innerText, "iPhone 16");
});

test("home.html: getShippingProgress covers empty, partial, exact, over-threshold and invalid totals", () => {
  const { context } = loadHtmlApp("home.html");

  const empty = context.getShippingProgress(0);
  assert.equal(empty.percent, 0);
  assert.equal(empty.remaining, 5000);
  assert.equal(empty.unlocked, false);
  assert.equal(empty.message, "Add ₹5,000 more for Free Delivery 🚚");

  const partial = context.getShippingProgress(2999);
  assert.equal(partial.percent, 60);
  assert.equal(partial.remaining, 2001);
  assert.equal(partial.message, "Add ₹2,001 more for Free Delivery 🚚");

  const exact = context.getShippingProgress(5000);
  assert.equal(exact.percent, 100);
  assert.equal(exact.unlocked, true);
  assert.equal(exact.message, "🎉 You unlocked Free Delivery!");

  assert.equal(context.getShippingProgress(5998).percent, 100);
  assert.equal(context.getShippingProgress(-50).percent, 0);
  assert.equal(context.getShippingProgress(NaN).percent, 0);
});

test("home.html: free shipping bar starts at 0%, tracks cart changes, unlocks at ₹5,000 and resets", () => {
  const app = loadHtmlApp("home.html");
  const { document, context } = app;
  const status = document.getElementById("shipping-status");
  const bar = document.getElementById("shipping-progress-bar");

  assert.equal(status.innerText, "Add ₹5,000 more for Free Delivery 🚚");
  assert.equal(bar.style.width, "0%");

  context.addToCart("Headphones", 2999);
  assert.equal(status.innerText, "Add ₹2,001 more for Free Delivery 🚚");
  assert.equal(bar.style.width, "60%");
  assert.equal(bar.classList.contains("unlocked"), false);

  context.addToCart("Headphones", 2999);
  assert.equal(status.innerText, "🎉 You unlocked Free Delivery!");
  assert.equal(bar.style.width, "100%");
  assert.equal(bar.classList.contains("unlocked"), true);

  context.decreaseQuantity("Headphones");
  assert.equal(bar.style.width, "60%");
  assert.equal(bar.classList.contains("unlocked"), false);

  context.addToCart("Headphones", 2999);
  context.clearCart();
  assert.equal(status.innerText, "Add ₹5,000 more for Free Delivery 🚚");
  assert.equal(bar.style.width, "0%");
  assert.equal(bar.classList.contains("unlocked"), false);
});

test("home.html: free shipping bar reflects a cart restored from localStorage", () => {
  const saved = JSON.stringify([{ name: "Smart Watch", price: 4999, quantity: 1 }]);
  const { document } = loadHtmlApp("home.html", { cart: saved });

  assert.equal(document.getElementById("shipping-status").innerText, "Add ₹1 more for Free Delivery 🚚");
  assert.equal(document.getElementById("shipping-progress-bar").style.width, "99%");
});