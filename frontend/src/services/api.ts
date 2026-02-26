export async function scanLeaf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://farmlence-1.onrender.com/scan", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Scan failed");
  }

  return response.json();
}
