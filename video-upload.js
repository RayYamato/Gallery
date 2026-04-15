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
            s.onerror = () =>
                reject(new Error("Không tải được dữ liệu hệ thống."));
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
            videoStatus.textContent =
                "Không thể xử lý yêu cầu lúc này.";
            return;
        }

        // DÙNG MẢNG ĐÃ CHỌN
        const files = window.selectedFiles || [];

        if (files.length === 0) {
            videoStatus.textContent = "Vui lòng chọn video";
            return;
        }

        if (files.length > 10) {
            videoStatus.textContent =
                "Chỉ được chọn tối đa 10 video.";
            return;
        }

        videoStatus.textContent =
            `Đang tải ${files.length} video lên...`;

        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
            try {
                const base64Content = await new Promise(
                    (resolve, reject) => {
                        const reader = new FileReader();

                        reader.onload = function () {
                            resolve(
                                reader.result.split(",")[1]
                            );
                        };

                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    }
                );

                const filePath =
                    `video/${Date.now()}_` +
                    `${Math.random()
                        .toString(36)
                        .slice(2)}_${file.name}`;

                const response = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${cacheBox}`,
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
                    successCount++;
                } else {
                    failCount++;
                }

            } catch (error) {
                console.error(error);
                failCount++;
            }
        }

        if (successCount > 0) {
            videoStatus.textContent =
                `Tải thành công ${successCount} video` +
                (failCount > 0
                    ? `, lỗi ${failCount} video.`
                    : "!");

            // clear toàn bộ danh sách
            window.selectedFiles.length = 0;

            if (window.syncInputFiles) {
                window.syncInputFiles();
            }

            if (window.renderFileList) {
                window.renderFileList();
            }
        } else {
            videoStatus.textContent =
                "Không thể tải video lên. Vui lòng thử lại.";
        }

    } catch (error) {
        console.error(error);
        videoStatus.textContent =
            "Không thể khởi tạo hệ thống lúc này.";
    }
});
