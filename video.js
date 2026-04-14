const videoGallery = document.getElementById("videoGallery");
const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const videoCloseBtn = document.getElementById("videoCloseBtn");

let videoFiles = [];
let currentVideoIndex = -1;

// chặn thao tác thừa
window.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "VIDEO" || 
        e.target.closest("#videoGallery") || 
        e.target.closest("#videoModal")) {
        e.preventDefault();
    }
});

window.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "VIDEO") {
        e.preventDefault();
    }
});

document.addEventListener("selectstart", (e) => {
    if (e.target.tagName === "VIDEO" || 
        e.target.closest("#videoGallery") || 
        e.target.closest("#videoModal")) {
        e.preventDefault();
    }
});

// ===== TẠO NÚT TRƯỚC / TIẾP TRONG MODAL =====
const prevBtn = document.createElement("button");
prevBtn.type = "button";
prevBtn.textContent = "‹";

const nextBtn = document.createElement("button");
nextBtn.type = "button";
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
    btn.style.background = "rgba(0, 0, 0, 0.6)";
    btn.style.color = "#fff";
    btn.style.fontSize = "28px";
    btn.style.cursor = "pointer";
    btn.style.userSelect = "none";
    btn.style.display = "none";
});

prevBtn.style.left = "16px";
nextBtn.style.right = "16px";

videoModal.appendChild(prevBtn);
videoModal.appendChild(nextBtn);

function updateNavButtons() {
    const show = videoFiles.length > 1;
    prevBtn.style.display = show ? "block" : "none";
    nextBtn.style.display = show ? "block" : "none";
}

function openVideoByIndex(index) {
    if (!videoFiles.length) return;

    if (index < 0) index = videoFiles.length - 1;
    if (index >= videoFiles.length) index = 0;

    currentVideoIndex = index;
    const file = videoFiles[currentVideoIndex];

    videoModal.style.display = "flex";
    modalVideo.pause();
    modalVideo.src = file.download_url;
    modalVideo.currentTime = 0;

    // LOOP cho video trong modal
    modalVideo.loop = true;

    modalVideo.controls = true;
    modalVideo.setAttribute(
        "controlsList",
        "nodownload noplaybackrate noremoteplayback nofullscreen"
    );
    modalVideo.disablePictureInPicture = true;

    modalVideo.load();
    modalVideo.play().catch(() => {});

    updateNavButtons();
}

// nút video trước
prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openVideoByIndex(currentVideoIndex - 1);
});

// nút video tiếp
nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openVideoByIndex(currentVideoIndex + 1);
});

// ===== LOAD VIDEO 1 LẦN =====
async function loadVideos() {
    try {
        const response = await fetch(
            "https://api.github.com/repos/rayyamato/my-gallery/contents/video",
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error("Lỗi GitHub: " + response.status);
        }

        const files = await response.json();

        if (!Array.isArray(files)) {
            videoGallery.innerHTML = `<p>Không tải được video.</p>`;
            return;
        }

        videoFiles = files.filter(
            (file) => file.type === "file" && /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name)
        );

        if (videoFiles.length === 0) {
            videoGallery.innerHTML = `<p>Không có video.</p>`;
            updateNavButtons();
            return;
        }

        videoGallery.innerHTML = "";

        videoFiles.forEach((file, index) => {
            const card = document.createElement("div");
            card.className = "card";

            const video = document.createElement("video");
            video.src = file.download_url;
            video.muted = true;
            video.playsInline = true;
            video.preload = "metadata";
            video.controls = false;
            video.draggable = false;

            // LOOP cho video thumbnail
            video.loop = true;

            video.setAttribute("playsinline", "");
            video.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback");
            video.disablePictureInPicture = true;

            video.style.width = "100%";
            video.style.height = "220px";
            video.style.objectFit = "cover";
            video.style.borderRadius = "12px";
            video.style.cursor = "pointer";
            video.style.userSelect = "none";

            video.addEventListener("click", () => {
                openVideoByIndex(index);
            });

            card.appendChild(video);
            videoGallery.appendChild(card);
        });

        updateNavButtons();
    } catch (error) {
        console.error("Lỗi tải video:", error);
        videoGallery.innerHTML = `<p>Không tải được video.</p>`;
        updateNavButtons();
    }
}

// đóng modal
videoCloseBtn.addEventListener("click", () => {
    videoModal.style.display = "none";
    modalVideo.pause();
    modalVideo.src = "";
});

// click ra ngoài để đóng
videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
        videoModal.style.display = "none";
        modalVideo.pause();
        modalVideo.src = "";
    }
});

// load khi mở trang
loadVideos();
