(function createMirrorModal() {
  // 检查本地缓存中是否已经存储了语言设置并且不等于zh-CN
  const storedLang = window.localStorage.getItem("lang");
  if (
    (navigator.languages.includes("zh") ||
      navigator.languages.includes("zh-CN")) &&
    storedLang !== "zh-CN"
  ) {
    const ANTD_DOT_NOT_SHOW_MIRROR_MODAL = "DO_NOT_OPEN_LANGUAGE_MODAL";

    const lastShowTime = window.localStorage.getItem(
      ANTD_DOT_NOT_SHOW_MIRROR_MODAL
    );
    if (
      lastShowTime &&
      lastShowTime !== "true" &&
      Date.now() - new Date(lastShowTime).getTime() < 7 * 24 * 60 * 60 * 1000
    ) {
      return;
    }

    const style = document.createElement("style");
    style.innerHTML = `
  @keyframes mirror-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes mirror-zoom-in {
    from {
      transform: scale(0.8);
    }
    to {
      transform: scale(1);
    }
  }

  .mirror-modal-mask {
    position: fixed;
    inset: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9999;
    animation: mirror-fade-in 0.3s forwards;
  }

  .mirror-modal-dialog {
    position: fixed;
    top: 120px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 420px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 8px;
    border: 1px solid #eee;
    background: #fff;
    padding: 20px 24px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    animation: mirror-zoom-in 0.3s forwards;
    box-sizing: border-box;
    max-width: 100vw;
    z-index: 9999;
  }

  .mirror-modal-title {
    font-size: 16px;
    font-weight: 500;
    align-self: flex-start;
    margin-bottom: 8px;
  }

  .mirror-modal-content {
    font-size: 14px;
    align-self: flex-start;
    margin-bottom: 24px;
  }

  .mirror-modal-btns {
    align-self: flex-end;
    margin-top: auto;
    display: flex;
    align-items: center;
  }

  .mirror-modal-btn {
    border-radius: 6px;
    cursor: pointer;
    height: 32px;
    box-sizing: border-box;
    font-size: 14px;
    padding: 4px 16px;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    transition: all 0.2s;
  }

  .mirror-modal-confirm-btn {
    background: #3d4653;
    color: #fff;
  }

  .mirror-modal-confirm-btn:hover {
    background: #f5f5f5;
  }

  .mirror-modal-confirm-btn:active {
    background: #ededed;
  }

  .mirror-modal-cancel-btn {
    border: 1px solid #eee;
    color: #000;
    margin-right: 8px;
  }

  .mirror-modal-cancel-btn:hover {
    border-color: #3d4653;
    color: #000;
  }

  .mirror-modal-cancel-btn:active {
    border-color: #0958d9;
    color: #0958d9;
  }

  .mirror-modal-dialog {
    /* 在此处放置 .mirror-modal-dialog 的样式 */
  
    /* 移动端媒体查询 */
    @media (max-width: 768px) {
      top: 35%;
      width: 370px;
    }
  }
  .mirror-modal-close{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  .mirror-modal-close:hover{
    transform: scale(1.2);
  }
    `;
    document.head.append(style);

    const modal = document.createElement("div");
    modal.className = "mirror-modal-mask";

    const dialog = document.createElement("div");
    dialog.className = "mirror-modal-dialog";
    modal.append(dialog);
    const img = document.createElement("img");
    img.classList.add("i-ant-design-close-outlined");
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0Ij48cGF0aCBmaWxsPSIjY2NjY2NjIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03OTkuODU1IDE2Ni4zMTJjLjAyMy4wMDcuMDQzLjAxOC4wODQuMDU5bDU3LjY5IDU3LjY5Yy4wNDEuMDQxLjA1Mi4wNi4wNTkuMDg0YS4xMTguMTE4IDAgMCAxIDAgLjA2OWMtLjAwNy4wMjMtLjAxOC4wNDItLjA1OS4wODNMNTY5LjkyNiA1MTJsMjg3LjcwMyAyODcuNzAzYy4wNDEuMDQuMDUyLjA2LjA1OS4wODNhLjExOC4xMTggMCAwIDEgMCAuMDdjLS4wMDcuMDIyLS4wMTguMDQyLS4wNTkuMDgzbC01Ny42OSA1Ny42OWMtLjA0MS4wNDEtLjA2LjA1Mi0uMDg0LjA1OWEuMTE4LjExOCAwIDAgMS0uMDY5IDBjLS4wMjMtLjAwNy0uMDQyLS4wMTgtLjA4My0uMDU5TDUxMiA1NjkuOTI2TDIyNC4yOTcgODU3LjYyOWMtLjA0LjA0MS0uMDYuMDUyLS4wODMuMDU5YS4xMTguMTE4IDAgMCAxLS4wNyAwYy0uMDIyLS4wMDctLjA0Mi0uMDE4LS4wODMtLjA1OWwtNTcuNjktNTcuNjljLS4wNDEtLjA0MS0uMDUyLS4wNi0uMDU5LS4wODRhLjExOC4xMTggMCAwIDEgMC0uMDY5Yy4wMDctLjAyMy4wMTgtLjA0Mi4wNTktLjA4M0w0NTQuMDczIDUxMkwxNjYuMzcxIDIyNC4yOTdjLS4wNDEtLjA0LS4wNTItLjA2LS4wNTktLjA4M2EuMTE4LjExOCAwIDAgMSAwLS4wN2MuMDA3LS4wMjIuMDE4LS4wNDIuMDU5LS4wODNsNTcuNjktNTcuNjljLjA0MS0uMDQxLjA2LS4wNTIuMDg0LS4wNTlhLjExOC4xMTggMCAwIDEgLjA2OSAwYy4wMjMuMDA3LjA0Mi4wMTguMDgzLjA1OUw1MTIgNDU0LjA3M2wyODcuNzAzLTI4Ny43MDJjLjA0LS4wNDEuMDYtLjA1Mi4wODMtLjA1OWEuMTE4LjExOCAwIDAgMSAuMDcgMFoiLz48L3N2Zz4=";
    dialog.append(img);
    img.classList.add("mirror-modal-close");
    img.addEventListener("click", () => {
      document.body.removeChild(modal);
      document.head.removeChild(style);
      document.body.style.overflow = "";
    });

    const title = document.createElement("div");
    title.className = "mirror-modal-title";
    title.innerText = "提示";
    dialog.append(title);

    const content = document.createElement("div");
    content.className = "mirror-modal-content";
    content.innerText = "⭐ 您的浏览器环境为中文，是否切换为中文模式？";
    dialog.append(content);

    const btnWrapper = document.createElement("div");
    btnWrapper.className = "mirror-modal-btns";
    dialog.append(btnWrapper);

    const cancelBtn = document.createElement("a");
    cancelBtn.className = "mirror-modal-cancel-btn mirror-modal-btn";
    cancelBtn.innerText = "7 天内不再显示";
    btnWrapper.append(cancelBtn);
    cancelBtn.addEventListener("click", () => {
      window.localStorage.setItem(
        ANTD_DOT_NOT_SHOW_MIRROR_MODAL,
        new Date().toISOString()
      );
      document.body.removeChild(modal);
      document.head.removeChild(style);
      document.body.style.overflow = "";
    });

    const confirmBtn = document.createElement("a");
    confirmBtn.className = "mirror-modal-confirm-btn mirror-modal-btn";
    // 点击按钮时的事件处理程序
    confirmBtn.addEventListener("click", function (event) {
      event.preventDefault(); // 禁用默认事件
      // 检查本地缓存中是否已经存储了语言设置
      const storedLang = localStorage.getItem("lang");

      if (storedLang !== "zh-CN") {
        // 如果本地缓存中的语言不是 zh-CN，则设置为 zh-CN，并存储到本地缓存
        localStorage.setItem("lang", "zh-CN");
      }
      const originUrl = window.location.origin;
      window.location.href = originUrl + "/zh"; // 跳转到新的URL
    });
    confirmBtn.innerText = "🐲 立刻前往";
    btnWrapper.append(confirmBtn);

    document.body.append(modal);
    document.body.style.overflow = "hidden";
  }
})();
