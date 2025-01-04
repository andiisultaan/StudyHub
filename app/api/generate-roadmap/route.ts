import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  try {
    const { topic, description, level } = await req.json();

    // Basic input validation
    if (!topic || !description || !level) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in creating structured learning roadmaps. Your task is to generate a detailed, step-by-step roadmap for the given topic, tailored to the user's goals and skill level. Provide comprehensive and actionable information in your roadmap.",
        },
        {
          role: "user",
          content: `Create a learning roadmap for the topic: "${topic}". 
          User's goal: ${description}
          Current skill level: ${level}

          Instructions:
          1. Generate a roadmap with exactly 5 stages.
          2. Each stage should have exactly 3 topics.
          3. For each topic, provide a name, a detailed description, and 2-3 high-quality online resources with their URLs.
          4. Ensure the roadmap is progressive, starting from the user's current skill level and building up to their goal.
          5. Use clear and concise language in your descriptions.
          6. Provide only the JSON output, without any additional text or markdown formatting.

          The response should strictly adhere to the following JSON structure:
          {
            "goal": "A concise statement of the overall learning goal",
            "skill_level": "The user's current skill level",
            "roadmap": [
              {
                "stage": "Name of the stage (e.g., 'Stage 1: Fundamentals')",
                "topics": [
                  {
                    "name": "Name of the topic",
                    "description": "A detailed description of what to learn in this topic",
                    "resources": [
                      { "name": "Resource name", "url": "https://example.com" },
                      { "name": "Another resource", "url": "https://example.org" }
                    ]
                  },
                  {
                    "name": "Second topic name",
                    "description": "Description of the second topic",
                    "resources": [
                      { "name": "Resource for second topic", "url": "https://example.net" },
                      { "name": "Another resource", "url": "https://example.edu" }
                    ]
                  },
                  {
                    "name": "Third topic name",
                    "description": "Description of the third topic",
                    "resources": [
                      { "name": "Resource for third topic", "url": "https://example.io" },
                      { "name": "Another resource", "url": "https://example.dev" }
                    ]
                  }
                ]
              }
            ]
          }

          Ensure there are exactly 5 stage objects in the roadmap array, each with 3 topic objects.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2500, // Increased to accommodate the full roadmap
    });

    const roadmapString = completion.choices[0].message.content || "{}";

    // Parse the JSON string into an object
    let roadmapData;
    try {
      roadmapData = JSON.parse(roadmapString);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return NextResponse.json({ error: "Failed to parse the generated roadmap" }, { status: 500 });
    }

    // Validate the parsed data structure
    if (!roadmapData || !roadmapData.goal || !roadmapData.skill_level || !Array.isArray(roadmapData.roadmap) || roadmapData.roadmap.length !== 5) {
      return NextResponse.json({ error: "Invalid roadmap structure generated" }, { status: 500 });
    }

    // Additional validation for each stage and topic
    for (const stage of roadmapData.roadmap) {
      if (!stage.stage || !Array.isArray(stage.topics) || stage.topics.length !== 3) {
        return NextResponse.json({ error: "Invalid stage structure in roadmap" }, { status: 500 });
      }
      for (const topic of stage.topics) {
        if (!topic.name || !topic.description || !Array.isArray(topic.resources) || topic.resources.length < 2) {
          return NextResponse.json({ error: "Invalid topic structure in roadmap" }, { status: 500 });
        }
      }
    }

    return NextResponse.json(roadmapData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred while generating the roadmap" }, { status: 500 });
  }
}
