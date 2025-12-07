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
    e.preventDefault();

    formStatus.textContent = "送信中です…";
    formStatus.style.color = "#666";

    const formData = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      message: contactForm.message.value,
    };

    const response = await fetch(
      "https://api.github.com/repos/worldworkstyle00-web/Portfolio/dispatches",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.github.everest-preview+json",
          Authorization: `Bearer ${GITHUB_TOKEN}`, // ※実際には後で Secrets 参照に変える
        },
        body: JSON.stringify({
          event_type: "sendmail",
          client_payload: formData,
        }),
      }
    );

    if (response.ok) {
      formStatus.textContent = "送信が完了しました。追ってご連絡いたします。";
      formStatus.style.color = "#28a745";
      contactForm.reset();
    } else {
      formStatus.textContent = "送信に失敗しました。しばらくしてから再度お試しください。";
      formStatus.style.color = "#d33";
    }
  });
}
