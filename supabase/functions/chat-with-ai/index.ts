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

    const data = await response.json();
    console.log('Hugging Face API response:', data);

    // Check for error response from Hugging Face
    if (!response.ok) {
      // Check if model is still loading
      if (data.error?.includes('Model is loading')) {
        return new Response(
          JSON.stringify({
            error: "The AI model is currently loading. Please try again in a few seconds."
          }),
          {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Handle other API errors
      throw new Error(`Hugging Face API error: ${JSON.stringify(data)}`);
    }

    // Handle the response based on Hugging Face's format
    let generatedText;
    if (Array.isArray(data) && data[0]?.generated_text) {
      // Extract text after the instruction prompt
      generatedText = data[0].generated_text.split('[/INST]')[1]?.trim();
    } else if (typeof data === 'object' && data.generated_text) {
      // Alternative response format
      generatedText = data.generated_text.split('[/INST]')[1]?.trim();
    }

    if (!generatedText) {
      console.error('Unexpected API response format:', data);
      throw new Error('Failed to extract generated text from API response');
    }

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
        error: "An error occurred while processing your request. Please try again in a few seconds." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});