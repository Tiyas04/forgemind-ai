from llm.groq_client import GroqClient

class ReasoningEngine:
    def __init__(self):
        self.llm = GroqClient()

    def answer(self, prompt: str):
        return self.llm.generate(
            prompt=prompt
        )

    def answer_stream(self, prompt: str):
        return self.llm.generate_stream(
            prompt=prompt
        )

    def generate_followup_questions(self, question: str, answer: str) -> list[str]:
        prompt = f"""
        Based on the user's question: "{question}"
        And the system's generated answer: "{answer}"
        
        Generate exactly 3 short, relevant, context-aware follow-up questions that the user might want to ask next.
        Return them as a simple numbered list, one per line. Do not add any introduction or additional conversational text.
        """
        try:
            response = self.llm.generate(prompt=prompt)
            questions = []
            for line in response.split("\n"):
                line = line.strip()
                if not line:
                    continue
                if line[0].isdigit() and (line[1:3] == ". " or line[1] == "." or line[1] == "-"):
                    q = line.split(".", 1)[-1].split("-", 1)[-1].strip()
                    if q:
                        questions.append(q)
                elif line.startswith("-") or line.startswith("*"):
                    q = line[1:].strip()
                    if q:
                        questions.append(q)
                elif len(line) > 10 and line.endswith("?"):
                    questions.append(line)
            
            # Clean and filter
            questions = [q for q in questions if q.endswith("?")]
            if len(questions) >= 3:
                return questions[:3]
        except Exception:
            pass
            
        return [
            f"What safety checks apply to {question[:20]}?",
            "Are there any historical records related to this?",
            "Can you cite the specific manuals?"
        ]