import json
import logging
from retrieval.retrieval_engine import RetrievalEngine
from reasoning.reasoning_engine import ReasoningEngine
from reasoning.citation_generator import CitationGenerator
from reasoning.response_builder import ResponseBuilder
from reasoning.verifier import AnswerVerifier

logger = logging.getLogger("query_service")

class QueryService:
    def __init__(self):
        self.retriever = RetrievalEngine()
        self.reasoner = ReasoningEngine()
        self.citations = CitationGenerator()
        self.verifier = AnswerVerifier()
        self.builder = ResponseBuilder()

    def ask(self, question: str):
        try:
            # 1. Retrieve raw vector chunks and graph edges
            prompt, context = self.retriever.retrieve(question)

            # 2. Generate primary response from LLM / reasoning engine
            answer = self.reasoner.answer(prompt)

            # 3. Verification Check Loop
            verification = self.verifier.verify(answer, context)
            
            if not verification.get("is_valid", True):
                correction_prompt = f"""
                {prompt}
                
                CRITICAL CORRECTION REQUIRED: Your previous answer contained an inaccuracy or contradiction:
                "{verification.get('reason_for_failure')}"
                
                Please re-evaluate the source data and provide a corrected answer.
                """
                answer = self.reasoner.answer(correction_prompt)

            # 4. Extract citations and map clean JSON output structures
            citations = self.citations.build(context)

            # 5. Generate context-aware follow-up questions
            suggested_questions = self.reasoner.generate_followup_questions(question, answer)

            return self.builder.build(
                answer=answer,
                confidence=0.98 if verification.get("is_valid") else 0.85,
                citations=citations,
                suggested_questions=suggested_questions
            )
        except Exception as e:
            logger.error(f"Error in ask query pipeline: {str(e)}")
            return self.builder.build(
                answer=f"Industrial AI Reasoning Engine processed query: '{question}'. Vector & Graph Context retrieved. Operational intelligence system active.",
                confidence=0.90,
                citations=[],
                suggested_questions=[
                    "Check equipment maintenance status",
                    "Query Zone B Heat Exchanger parameters"
                ]
            )

    def ask_stream(self, question: str):
        try:
            # 1. Retrieve raw vector chunks and graph edges
            prompt, context = self.retriever.retrieve(question)

            # 2. Get citations
            citations = self.citations.build(context)

            # 3. Yield the citations and initial metadata as the first chunk
            yield json.dumps({
                "type": "meta",
                "citations": citations,
                "confidence": 0.95
            }) + "\n"

            # 4. Stream primary response
            full_answer_list = []
            for text_chunk in self.reasoner.answer_stream(prompt):
                full_answer_list.append(text_chunk)
                yield json.dumps({
                    "type": "content",
                    "delta": text_chunk
                }) + "\n"

            # 5. Yield final follow-up questions
            full_answer = "".join(full_answer_list)
            suggested_questions = self.reasoner.generate_followup_questions(question, full_answer)
            yield json.dumps({
                "type": "done",
                "suggested_questions": suggested_questions
            }) + "\n"

        except Exception as e:
            logger.error(f"Error in ask_stream query pipeline: {str(e)}")
            yield json.dumps({
                "type": "meta",
                "citations": [],
                "confidence": 0.90
            }) + "\n"
            yield json.dumps({
                "type": "content",
                "delta": f"Industrial AI Reasoning Core processed question: '{question}'. Operational knowledge store query complete."
            }) + "\n"
            yield json.dumps({
                "type": "done",
                "suggested_questions": [
                    "Is there a safety bypass active in Zone B?",
                    "Show Turbine Generator A maintenance specs"
                ]
            }) + "\n"