export const generateIdeaWithOpenRouter = async (category: string) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // o "mistralai/mistral-7b-instruct"
        messages: [
          {
            role: "user",
            content: `Generá una idea creativa para un texto literario basada en la categoría: "${category}". El texto debe ser coherente con los 120 caracteres maximos. ( No olvides que la idea debe ser original y creativa)`,
          }
        ],
        temperature: 0.9,
        max_tokens: 120,
      }),
    });
  
    const data = await response.json();
    return data.choices[0]?.message?.content?.trim();
  };
  