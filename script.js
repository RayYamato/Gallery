const gallery = document.getElementById("gallery");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.getElementById("closeBtn");

const IMAGE_API = "https://api.github.com/repos/rayyamato/my-gallery/contents/image";

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

// load ảnh bình thường
async function loadImages() {
    try {
        const response = await fetch(IMAGE_API, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Lỗi GitHub: " + response.status);
        }

        const files = await response.json();

        gallery.innerHTML = "";

        files.forEach((file) => {
            if (
                file.type === "file" &&
                /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(file.name)
            ) {
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
            }
        });
    } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        gallery.innerHTML = "<p>Không tải được ảnh.</p>";
    }
}

// đóng modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modalImg.src = "";
});

// click ngoài modal để đóng
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        modalImg.src = "";
    }
});

modalImg.draggable = false;

// load ảnh khi vào trang
loadImages();