"""Compatibility shim: LlamaIndex 0.14 removed llama_index.core.output_parsers.langchain."""

from typing import Any

from langchain_core.output_parsers import BaseOutputParser as LangchainBaseOutputParser
from llama_index.core.llms import ChatResponse
from llama_index.core.prompts.utils import SafeFormatter
from llama_index.core.types import BaseOutputParser


class LangchainOutputParser(BaseOutputParser):
    """Wrap a LangChain structured parser for LlamaIndex ChatResponse / str."""

    def __init__(
        self,
        output_parser: LangchainBaseOutputParser,
        format_key: str | None = None,
    ) -> None:
        self._output_parser = output_parser
        self._format_key = format_key
        self._formatter = SafeFormatter()

    def parse(self, output: str | ChatResponse) -> Any:
        if isinstance(output, ChatResponse):
            content = output.message.content
            output_str = content if isinstance(content, str) else str(content or "")
        else:
            output_str = str(output) if not isinstance(output, str) else output
        return self._output_parser.parse(output_str)

    def format(self, query: str) -> str:
        format_instructions = self._output_parser.get_format_instructions()
        if self._format_key is not None:
            self._formatter.format_dict = {self._format_key: format_instructions}
            return self._formatter.format(query)
        return query + "\n\n" + format_instructions
