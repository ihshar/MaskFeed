import { streamText } from "ai";
import { NextResponse } from "next/server";
import OpenAI, { OpenAIError } from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const runtime = 'edge'

export async function POST(request:Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single' string Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this:What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?ll What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. "
    
        const response = await openai.completions.create({
        model: "davinci-002",
        prompt: prompt,
        max_tokens: 200,
        stream: true,
      });

      
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.text || "";
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        }
      });

      return new Response(stream);
    } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name,status,headers,message} = error
            return NextResponse.json(
                {name,status,headers,onmessage},
                {status}
            )
        }
        else{
            console.log("An unexpected error occured:",error);
            throw error;
        }
    }
}