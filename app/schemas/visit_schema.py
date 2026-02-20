from enum import Enum
from pydantic import BaseModel

class VisitStatus(str, Enum):
    done = "done"
    rejected = "rejected"
    Done = "Done"
    Rejected = "Rejected"   
    DONE = "DONE"
    REJECTED = "REJECTED"
    
