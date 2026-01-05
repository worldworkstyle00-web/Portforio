// ハンバーガーメニュー
const navToggle = document.querySelector(".nav-toggle");
const navLinksContainer = document.querySelector(".nav-links");

if (navToggle && navLinksContainer) {
  navToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("open");
  });
}

// 「上へ戻る」ボタン
const backToTopBtn = document.querySelector(".back-to-top");

const updateBackToTop = () => {
  if (!backToTopBtn) return;
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
};

if (backToTopBtn) {
  window.addEventListener("scroll", updateBackToTop);
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- お問い合わせフォーム送信処理 ---
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    // e.preventDefault(); // Formspree の自動送信を使用するため、ここでは preventDefault しない
    
    const submitBtn = contactForm.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "送信中です...";
    }

    // フォーム送信後のステータス表示
    setTimeout(() => {
      formStatus.textContent = "送信ありがとうございます。確認後、ご返信させていただきます。";
      formStatus.style.color = "#28a745";
      formStatus.style.display = "block";
    }, 1000);
  });

  // Formspree からのリダイレクト時（オプション）
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("success") === "true") {
    formStatus.textContent = "送信が完了しました。確認後、ご返信させていただきます。";
    formStatus.style.color = "#28a745";
    formStatus.style.display = "block";
  }
}
