"""Interfaces shared by scripture sources."""

from abc import ABC, abstractmethod

from py_backend.models.verse import ScriptureReference, VerseContent


class ScriptureSource(ABC):
    @abstractmethod
    def fetch(self, reference: ScriptureReference) -> VerseContent:
        """Fetch text for a reference."""