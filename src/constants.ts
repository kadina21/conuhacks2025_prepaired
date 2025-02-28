export const ROLES = [
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Product Manager",
  "Software Engineer",
];

const MY_MODEL = "llama3.2";

export const getQuestion = async ({ role }) => {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MY_MODEL,
      prompt: `Generate an interview question, for someone interviewing for a position of ${role}, without saying "here is" or any other preamble. This could be a behavioural question, or something slightly more technical. The question must be relevant to a ${role}.`,
      stream: false,
    }),
  });
  return res;
};

export const getFeedback = async ({ userResponse }) => {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MY_MODEL,
      prompt: `You're currently roleplaying as an interviewer. Evaluate the answer like you were directly talking to the interviewee. When giving your answer, no need to acknowledge the fact that you will do what I asked. Please give the answer directly and make it succinct. if the user's response is too short, don't try to evaluate their response. simply say that there was not enough context and they should provide more detail.
          
      At the end, include:
      Clarity Score: X/10
      Quality Score: Y/10
      
      ${userResponse}`,
      stream: false,
    }),
  });
  return res;
};
