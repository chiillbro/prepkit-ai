export function useKitGenerator() {
  // The hook itself no longer holds state. It just provides the fetching logic.
  const generateKit = async ({
    days,
    topics,
  }: {
    days: number;
    topics: string[];
  }) => {
    if (topics.length === 0 || !days || days < 1) {
      throw new Error(
        "Please select at least one topic and provide a valid number of days."
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kits/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days, topics }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "An unknown error occurred.");
    }

    return await response.json();
  };

  return { generateKit };
}
