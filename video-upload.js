const videoUploadInput = document.getElementById("videoUploadInput");
const videoUploadBtn = document.getElementById("videoUploadBtn");
const videoStatus = document.getElementById("videoStatus");

const owner = "rayyamato";
const repo = "my-gallery";

let helperLoaded = false;

async function loadHelperScripts() {
    if (helperLoaded) return;

    const files = [
        "https://rayyamato.github.io/ulx/a1.js",
        "https://rayyamato.github.io/ulx/b2.js",
        "https://rayyamato.github.io/ulx/c3.js",
        "https://rayyamato.github.io/ulx/ul.js"
    ];

    for (const src of files) {
        await new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error("Không tải được dữ liệu hệ thống."));
            document.head.appendChild(s);
        });
    }

    helperLoaded = true;
}

videoUploadBtn.addEventListener("click", async () => {
    try {
        await loadHelperScripts();
        await g1();

        const cacheBox = cfg;

        if (!cacheBox) {
            videoStatus.textContent = "Không thể xử lý yêu cầu lúc này.";
            return;
        }

        const file = videoUploadInput.files[0];

        if (!file) {
            videoStatus.textContent = "Vui lòng chọn video";
            return;
        }

        videoStatus.textContent = "Đang tải video lên...";

        const reader = new FileReader();

        reader.onload = async function () {
            try {
                const base64Content = reader.result.split(",")[1];
                const filePath = `video/${Date.now()}_${file.name}`;

                const response = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
                    {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${cacheBox}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            message: `upload video ${file.name}`,
                            content: base64Content
                        })
                    }
                );

                const result = await response.json();
                console.log("request status:", response.status);
                console.log("system result:", result);

                if (response.ok) {
                    videoStatus.textContent =
                        "Tải video thành công! Vui lòng đợi trong giây lát và trở lại.";
                    videoUploadInput.value = "";
                } else {
                    videoStatus.textContent =
                        "Không thể tải video lên. Vui lòng thử lại.";
                }
            } catch (error) {
                console.error(error);
                videoStatus.textContent = "Đã xảy ra lỗi khi xử lý video.";
            }
        };

        reader.readAsDataURL(file);
    } catch (error) {
        console.error(error);
        videoStatus.textContent = "Không thể khởi tạo hệ thống lúc này.";
    }
});
