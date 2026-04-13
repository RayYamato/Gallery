const gallery = document.getElementById("gallery");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.getElementById("closeBtn");

const IMAGE_API = "https://api.github.com/repos/rayyamato/my-gallery/contents/image";
let lastImageKey = "";

window.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG" || e.target.closest("#gallery") || e.target.closest("#imageModal")) {
        e.preventDefault();
    }
});

window.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});

document.addEventListener("selectstart", (e) => {
    if (e.target.tagName === "IMG" || e.target.closest("#gallery") || e.target.closest("#imageModal")) {
        e.preventDefault();
    }
});

async function loadImages() {
    try {
        const response = await fetch(IMAGE_API, { cache: "no-store" });
        const files = await response.json();

        if (!Array.isArray(files)) return;

        const imageFiles = files.filter(file =>
            file.type === "file" &&
            /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(file.name)
        );

        const currentKey = imageFiles.map(file => file.name).sort().join("|");
        if (currentKey === lastImageKey) return;
        lastImageKey = currentKey;

        gallery.innerHTML = "";

        imageFiles.forEach(file => {
            const img = document.createElement("img");
            img.src = file.download_url;
            img.alt = file.name;
            img.loading = "lazy";
            img.draggable = false;

            img.addEventListener("click", () => {
                modal.style.display = "flex";
                modalImg.src = file.download_url;
            });

            gallery.appendChild(img);
        });
    } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        gallery.innerHTML = "<p>Không tải được ảnh từ GitHub.</p>";
    }
}

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
