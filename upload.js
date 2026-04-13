const uploadInput = document.getElementById("uploadInput");
const uploadBtn = document.getElementById("uploadBtn");
const statusText = document.getElementById("status");

const token = "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"; 
const owner = "rayyamato";
const repo = "my-gallery";

uploadBtn.addEventListener("click", async () => {
  const file = uploadInput.files[0];

  if (!file) {
    statusText.textContent = "Vui lòng chọn ảnh";
    return;
  }

  const reader = new FileReader();

  reader.onload = async function () {
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

    if (response.ok) {
      statusText.textContent = "Tải ảnh thành công! Vui lòng đợi trong giây lát.";
    } else {
      statusText.textContent = "Upload thất bại. Kiểm tra token.";
    }
  };

  reader.readAsDataURL(file);
});