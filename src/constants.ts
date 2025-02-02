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

export const getAdvice = async () => {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MY_MODEL,
      prompt: `Pretend you're a coach to someone interviewing for tech jobs. Your platform is helping them do mock interviews and prepare for real interviews. Pretend you have access to all their interview history, with their performances, clarity and quality scores for responses, etc. Write a brief message to them to advise them on next steps, for example, "Given your interview history, it seems like you're doing great! Keep up the good work!". Always start with "Given your interview history" to make it seem like you're basing it off analyzed data. DON'T use placeholders for personal information, just don't mention any details like that. No preamble or intro, just return exactly what you'd say.`,
      stream: false,
    }),
  });
  return res;
};
