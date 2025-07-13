export const verifyHuman = async (
  token: string,
  locale: string
): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`/${locale}/api/v1/verifications/human`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    return {
      success: false,
      message: "Server error",
    };
  }

  const result = await res.json();

  return {
    success: result.success,
    message: result.message,
  };
};
