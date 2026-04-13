const uploadInput = document.getElementById("uploadInput");
const uploadBtn = document.getElementById("uploadBtn");
const statusText = document.getElementById("status");

const owner = "rayyamato";
const repo = "my-gallery";

uploadBtn.addEventListener("click", async () => {
    const token = prompt("Nhập Pass để tải ảnh lên:");

    if (!token) {
        statusText.textContent = "Chưa nhập Pass.";
        return;
    }

    const file = uploadInput.files[0];

    if (!file) {
        statusText.textContent = "Vui lòng chọn ảnh.";
        return;
    }

    statusText.textContent = "Đang tải ảnh lên...";

    const reader = new FileReader();

    reader.onload = async function () {
        try {
            const base64 = reader.result.split(",")[1];
            const fileName = `image/${Date.now()}_${file.name}`;

            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: `upload ${file.name}`,
                        content: base64
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {
                statusText.textContent = "Tải ảnh thành công! Vui lòng đợi trong giây lát và trở lại.";
                uploadInput.value = "";
            } else {
                statusText.textContent = "Upload thất bại: " + (result.message || "Lỗi không xác định");
            }
        } catch (error) {
            console.error(error);
            statusText.textContent = "Lỗi upload ảnh.";
        }
    };

    reader.readAsDataURL(file);
});