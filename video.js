const videoGallery = document.getElementById("videoGallery");
const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const videoCloseBtn = document.getElementById("videoCloseBtn");

// chặn thao tác thừa
window.addEventListener("contextmenu", (e) => {
    if (
        e.target.tagName === "VIDEO" ||
        e.target.closest("#videoGallery") ||
        e.target.closest("#videoModal")
    ) {
        e.preventDefault();
    }
});

window.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "VIDEO") {
        e.preventDefault();
    }
});

document.addEventListener("selectstart", (e) => {
    if (
        e.target.tagName === "VIDEO" ||
        e.target.closest("#videoGallery") ||
        e.target.closest("#videoModal")
    ) {
        e.preventDefault();
    }
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
            videoGallery.innerHTML = "<p>Không tải được video.</p>";
            return;
        }

        videoGallery.innerHTML = "";

        files.forEach((file) => {
            if (
                file.type === "file" &&
                /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name)
            ) {
                const card = document.createElement("div");
                card.className = "card";

                const video = document.createElement("video");
                video.src = file.download_url;
                video.muted = true;
                video.playsInline = true;
                video.preload = "metadata";
                video.controls = false;
                video.draggable = false;
                video.setAttribute("playsinline", "");
                video.setAttribute(
                    "controlslist",
                    "nodownload noplaybackrate noremoteplayback"
                );
                video.disablePictureInPicture = true;

                video.style.width = "100%";
                video.style.height = "220px";
                video.style.objectFit = "cover";
                video.style.borderRadius = "12px";
                video.style.cursor = "pointer";
                video.style.userSelect = "none";

                video.addEventListener("click", () => {
                    videoModal.style.display = "flex";
                    modalVideo.src = file.download_url;
                    modalVideo.currentTime = 0;
                    modalVideo.play();
                });

                card.appendChild(video);
                videoGallery.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Lỗi tải video:", error);
        videoGallery.innerHTML = "<p>Không tải được video.</p>";
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