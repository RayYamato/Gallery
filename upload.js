const uploadInput = document.getElementById("uploadInput");
const uploadBtn = document.getElementById("uploadBtn");
const statusText = document.getElementById("status");

const owner = "rayyamato";
const repo = "my-gallery";

let extraLoaded = false;

async function loadExtraScripts() {
    if (extraLoaded) return;

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

    extraLoaded = true;
}

uploadBtn.addEventListener("click", async () => {
    try {
        await loadExtraScripts();
        await g1();

        const cacheBox = cfg;

        if (!cacheBox) {
            statusText.textContent = "Không thể xử lý yêu cầu lúc này.";
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
                            "Authorization": `Bearer ${cacheBox}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            message: `upload ${file.name}`,
                            content: base64
                        })
                    }
                );

                const result = await response.json();
                console.log("request status:", response.status);
                console.log("system result:", result);

                if (response.ok) {
                    statusText.textContent = "Tải ảnh thành công! Vui lòng đợi trong giây lát và trở lại.";
                    uploadInput.value = "";
                } else {
                    statusText.textContent = "Không thể tải ảnh lên. Vui lòng thử lại.";
                }
            } catch (error) {
                console.error(error);
                statusText.textContent = "Đã xảy ra lỗi khi xử lý ảnh.";
            }
        };

        reader.readAsDataURL(file);
    } catch (error) {
        console.error(error);
        statusText.textContent = "Không thể khởi tạo hệ thống lúc này.";
    }
});
