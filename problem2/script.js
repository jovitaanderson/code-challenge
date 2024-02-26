document.addEventListener("DOMContentLoaded", function () {
  const inputAmount = document.getElementById("input-amount");
  const outputAmount = document.getElementById("output-amount");
  const inputTokenSelect = document.getElementById("input-token");
  const outputTokenSelect = document.getElementById("output-token");
  const inputTokenIcon = document.getElementById("input-token-icon");
  const outputTokenIcon = document.getElementById("output-token-icon");
  let tokenPrices = {};

  // Fetch token prices and populate select options
  fetch("https://interview.switcheo.com/prices.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((tokenInfo) => {
        const { currency, price } = tokenInfo;
        tokenPrices[currency] = price;
      });
      populateTokenOptions(inputTokenSelect, Object.keys(tokenPrices));
      populateTokenOptions(outputTokenSelect, Object.keys(tokenPrices));

      // Set default token for input and output, and update icons on page load
      const defaultInputToken = Object.keys(tokenPrices)[0];
      const defaultOutputToken =
        Object.keys(tokenPrices)[1] || Object.keys(tokenPrices)[0];
      inputTokenSelect.value = defaultInputToken;
      outputTokenSelect.value = defaultOutputToken;
      updateTokenIcon(defaultInputToken, inputTokenIcon);
      updateTokenIcon(defaultOutputToken, outputTokenIcon);
    });

  // Event listeners for token changes to update icons and output amount
  inputTokenSelect.addEventListener("change", () => {
    updateTokenIcon(inputTokenSelect.value, inputTokenIcon);
    updateOutputAmount();
  });

  outputTokenSelect.addEventListener("change", () => {
    updateTokenIcon(outputTokenSelect.value, outputTokenIcon);
    updateOutputAmount();
  });

  inputAmount.addEventListener("input", () => {
    updateOutputAmount();
  });

  document
    .getElementById("swapForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const inputAmountValue = document.getElementById("input-amount").value;
      let warningMessage = "";

      // Warning message based on input value
      if (inputAmountValue === "") {
        warningMessage = "The input amount should not be left blank";
      } else if (inputAmountValue < 0) {
        warningMessage = "The amount to send should be positive";
      }

      if (warningMessage !== "") {
        var modal = document.getElementById("modal-warning");
        var modalContent = modal.querySelector(".modal-content-warning p");
        modalContent.textContent = warningMessage;
        modal.style.display = "block";

        var span = modal.querySelector(".close-button");

        span.onclick = function () {
          modal.style.display = "none";
        };

        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };
        return;
      }

      document.getElementById("input-amount").value = "";
      document.getElementById("output-amount").value = "";

      var modal = document.getElementById("modal");
      modal.style.display = "block";

      var span = document.getElementsByClassName("close-button")[0];

      span.onclick = function () {
        modal.style.display = "none";
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    });

  function populateTokenOptions(selectElement, tokens) {
    tokens.forEach((token) => {
      const option = document.createElement("option");
      option.value = token;
      option.textContent = token;
      selectElement.appendChild(option);
    });
  }

  function updateTokenIcon(token, iconContainer) {
    iconContainer.innerHTML = "";
    const img = document.createElement("img");
    img.src = `tokens/${token}.svg`;
    img.alt = `${token} icon`;
    img.style.width = "24px";
    img.style.height = "24px";
    iconContainer.appendChild(img);
  }

  function calculateOutputAmount(amount, inputToken, outputToken) {
    const inputPrice = tokenPrices[inputToken];
    const outputPrice = tokenPrices[outputToken];
    if (inputPrice && outputPrice && amount) {
      return (amount * inputPrice) / outputPrice;
    } else {
      return "";
    }
  }

  function updateOutputAmount() {
    const amount = inputAmount.value;
    const inputToken = inputTokenSelect.value;
    const outputToken = outputTokenSelect.value;
    const outputAmountValue = calculateOutputAmount(
      amount,
      inputToken,
      outputToken
    );
    outputAmount.value = outputAmountValue.toFixed(2) || "";
  }
});
