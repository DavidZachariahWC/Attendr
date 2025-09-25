document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirm-btn");
  const courseNameEl = document.getElementById("course-name");
  const locationInput = document.getElementById("location-input");
  const errorEl = document.getElementById("error");

  // Get course details from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");
  const courseName = urlParams.get("courseName") || "your class";
  const requiredLocation = urlParams.get("location");

  courseNameEl.textContent = courseName;

  confirmBtn.addEventListener("click", () => {
    const currentLocation = locationInput.value;
    errorEl.textContent = "";

    // 1. Check Location
    if (
      !currentLocation ||
      currentLocation.toLowerCase() !== requiredLocation?.toLowerCase()
    ) {
      errorEl.textContent = "You must be in the classroom to check in.";
      return;
    }

    // 2. Simulate Passkey
    const passkeyVerified = window.confirm(
      "Please verify your identity to check in.\n(This is a simulated passkey prompt)",
    );

    // 3. If verified, send message to background script
    if (passkeyVerified) {
      chrome.runtime.sendMessage(
        {
          action: "completeCheckIn",
          courseId: courseId,
        },
        () => {
          // 4. Close the popup
          window.close();
        },
      );
    }
  });
});
