const gallery = document.getElementById("gallery");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.getElementById("closeBtn");

const IMAGE_API = "https://api.github.com/repos/rayyamato/my-gallery/contents/image";

// ===== STATE =====
let images = [];
let currentPage = 1;
let currentIndex = -1;

// 👉 1 hàng = 5 ảnh, 4 hàng = 20 ảnh / trang
const perPage = 20;

// chặn chuột phải
window.addEventListener("contextmenu", (e) => {
    if (
        e.target.tagName === "IMG" ||
        e.target.closest("#gallery") ||
        e.target.closest("#imageModal")
    ) {
        e.preventDefault();
    }
});

// chặn kéo ảnh
window.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});

// chặn bôi chọn
document.addEventListener("selectstart", (e) => {
    if (
        e.target.tagName === "IMG" ||
        e.target.closest("#gallery") ||
        e.target.closest("#imageModal")
    ) {
        e.preventDefault();
    }
});

// ===== NAV BUTTONS (MODAL) =====
const prevBtn = document.createElement("button");
const nextBtn = document.createElement("button");

prevBtn.textContent = "‹";
nextBtn.textContent = "›";

[prevBtn, nextBtn].forEach((btn) => {
    btn.style.position = "absolute";
    btn.style.top = "50%";
    btn.style.transform = "translateY(-50%)";
    btn.style.zIndex = "9999";
    btn.style.width = "48px";
    btn.style.height = "48px";
    btn.style.border = "none";
    btn.style.borderRadius = "999px";
    btn.style.background = "rgba(0,0,0,0.6)";
    btn.style.color = "#fff";
    btn.style.fontSize = "28px";
    btn.style.cursor = "pointer";
    btn.style.userSelect = "none";
    btn.style.display = "none";
});

prevBtn.style.left = "16px";
nextBtn.style.right = "16px";

modal.appendChild(prevBtn);
modal.appendChild(nextBtn);

// ===== UPDATE NAV =====
function updateNavButtons() {
    const show = images.length > 1;
    prevBtn.style.display = show ? "block" : "none";
    nextBtn.style.display = show ? "block" : "none";
}

// ===== OPEN IMAGE =====
function openImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;

    currentIndex = index;

    modal.style.display = "flex";
    modalImg.src = images[currentIndex].download_url;

    updateNavButtons();
}

// ===== CLICK NAV =====
prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openImage(currentIndex - 1);
});

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openImage(currentIndex + 1);
});

// ===== PAGINATION UI =====
const pagination = document.createElement("div");
pagination.style.display = "flex";
pagination.style.justifyContent = "center";
pagination.style.gap = "8px";
pagination.style.margin = "20px 0";

document.body.appendChild(pagination);

function renderPagination() {
    const totalPages = Math.ceil(images.length / perPage);
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        btn.style.padding = "6px 12px";
        btn.style.border = "none";
        btn.style.borderRadius = "8px";
        btn.style.cursor = "pointer";

        btn.style.background = i === currentPage ? "#333" : "#eee";
        btn.style.color = i === currentPage ? "#fff" : "#000";

        btn.addEventListener("click", () => {
            currentPage = i;
            renderGallery();
        });

        pagination.appendChild(btn);
    }
}

// ===== RENDER GALLERY =====
function renderGallery() {
    gallery.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const pageItems = images.slice(start, end);

    pageItems.forEach((file, idx) => {
        const realIndex = start + idx;

        const img = document.createElement("img");
        img.src = file.download_url;
        img.alt = file.name;
        img.loading = "lazy";
        img.draggable = false;

        img.addEventListener("click", () => {
            openImage(realIndex);
        });

        gallery.appendChild(img);
    });

    renderPagination();
}

// ===== LOAD IMAGES =====
async function loadImages() {
    try {
        const response = await fetch(IMAGE_API, { cache: "no-store" });

        const files = await response.json();

        images = files.filter((file) =>
            file.type === "file" &&
            /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(file.name)
        );

        currentPage = 1;
        renderGallery();

    } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        gallery.innerHTML = "<p>Không tải được ảnh.</p>";
    }
}

// ===== CLOSE MODAL =====
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modalImg.src = "";
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        modalImg.src = "";
    }
});

modalImg.draggable = false;

loadImages();
