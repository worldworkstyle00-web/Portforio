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

// --- お問い合わせフォーム送信処理（EmailJS） ---
// EmailJS 初期化
emailjs.init("TMbYbHm3jZpgCLjx6");

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "送信中です...";
    }

    if (formStatus) {
      formStatus.textContent = "送信処理中です...";
      formStatus.style.color = "#666";
      formStatus.style.display = "block";
    }

    try {
      // EmailJS を使用してメール送信
      const response = await emailjs.send(
        "service_nl4z1ym",      // Service ID
        "template_qts6n8j",     // Template ID
        {
          user_name: document.getElementById("user_name").value,
          user_email: document.getElementById("user_email").value,
          message: document.getElementById("message").value,
        }
      );

      if (response.status === 200) {
        formStatus.textContent = "送信が完了しました。ご連絡ありがとうございます。確認後、ご返信させていただきます。";
        formStatus.style.color = "#28a745";
        contactForm.reset();
      }
    } catch (error) {
      console.error("メール送信エラー:", error);
      formStatus.textContent = "送信に失敗しました。しばらくしてから再度お試しください。";
      formStatus.style.color = "#d33";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "送信する";
      }
    }
  });
}
