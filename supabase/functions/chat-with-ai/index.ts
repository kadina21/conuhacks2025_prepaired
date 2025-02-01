import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const HF_ACCESS_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    // Using Hugging Face's Meta Llama 2 model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<s>[INST] You are an expert interviewer helping candidates practice for job interviews. Provide constructive feedback and follow-up questions.

Here is the candidate's response: ${prompt} [/INST]`,
          parameters: {
            max_length: 1000,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.15
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Hugging Face API error:', error);
      throw new Error(`Hugging Face API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    // Extract the generated text from the response
    const generatedText = data[0].generated_text.split('[/INST]')[1].trim();

    return new Response(
      JSON.stringify({ response: generatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request. Please try again later." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});