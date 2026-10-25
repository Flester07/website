// Simple password box. Light deterrent only: the page content is still sent to the browser.
// To change the password, replace HASH with the SHA-256 of the new password.
(function () {
  var HASH = "c75e2ed02d0dce01b990075bd5c455c7cf9922b634a1b0b47bceb88ba5a0a66e";
  var KEY = "site-unlocked";

  try {
    if (sessionStorage.getItem(KEY) === HASH) return;
  } catch (e) {}

  var style = document.createElement("style");
  style.textContent =
    "html.pw-locked body > *:not(#pw-gate){display:none !important}" +
    "#pw-gate{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#fff;color:#222;font-family:Lato,sans-serif;z-index:99999}" +
    "#pw-gate form{text-align:center;padding:1rem}" +
    "#pw-gate input{font-size:1rem;padding:.5rem;margin:.5rem .25rem}" +
    "#pw-gate button{font-size:1rem;padding:.5rem 1rem}" +
    "#pw-msg{color:#b00;min-height:1.5em;margin:0}";
  document.head.appendChild(style);
  document.documentElement.classList.add("pw-locked");

  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var gate = document.createElement("div");
    gate.id = "pw-gate";
    gate.innerHTML =
      '<form><p>This site is private for now. Please enter the password.</p>' +
      '<input type="password" id="pw-input" autocomplete="off" autofocus />' +
      '<button type="submit">Enter</button><p id="pw-msg"></p></form>';
    document.body.appendChild(gate);

    gate.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      sha256(document.getElementById("pw-input").value).then(function (h) {
        if (h === HASH) {
          try { sessionStorage.setItem(KEY, HASH); } catch (err) {}
          document.documentElement.classList.remove("pw-locked");
          gate.remove();
        } else {
          document.getElementById("pw-msg").textContent = "That password isn't right.";
        }
      });
    });
  });
})();
