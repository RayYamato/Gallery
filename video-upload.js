const videoUploadInput = document.getElementById("videoUploadInput");
const videoUploadBtn = document.getElementById("videoUploadBtn");
const videoStatus = document.getElementById("videoStatus");

const token = "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";
const owner = "rayyamato";
const repo = "my-gallery";

videoUploadBtn.addEventListener("click", async () => {
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
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: `upload video ${file.name}`,
                        content: base64Content
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {
                videoStatus.textContent = "Tải video thành công! Vui lòng đợi trong giây lát Và trở lại";
            } else {
                console.error(result);
                videoStatus.textContent =
                    "Upload thất bại: " + (result.message || "Lỗi không xác định");
            }
        } catch (error) {
            console.error(error);
            videoStatus.textContent = "Lỗi upload video";
        }
    };

    reader.readAsDataURL(file);
});