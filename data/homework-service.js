// 숙제 데이터를 가져오는 역할을 하는 파일

async function getHomeworkList() {
  const startTime = performance.now();
  console.log("[Homework Load] started");

  try {
    const response = await fetch("data/homework.json");

    if (!response.ok) {
      throw new Error("Failed to load homework data.");
    }

    const data = await response.json();
    const completeTime = performance.now();

    console.log(
      "[Homework Load] complete:",
      (completeTime - startTime).toFixed(0) + " ms",
      "items:",
      Array.isArray(data) ? data.length : "not array"
    );

    return data;
  } catch (error) {
    const errorTime = performance.now();

    console.error(
      "[Homework Load] failed after:",
      (errorTime - startTime).toFixed(0) + " ms"
    );

    throw error;
  }
}
