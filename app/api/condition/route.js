import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

export async function POST(request) {

    const res = await request.json()
    const { userQuery } = res;

    const promptQuery = `You are an expert physical therapist. A patient comes to you with the following query: ${userQuery}.\n Please generate a report including the following in markdown. Only output the markdown with the requested content:\n #Diagnosis #Recommended Exercises #Amount of times track the exercise to track improvement\n\n`;

    try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: promptQuery,
          max_tokens: 300
        });

        const aiResponse = completion.data.choices[0].text
        return NextResponse.json({ aiResponse });
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }

        return NextResponse.error(error);
      }
}