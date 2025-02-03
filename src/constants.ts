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
      prompt: `You're currently roleplaying as an interviewer. Evaluate the answer like you were directly talking to the interviewee. When giving your answer, no need to acknowledge the fact that you will do what I asked. Please give the answer directly and make it succinct. Low-effort and poor quality responses should receive low scores.
          
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
      prompt: `Pretend you're a coach to someone interviewing for tech jobs. Your platform is helping them do mock interviews and prepare for real interviews. Imagine you have access to all their interview history, with their performances, clarity and quality scores for responses, etc. Write a brief message to them to advise them on next steps, given that their interview is 5 days away. For example, "Given your interview history, it seems like you're doing great! Keep up the good work!". Always start with "Given your interview history" to make it seem like you're basing it off analyzed data. DON'T use placeholders for personal information, DON'T use [square bracket placeholders], just don't mention any details like that. No preamble or intro, just return exactly what you'd say.`,
      stream: false,
    }),
  });
  return res;
};

export const LEETCODE_QUESTIONS = [
  "Two Sum",
  "Add Two Numbers",
  "Longest Substring Without Repeating Characters",
  "Median of Two Sorted Arrays",
  "Zigzag Conversion",
  "Reverse Integer",
  "String to Integer (atoi)",
  "Palindrome Number",
  "Roman to Integer",
  "Longest Palindromic Substring",
  "Container With Most Water",
  "Integer to Roman",
  "3Sum",
  "Letter Combinations of a Phone Number",
  "Valid Parentheses",
  "Merge Two Sorted Lists",
  "Generate Parentheses",
  "Merge Intervals",
  "Insert Interval",
  "Longest Increasing Subsequence",
  "Search in Rotated Sorted Array",
  "Find Minimum in Rotated Sorted Array",
  "Kth Largest Element in an Array",
  "Search Insert Position",
  "Valid Sudoku",
  "Sudoku Solver",
  "Count and Say",
  "Maximum Subarray",
  "Spiral Matrix",
  "Set Matrix Zeroes",
  "Rotate Image",
  "Group Anagrams",
  "Subsets",
  "Combination Sum",
  "Permutations",
  "Word Search",
  "Unique Paths",
  "Climbing Stairs",
  "Jump Game",
  "Merge k Sorted Lists",
  "Palindrome Partitioning",
  "N-Queens",
  "Sudoku Solver",
  "Coin Change",
  "Word Ladder",
  "Longest Consecutive Sequence",
  "Maximal Square",
  "Find the Duplicate Number",
  "Max Points on a Line",
  "Edit Distance",
  "Search a 2D Matrix",
  "Longest Substring with At Most Two Distinct Characters",
  "Course Schedule",
  "Rotate Array",
  "Partition Equal Subset Sum",
  "Combination Sum IV",
  "K Closest Points to Origin",
  "Number of Islands",
  "Clone Graph",
  "Top K Frequent Elements",
  "Valid Anagram",
  "Linked List Cycle",
  "Flatten Nested List Iterator",
  "Count Primes",
  "Number of 1 Bits",
  "Bitwise AND of Numbers Range",
  "Hamming Distance",
  "Single Number",
  "Single Number II",
  "Missing Number",
];
